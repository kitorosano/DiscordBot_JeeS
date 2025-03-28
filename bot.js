const { Client, Collection, MessageEmbed, Intents } = require('discord.js');
const { prefix, token, mongo, xp } = require('./config');
const fs = require('fs');
const rnd = require('random');
const { scheduleJob } = require('node-schedule');
const Levels = require('discord-xp');
const { dayjs } = require('./utils');
Levels.setURL(mongo);

const client = new Client({
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['CHANNEL', 'MESSAGE', 'REACTION', 'USER', 'GUILD_MEMBER'],
});
client.commands = new Collection();
const cooldowns = new Collection();

/** OBTENER TODOS LOS COMANDOS */
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.disable) client.commands.set(command.name, command);
}
/** */

/** INICIALIZAR EVENTOS DEL DIA */
const initializeEvents = async () => {
  const today = dayjs().format('ddd MMM D YYYY').split(' ');

  const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    //para cada tipo de evento como archivo .js, obtengo los eventos del dia.
    const typeEvent = require(`./events/${file}`); //ESTO PASARSELO AL COMANDO ¡events, PARA EVENTOS DEL DIA
    if (typeEvent.disable) continue; //filtrar eventos desactivados

    const typeEvents = await typeEvent.getEvents(today, client); //Obtener entradas del dia para este tipo de evento
    if (!typeEvents.length) continue; //Si no hay nada de este evento para hoy, a.k.a si el array esta vacio

    typeEvents.forEach((singleEventData) => {
      //para cada evento de grupo, configurar una "alarma" del dia para cada uno
      typeEvent.execute(singleEventData, client);
    });
  }
};
/** */

/** MENSAJE DE BIENVENIDA **/
client.on('guildMemberAdd', (member) => {
  const channel = member.guild.systemChannel;
  if (!channel) return;
  channel
    .send(`Te damos la bienvenida ${member} al servidor Jees!`)
    .then((msg) => msg.react('🤲'));
});
/** */

const startUp = async (client) => {
  initializeEvents(); //REINICIO LOS EVENTOS POR SI ESTOY A MITAD DEL DIA
  scheduleJob({ minute: 0, hour: 0, tz: 'America/Montevideo' }, () =>
    initializeEvents(),
  ); // CONFIGURO REINICIAR LOS EVENTOS A LAS 00:00 GMT-3

  client.user.setActivity('¡help');
};

/** CUANDO SE ENVIA UN MENSAJE **/
client.on('messageCreate', async (msg) => {
  let { content, author, member, channel, guild } = msg;
  if (author.bot) return; // TERMINAR SI ES UN BOT

  // VERIFICAR SI ESTÁ EN UN SERVIDOR PARA GESTIONAR NIVELES
  if (guild) {
    const hasLeveledUp = await Levels.appendXp(
      author.id,
      guild.id,
      rnd.int(xp.from, xp.to),
    ); //Agrego a la BD la nueva xp entre <from> a <to>
    if (hasLeveledUp) {
      const { level } = await Levels.fetch(author.id, guild.id);
      const MsgLvlUp = new MessageEmbed()
        .setColor('#ADC00')
        .setAuthor({
          name: `¡Felicidades! ${author.username}`,
          iconURL: author.displayAvatarURL({
            format: 'png',
            dynamic: true,
            size: 4096,
          }),
        })
        .setDescription(
          `:tada: Has ascendido a **nivel ${level}**!. :confetti_ball: Cada vez mas cerca del admin.`,
        );
      // const rankChannel = await client.channels.fetch('772141688444682272'); //enviar mensaje al canal de spam
      const rankChannel =
        guild.channels.resolve('772141688444682272') || channel;
      rankChannel.send({ embeds: [MsgLvlUp] });
    }
  }

  if (!content.startsWith(prefix)) return; //TERMINAR SI NO ES UN COMANDO

  const args = content.slice(prefix.length).split(/ +/); //Obtengo un array con el comando sin el prefijo y los argumentos
  const commandName = args.shift().toLowerCase(); //Aparto el comando del array de los argumentos y lo hago minuscula.

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );
  if (!command) return; //OBTENER COMANDO O SU ALIAS, Y SI ESTE NO EXISTE TERMINAR

  // const MsgNoMod = new MessageEmbed().setColor('RED').setDescription(':no_pedestrians: Alto ahí pantalones cuadrados... :eyes:')
  const isMod = member.roles.cache.find(
    (role) => role.name === 'Moderador' || role.name === 'Admin',
  );
  if (command.modOnly && !isMod) {
    // MENSAJE PARA COMANDOS SOLO DE MODERADORES
    return channel.send(
      `:no_pedestrians: **${author.username}**, alto ahí pantalones cuadrados.`,
    );
  }

  if (command.guildOnly && channel.type === 'DM')
    return channel.send('No puedo ejecutar eso por mensaje directo');

  if (command.args && command.args != args.length) {
    const replyMsg = new MessageEmbed()
      .setColor('RED')
      .setTitle(`Comando incompleto...`);

    if (command.usages) {
      replyMsg.setDescription(
        `El uso correcto sería: \n${command.usages
          .map((usage) => `\`${prefix}${command.name} ${usage}\``)
          .join('\n')}`,
      );
    }
    return channel.send({ embeds: [replyMsg] });
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
      msg
        .reply(
          `por favor espera ${timeLeft.toFixed(
            1,
          )} segundo(s) mas para reusar el comando \`${command.name}\``,
        )
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
      return;
    }
  }
  timestamps.set(author.id, now);
  setTimeout(() => timestamps.delete(author.id), cooldownAmount);

  try {
    //ejecutar
    command.execute(msg, args, isMod);
  } catch (error) {
    console.error(error);
    const MsgError = new MessageEmbed()
      .setColor('RED')
      .setAuthor({ name: 'Ha ocurrido un error al ejecutar el comando!' });
    msg.reply(MsgError);
  }
});
/** */
/** CUANDO EL MENSAJE ES PARA REINCIAR EL BOT */
client.on('messageCreate', async (msg) => {
  let { channel, member, content } = msg;

  if (content !== '¡reset' && content !== '¡restart') return;
  const isMod = member.roles.cache.find((role) => role.name === 'Moderador');
  if (!isMod) return;

  channel
    .send('*Reiniciando...*')
    .then((msg) =>
      setTimeout(() => {
        msg.delete();
      }, 5000),
    )
    .then((m) => client.destroy())
    .then(() => client.login(token));
  console.log('bot reiniciado en: ' + channel.guild.name);

  startUp(client);
});
/** */

/** COMPROBAR AL INICIAR EL BOT */
client.once('ready', async () => {
  // setRoles.silenciado(client); //CREAR ROL SILENCIADO
  // setRoles.cumpleañero(client); //CREAR ROL CUMPLEAÑERO

  console.log('Bot Connected');
  startUp(client);
});

client.login(token); //LOGEAR Y ARRANCAR EL BOT
