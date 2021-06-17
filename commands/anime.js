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

		if (!args.length) { //si no hay argumentos
			const schedule = await _anime.schedule(new Date().getDay())
			console.log(schedule)
		}

		// const MsgToLvlUp = new MessageEmbed()
		// 	.setColor('#0080FF')
		// 	.setAuthor(`💈TOP #${user.position} ~ ${author.username}`)
		// 	.setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
		// 	.setTitle(`Nivel:  ${user.level}`)
		// 	.setDescription(`**Siguiente:**  ${user.xp} / ${xpToNextLvl} EXP\n**Total:** ✨ ${user.totalXP} EXP`)
			
		// return channel.send(MsgToLvlUp)

	},
};