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

		const MsgToSend = new MessageEmbed().setColor('#ffff55');

		if (!args.length) {
			MsgToSend.setTitle(`Animes en Emision del dia:`);
			
			const schedule = await _anime.schedule(new Date().getDay())
			schedule.map(anime => {
				const {title, episode, time, poster} = anime;
				MsgToSend.addField('\u200B', `**${time}** | ${title} *Ep${episode}*`)
			})
		};

		return channel.send(MsgToSend)
	},
};