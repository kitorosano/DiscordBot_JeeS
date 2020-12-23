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
    const {author, guild, mentions, channel, member} = msg;
		if (!mentions.users.size) {
      const user = await Levels.fetch(author.id, guild.id);
      
      const xpToNextLvl = 2 * (Math.pow(user.level+1,2)) + 50 * (user.level+1) -51;
      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`> ${member.nickname || author.username} <`)
        .setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel: ${user.level}`)
        .setDescription(`${user.xp} / ${xpToNextLvl} EXP`)
      return channel.send(MsgToLvlUp)
    }

    mentions.users.forEach(async user => {
      const userL = await Levels.fetch(user.id, guild.id);
      const xpToNextLvl = 2 * (Math.pow(userL.level,2)) + 50 * userL.level -51;

      channel.send(`Actualmente ${user.username} es **nivel ${userL.level}**, con ${userL.xp}EXP\nNecesita ${xpToNextLvl} EXP para subir al **nivel ${userL.level + 1}**!`)
    });
	},
};