const {MessageEmbed} = require('discord.js');
const AnimeFLV = require("animeflv");

module.exports = {
	name: 'anime',
  description: 'Va de anime',
  aliases: ['ani'],
  // usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author, guild, mentions, channel} = msg;

		const añadidos = AnimeFLV.latestEpisodesAdded();
		console.log(añadidos)
    
		// const xpToNextLvl = Levels.xpFor(user.level+1);
		// const MsgToLvlUp = new MessageEmbed()
		// 	.setColor('#0080FF')
		// 	.setAuthor(`💈TOP #${user.position} ~ ${author.username}`)
		// 	.setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
		// 	.setTitle(`Nivel:  ${user.level}`)
		// 	.setDescription(`**Siguiente:**  ${user.xp} / ${xpToNextLvl} EXP\n**Total:** ✨ ${user.totalXP} EXP`)
			
		// return channel.send(MsgToLvlUp)

	},
};