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

		const hora = (new Date().getHours() < 2 ? new Date().getDate() - 1 : new Date().getDate())

		const MsgToSend = new MessageEmbed()
											.setColor('#ffff55')
											.setFooter('Provisto por animeschedule.net', client.user.displayAvatarURL())

		if (!args.length) {
			const {day, schedule} = await _anime.schedule(hora)
			MsgToSend.setTitle(`:alarm_clock: Animes en Emision`)
							 .addField(`DIA ${dias[day -1]}`, schedule.map(anime => {
								 const {time, title, episode} = anime;
								 if(time && title && episode) return `**${anime.time}**\t| ${anime.title} ***Ep${anime.episode}***`
							 }))
		};

		return channel.send(MsgToSend)
	},
};