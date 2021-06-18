const {MessageEmbed} = require('discord.js');
const _anime = require("jkanime");
const { getAnimeMovies } = require('../../../testing/jkanime/src/api/api');

module.exports = {
	name: 'anime',
  description: 'Va de anime',
  aliases: ['test'],
  // usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author, guild, mentions, channel} = msg;

		const MsgToSend = new MessageEmbed().setColor('#ffff55');

		if (!args.length) { //si no hay argumentos
			const schedule = await _anime.schedule(new Date().getDay())
			
			MsgToSend.setTitle(`Animes en Emision del dia:`);
				
			schedule.map(anime => {
				const {title, episode, time, poster} = anime;

				MsgToSend.addField({
					name: `${time}`, 
					value: `${title} - Ep${episode}`, 
				})
			})
		};

		return channel.send(MsgToSend)
	},
};