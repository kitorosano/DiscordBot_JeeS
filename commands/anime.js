const { MessageEmbed } = require('discord.js');
const _anime = require('jkanime');

const dias = [
	'DOMINGO',
	'LUNES',
	'MARTES',
	'MIERCOLES',
	'JUEVES',
	'VIERNES',
	'SABADO',
];

module.exports = {
	name: 'anime',
	description: 'Calendario de capitulos de anime de la semana.',
	// aliases: [''],
	usages: ['[date]'],
	guildOnly: true,
	async execute(msg, args, isMod) {
		const { author, guild, channel, client } = msg;

		let date, field_date, field_day, field_month;
		if (!args.length) {
			// today
			date =
				new Date().getHours() < 3
					? new Date().getDay() - 1
					: new Date().getDay();
			field_date = dias[date];
			field_day = new Date().getDate();
			field_month = new Date().getMonth() + 1;
		} else {
			//any other day
			date = dias.indexOf(args[0].toUpperCase());
			field_date = dias[date];
			let _otherDay = new Date();
			while (_otherDay.getDay() !== date)
				_otherDay.setDate(_otherDay.getDate() - 1);
			field_day = _otherDay.getDate();
			field_month = _otherDay.getMonth() + 1;
		}

		const schedule = await _anime.schedule(date, true);
		const animeSchedules = schedule
			.map((anime) => {
				const { time, title, episode } = anime;
				if (time && title && episode)
					return `**${anime.time}**\t| ${anime.title} ***Ep${anime.episode}***`;
			})
			.join('\n');

		const MsgToSend = new MessageEmbed()
			.setColor('#ffff55')
			.setFooter({
				text: 'Provisto por animeschedule.net',
				iconURL: client.user.displayAvatarURL(),
			})
			.setTitle(`:alarm_clock: Animes en Emision`)
			.addField(`${field_date} ${field_day}/${field_month}`, animeSchedules);

		return channel.send({ embeds: [MsgToSend] });
	},
};
