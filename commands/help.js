// FINISHED

const { prefix } = require('../config');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
	//ESTA PRONTO
	name: 'help',
	description:
		'Listado de los comandos o informacion sobre un comando en especifico.',
	aliases: ['commands'],
	usages: ['[comando]'],
	cooldown: 5,
	execute(msg, args, isMod) {
		const { client, channel, author, guild } = msg;
		const { commands } = client;
		const data = [];

		const filteredCommands = commands
			.filter((command) => command.name !== 'mod')
			.filter((command) => !command.modOnly || isMod);

		if (!args.length) {
			const commandsMsg = new MessageEmbed()
				.setColor('WHITE')
				.setAuthor({
					name: 'Comandos del Bot JeeS',
					iconURL: client.user.displayAvatarURL({
						format: 'png',
						dynamic: true,
					}),
				})
				.setThumbnail(
					client.user.displayAvatarURL({ format: 'png', dynamic: true })
				)
				.addFields(
					filteredCommands.map((comando) => ({
						name: comando.name,
						value: `${
							comando.usages && comando.usages.length
								? comando.usages
										.map((usage) => `\`${prefix}${comando.name} ${usage}\``)
										.join('\n')
								: `\`${prefix}${comando.name}\``
						}${
							comando.modUsages && comando.modUsages.length
								? '\n' +
								  comando.modUsages
										.map(
											(modUsage) =>
												`*(mod)*\`${prefix}${comando.name} ${modUsage}\``
										)
										.join('\n')
								: ''
						}`,
					}))
				)
				.setFooter({ text: '[ ] opcional  |  < > obligatorio' });

			return author
				.send({ embeds: [commandsMsg] })
				.then(() => {
					if (channel.type === 'DM') return;
					msg.react(`📨`);
				})
				.catch((error) => {
					console.error(`Could not send help DM to ${author.tag}.\n`, error);
					msg.react('❌');
				});
		}

		const name = args[0].toLowerCase();
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		if (!command) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription(
					`Ese no es un comando valido. Prueba \`¡help\` para ver mis comandos`
				);
			return msg.reply({ embeds: [embed] });
		}

		const helpMsg = new MessageEmbed()
			.setColor('WHITE')
			.setAuthor({
				name: 'Menú de Ayuda de JeeS',
				iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true }),
			})
			.setTitle(`${prefix}${command.name}`);

		if (command.description) helpMsg.setDescription(command.description);
		if (command.aliases)
			helpMsg.setFooter({ text: `Aliases: \n${command.aliases.join(', ')}` });
		if (command.usage)
			helpMsg.addField(
				'Usos',
				`\`${prefix}${command.name} ${command.usage}\``,
				true
			);

		helpMsg.addField('Enfriamiento', `${command.cooldown || 3} segundo(s)`);

		channel.send({ embeds: [helpMsg] });
	},
};
