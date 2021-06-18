const {MessageEmbed} = require('discord.js');
const _anime = require("jkanime");

const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"]

module.exports = {
	name: 'anime',
  description: 'Va de anime',
  aliases: ['test'],
  // usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author, guild, channel, client} = msg;

		const MsgToSend = new MessageEmbed()
											.setColor('#ffff55')
											.setFooter('Provisto por animeschedule.net', client.user.displayAvatarURL())

		if (!args.length) {
			const {day, schedule} = await _anime.schedule(new Date().getDay())
			MsgToSend.setTitle(`:alarm_clock: Animes en Emision`)
							 .addField(`DIA ${dias[day]}`, schedule.map(anime => {
								 const {time, title, episode} = anime;
								 if(time && title && episode) return `**${anime.time}**\t| ${anime.title} ***Ep${anime.episode}***`
							 }))
		};

		return channel.send(MsgToSend)
	},
};