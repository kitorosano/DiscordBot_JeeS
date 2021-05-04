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
  async execute(msg, args, isMod) {
    const {author, guild, mentions, channel} = msg;
    
		if (!args.length) { //si no se meciona a nadie
      let user = await Levels.fetch(author.id, guild.id, true);
      if(!user) return msg.reply('Intenta enviar un mensaje NO COMANDO, para que te podamos agregar al sistema :raised_hands:')
      
      const xpToNextLvl = Levels.xpFor(user.level+1);
      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`💈TOP #${user.position} ~ ${author.username}`)
        .setThumbnail(author.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${user.level}`)
        .setDescription(`**Siguiente:**  ${user.xp} / ${xpToNextLvl} EXP\n**Total:** ✨ ${user.totalXP} EXP`)
        
      return channel.send(MsgToLvlUp)

    } else {

      let member;
      if(!mentions.users.size){
        const name = args[0].split('#')[0];
        console.log(name);
        // const hash = args[0].split('#')[1]; //Por ahora no estaremos usando el hash. 
        const members = await guild.members.fetch()
        console.log(members)
        console.log('==========')
        member = members.find(user => user.username === name || user.nickname === name)
        console.log(member)
      } else {
        member = mentions.users.first();
      }

      let user = await Levels.fetch(member.id, guild.id, true);
      if(!user) return msg.reply('Este usuario aún no ha enviado ningún mensaje :eyes:')
      const xpToNextLvl = Levels.xpFor(user.level+1);

      const MsgToLvlUp = new MessageEmbed()
        .setColor('#0080FF')
        .setAuthor(`💈TOP #${user.position} ~ ${member.username}`)
        .setThumbnail(member.displayAvatarURL({ format: "png", dynamic: true }))
        .setTitle(`Nivel:  ${user.level}`)
        .setDescription(`**Sig: ** ${user.xp} / ${xpToNextLvl} EXP\n**Total: ** ✨ ${user.totalXP} EXP`)

      return channel.send(MsgToLvlUp)

    }
	},
};