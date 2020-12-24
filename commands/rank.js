const {MessageEmbed} = require('discord.js');
const Levels = require("discord-xp");
const {mongo} = require('../config');
Levels.setURL(mongo);

module.exports = {
	name: 'rank',
  description: 'Muestra informacion de nivel del usuario y cuanta experiencia hace falta para subir de nivel.',
  aliases: ['xp','lvl'],
  usage: '[usuario]',
  guildOnly: true,
  async execute(msg, args) {
    const {author, guild, mentions, channel} = msg;
		if (!mentions.users.size) {
      const user = await Levels.fetch(author.id, guild.id);
      
      const xpToNextLvl = Levels.xpFor(user.level+1);
      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`> ${author.username} <`)
        .setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${user.level}`)
        .setDescription(`**Sig:**  ${user.xp} / ${xpToNextLvl} EXP\n**Total:** ${user.totalXP} EXP`)
        
      return channel.send(MsgToLvlUp)
    }

    mentions.users.forEach(async user => {
      const userL = await Levels.fetch(user.id, guild.id);
      const xpToNextLvl = Levels.xpFor(userL.level+1);

      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`> ${user.username} <`)
        .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${userL.level}`)
        .setDescription(`**Sig: ** ${userL.xp} / ${xpToNextLvl} EXP\n**Total: ** ${userL.totalXP} EXP`)

      return channel.send(MsgToLvlUp)
    });
	},
};