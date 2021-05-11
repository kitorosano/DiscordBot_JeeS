const {Client, Collection, MessageEmbed, TextChannel} = require('discord.js');
const {prefix, allowedUsers, modUsers, token, mongo, xp} = require('./config');
const {modMe,setRoles} = require('./utils');
const fs = require('fs');
const rnd = require('random');
const {scheduleJob, cancelJob} = require('node-schedule');
const Levels = require("discord-xp");
Levels.setURL(mongo);

const client = new Client();
client.commands = new Collection();
const cooldowns = new Collection();

/** OBTENER TODOS LOS COMANDOS */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  if(!command.disable) client.commands.set(command.name, command);
}
/** */ 

/** INICIALIZAR EVENTOS DEL DIA */
const restartEvents = async() =>{ 
  const today = new Date().toDateString().split(' '); // Obtener fecha de hoy
  // console.log(today);
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
  for (const file of eventFiles) { //para cada tipo de evento como archivo .js, obtengo los eventos del dia.
    const typeEvent = require(`./events/${file}`); //ESTO PASARSELO AL COMANDO ¡events, PARA EVENTOS DEL DIA
    if(typeEvent.disable) return; //filtrar eventos desactivados
    
    const typeEvents = await typeEvent.getEvents(today,client) //Obtener entradas del dia para este tipo de evento
    if(!typeEvents.length) return; //Si no hay nada de este evento para hoy, a.k.a si el array esta vacio
    
    typeEvents.forEach(singleEventData => { //para cada evento de grupo, configurar una "alarma" del dia para cada uno
      typeEvent.execute(singleEventData,client);
    })
  } 
};

scheduleJob("0 3 * * *", () => restartEvents()); // REINICIAR EVENTOS CADA DIA A LAS 00:00 UTC-3
/** */


/** MENSAJE DE BIENVENIDA **/
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-general');
  if (!channel) return;
  channel.send(`Bienvenido al servidor, ${member}!`)
})
/** */


/** CUANDO SE ENVIA UN MENSAJE **/
client.on('message', async (msg) => {
  let {content, author, member, channel, guild} = msg;
  if(author.bot) return; // TERMINAR SI ES UN BOT

  const hasLeveledUp = await Levels.appendXp(author.id, guild.id, rnd.int(xp.from,xp.to)); //Agrego a la BD la nueva xp entre <from> a <to>
  if(hasLeveledUp) {
    const {level} = await Levels.fetch(author.id, guild.id);
    const MsgLvlUp = new MessageEmbed()
            .setColor('#ADC00')
            .setAuthor(`¡Felicidades! ${author.username}`, author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}))
            .setDescription(`:tada: Has ascendido a **nivel ${level}**!. :confetti_ball: Cada vez mas cerca del admin.`)
    // const rankChannel = await client.channels.fetch('772141688444682272'); //enviar mensaje al canal de spam
    const rankChannel = guild.channels.resolve('772141688444682272') || channel;
    rankChannel.send(MsgLvlUp)
  }
  
  if (!content.startsWith(prefix)) return; //TERMINAR SI NO ES UN COMANDO

  const args = content.slice(prefix.length).split(/ +/); //Obtengo un array con el comando sin el prefijo y los argumentos
  const commandName = args.shift().toLowerCase(); //Aparto el comando del array de los argumentos y lo hago minuscula.

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return; //OBTENER COMANDO O SU ALIAS, Y SI ESTE NO EXISTE TERMINAR
  
  // const MsgNoMod = new MessageEmbed().setColor('RED').setDescription(':no_pedestrians: Alto ahí pantalones cuadrados... :eyes:')
  const isMod = member.roles.cache.find(role => role.name === 'Moderador' || role.name === 'Admin');
  if(command.modOnly && !isMod) {// MENSAJE PARA COMANDOS SOLO DE MODERADORES
    return channel.send(`:no_pedestrians: **${author.username}**, alto ahí pantalones cuadrados.`) 
  } 

  
  if (command.guildOnly && channel.type === 'dm') return channel.send('No puedo ejecutar eso por mensaje directo');
  
  if (command.args && !args.length) {
    const replyMsg = new MessageEmbed().setColor('RED').setTitle(`Algo le falta al comando...`)

    if(command.usage) {
      replyMsg.setDescription(`El uso correcto sería: \`${prefix}${command.name} ${command.usage}\``)
    }
    return channel.send(replyMsg);
  }


  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 2) * 1000;
  
  if (timestamps.has(author.id)) {
    const expirationTime = timestamps.get(author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      msg.reply(`por favor espera ${timeLeft.toFixed(1)} segundo(s) mas para reusar el comando \`${command.name}\``)
      .then(msg => {
        msg.delete({timeout: 5000})
      })
      return;
    }
  }
  timestamps.set(author.id, now);
  setTimeout(() => timestamps.delete(author.id), cooldownAmount);

  try { //ejecutar
    command.execute(msg, args, isMod);
  } catch (error) {
    console.error(error);
    const MsgError = new MessageEmbed().setColor("RED").setAuthor('Ha ocurrido un error al ejecutar el comando!');
    msg.reply(MsgError);
  }
});
/** */ 

const startUp = async(client) => { //Al iniciar le bot  
  restartEvents();
  client.user.setActivity('¡help');
  
  const testChannel = await client.channels.fetch('837826705678532608');
  testChannel.send('**Bot reiniciado, buenos dias!**');
}

client.on('message', async (msg) => { //Reset Bot - comando aparte
  let {channel, member, content} = msg;
  if(content !== '¡reset' && content !== '¡restart') return;
  const isMod = member.roles.cache.find(role => role.name === 'Moderador');
  if(!isMod) return;

  channel.send('*Reiniciando...*')
  .then(m => client.destroy())
  .then(() => client.login(token));
  await startUp(client);
  console.log("bot reiniciado en: " + channel.guild.name)

});


/** COMPROBAR AL INICIAR EL BOT */
client.once('ready', async () => {
  
  // setRoles.silenciado(client); //CREAR ROL SILENCIADO
  // setRoles.cumpleañero(client); //CREAR ROL CUMPLEAÑERO

  console.log('Bot Connected');
  startUp(client);
});


client.login(token); //LOGEAR Y ARRANCAR EL BOT
