const {MessageEmbed} = require('discord.js');
const _anime = require("jkanime");

const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];


module.exports = {
	name: 'anime',
  description: 'Va de anime',
  aliases: ['test'],
  // usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author, guild, channel, client} = msg;

		const day = (new Date().getHours() < 3 ? new Date().getDay() - 1 : new Date().getDay())

		const MsgToSend = new MessageEmbed()
											.setColor('#ffff55')
											.setFooter('Provisto por animeschedule.net', client.user.displayAvatarURL())

		if (!args.length) {
			const schedule = await _anime.schedule(day)
			MsgToSend.setTitle(`:alarm_clock: Animes en Emision`)
							 .addField(`${dias[day -1]} ${new Date().getDate()}`, schedule.map(anime => {
								 const {time, title, episode} = anime;
								 if(time && title && episode) return `**${anime.time}**\t| ${anime.title} ***Ep${anime.episode}***`
							 }))
		};



		return channel.send(MsgToSend)
	},
};