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
      const user = await Levels.fetch(author.id, guild.id, true);
      if(!user) return msg.reply('Intenta enviar un mensaje NO COMANDO, para que te podamos agregar al sistema :raised_hands:')
      
      const xpToNextLvl = Levels.xpFor(user.level+1);
      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`💈 ${user.position} ~ ${author.username}`)
        .setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${user.level}`)
        .setDescription(`**Sig:**  ${user.xp} / ${xpToNextLvl} EXP\n**Total:** ✨ ${user.totalXP} EXP`)
        
      return channel.send(MsgToLvlUp)
    }

    mentions.users.forEach(async user => {
      const userL = await Levels.fetch(user.id, guild.id, true);
      if(!userL) return msg.reply('Este usuario aún no ha enviado ningún mensaje :eyes:')
      const xpToNextLvl = Levels.xpFor(userL.level+1);

      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`💈${userL.position} ~ ${user.username}`)
        .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${userL.level}`)
        .setDescription(`**Sig: ** ${userL.xp} / ${xpToNextLvl} EXP\n**Total: ** ✨ ${userL.totalXP} EXP`)

      return channel.send(MsgToLvlUp)
    });
	},
};