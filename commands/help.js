// FINISHED

const {prefix} = require('../config');
const {MessageEmbed, MessageAttachment} = require('discord.js');

module.exports = { //ESTA PRONTO
	name: 'help',
	description: 'Listado de los comandos o informacion sobre un comando en especifico.',
	aliases: ['commands'],
	usage: '[comando]',
	cooldown: 5,
	execute(msg, args) {
    const { commands } = msg.client;
    const data = [];

    const comandos = commands.filter(command => (!command.modOnly || msg.member.roles.cache.find(role => role.name === 'Moderador')))

    if (!args.length) {
      const commandsMsg = new MessageEmbed()
            .setColor('WHITE')
            .setAuthor('Comandos del Bot JeeS', msg.client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setThumbnail(msg.client.user.displayAvatarURL({ format: "png", dynamic: true }))
            .addFields(
              comandos.map(comando => ({
                name: comando.name, 
                value: `\`${prefix}${comando.name} ${(comando.usage ? comando.usage : '')}\``, inline: true
              }))
            )
            .setFooter('[ ] opcional  |  < > obligatorio');

      return msg.author.send(commandsMsg)
        .then(() => {
          if (msg.channel.type === 'dm') return;
          const commandMsg = new MessageEmbed()
                .setColor('WHITE')
                .setDescription(`${msg.author}, te he enviado un mensaje con todos mis comandos!`)
          msg.reply(commandMsg);
        })
        .catch(error => {
          console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
          const commandMsg = new MessageEmbed()
                .setColor('WHITE')
                .setDescription(`${msg.author}, no puedo mensajearte! Tendrás desactivado DM? (mensaje directo)`)
          msg.reply(commandMsg);
        });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return msg.reply(new MessageEmbed().setColor('RED').setDescription(`Ese no es un comando valido. Prueba \`¡help\` para ver mis comandos`));
    }

    const helpMsg = new MessageEmbed()
          .setColor('WHITE')
          .setAuthor('Menú de Ayuda de JeeS', msg.client.user.displayAvatarURL({ format: "png", dynamic: true }))
          .setTitle(`${prefix}${command.name}`)

    if (command.description) helpMsg.setDescription(command.description)
    if (command.aliases) helpMsg.setFooter(`Aliases: \n${command.aliases.join(', ')}`)
    if (command.usage) helpMsg.addField('Usos',`\`${prefix}${command.name} ${command.usage}\``,true)

    helpMsg.addField('Enfriamiento', `${command.cooldown || 3} segundo(s)`)

    msg.channel.send(helpMsg);

	},
};