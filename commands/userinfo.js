// FINISHED

// const { discriminator } = require('discord-xp/models/levels');
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'userinfo',
	description: 'Muestra informacion del usuario en el servidor.',
	aliases: ['profile'],
	usages: ['[usuario]'],
	// disable: true,
	guildOnly: true,
	async execute(msg, args) {
		const { author, client, member, channel, mentions } = msg;
		if (!mentions.users.size) {
			const { id, username, discriminator, bot } = author;
			const { nickname, joinedAt, roles } = member;
			// console.log(roles.cache)
			const exampleEmbed = new MessageEmbed()
				.setColor('LIGHT_GREY')
				.setTitle(username)
				.setDescription('UserID: ' + id)
				.setThumbnail(author.displayAvatarURL({ format: 'png', dynamic: true }))
				.addFields(
					{
						name: 'Roles: ',
						value: roles.cache
							.map((role) =>
								role.name === '@everyone' ? `@everyone\t` : `<@&${role.id}>\t`
							)
							.join('\n'),
					},
					{
						name: 'Alias: ',
						value: nickname ? nickname : 'No tiene',
						inline: true,
					},
					{
						name: 'Se unió: ',
						value: joinedAt.toUTCString().slice(0, -4),
						inline: true,
					},
					{ name: 'Es un Bot?', value: bot ? ':eyes:' : 'Y no.', inline: true }
				)
				.setFooter({
					text: `Pedido por ${username}#${discriminator}`,
					iconURL: author.displayAvatarURL({ format: 'png', dynamic: true }),
				});
			return channel.send({ embeds: [exampleEmbed] });
		}

		mentions.members.forEach((member) => {
			const { nickname, roles, joinedAt, user } = member;
			const { id, username, bot } = user;

			const exampleEmbed = new MessageEmbed()
				.setColor('LIGHT_GREY')
				.setTitle(username)
				.setDescription('UserID: ' + id)
				.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
				.addFields(
					{
						name: 'Roles: ',
						value: roles.cache
							.map((role) =>
								role.name === '@everyone' ? `@everyone\t` : `<@&${role.id}>\t`
							)
							.join('\n'),
					},
					{
						name: 'Alias: ',
						value: nickname ? nickname : 'No tiene',
						inline: true,
					},
					{
						name: 'Se unió: ',
						value: joinedAt.toUTCString().slice(0, -4),
						inline: true,
					},
					{ name: 'Es un Bot?', value: bot ? ':eyes:' : 'Y no.', inline: true }
				)
				.setFooter({
					text: `Pedido por ${author.username}#${author.discriminator}`,
					iconURL: author.displayAvatarURL({ format: 'png', dynamic: true }),
				});
			return channel.send({ embeds: [exampleEmbed] });
		});
	},
};
