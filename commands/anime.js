const {MessageEmbed} = require('discord.js');
const _anime = require("jkanime");

module.exports = {
	name: 'anime',
  description: 'Va de anime',
  aliases: ['test'],
  // usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author, guild, mentions, channel} = msg;

		const MsgToSend = new MessageEmbed()
											.setColor('#ffff55')
											.setFooter(':globe_with_meridians: Provisto por animeschedule.net', client.user.displayAvatarURL())

		if (!args.length) {
			const schedule = await _anime.schedule(new Date().getDay())
			MsgToSend.setTitle(`:alarm_clock: Animes en Emision del dia:`)
							 .addField("Visitar animeflv", schedule.map(anime => `**${anime.time}** | ${anime.title} *Ep${anime.episode}*`))
		};

		return channel.send(MsgToSend)
	},
};