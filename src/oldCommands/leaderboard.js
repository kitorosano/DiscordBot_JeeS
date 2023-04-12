const { MessageEmbed } = require('discord.js');
const Levels = require('discord-xp');
const { mongo } = require('../config');
Levels.setURL(mongo);

module.exports = {
	name: 'leaderboard',
	description:
		'Muestra el top de nivel usuarios. Si no se proveen argumentos se hace un top 10.',
	aliases: ['levels', 'dashboard', 'top'],
	usages: ['[limite]'],
	guildOnly: true,
	async execute(msg, args, isMod) {
		const { channel, author, guild, client } = msg;

		if (!args.length) args = [10];
		const rawLeaderboard = await Levels.fetchLeaderboard(guild.id, args[0]);

		if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
		const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard);

		const MsgLeaderboard = new MessageEmbed()
			.setColor('PURPLE')
			.setAuthor({
				name: `Posiciones en ${guild.name}`,
				iconURL:
					guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/1.png',
			})
			.setDescription(
				`:reminder_ribbon: Tu rango es \`#${
					leaderboard.find((user) => user.username(false) == author.username)
						.position
				}\` en este servidor :reminder_ribbon:`
			)
			// .addField(
			//     '·    Usuario\t\t\t\t\t\t\t\t\t\t·    Total de Puntos',
			//     leaderboard.map(user => `${user.position}.${user.username(true)}✨EXP ${user.totalXP}`).join('\n')
			// )
			.addFields(
				{
					name: 'Usuario',
					value: leaderboard
						.map((user) => `${user.position}.${user.username(true)}`)
						.join('\n'),
					inline: true,
				},
				{
					name: 'Puntos',
					value: leaderboard
						.map((user) => `${user.position}. ✨EXP ${user.totalXP}`)
						.join('\n'),
					inline: true,
				}
			)
			// .addField('\u200B', '\u200B')
			.setFooter({
				text: 'Sistema de niveles del bot JeeS.',
				iconURL: client.user.displayAvatarURL(),
			});

		channel.send({ embeds: [MsgLeaderboard] });
	},
};
