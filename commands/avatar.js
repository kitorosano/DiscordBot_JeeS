const {MessageAttachment} = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['icon'],
  description: 'Muestra el avatar del usuario mencionado',
  guildOnly: true,
  execute(msg, args, isMod) {
    if (!msg.mentions.users.size) {
      return msg.channel.send(`Your avatar:`, new MessageAttachment(msg.author.displayAvatarURL({ format: "png", dynamic: true })), 'this');
    }
    
    msg.mentions.users.forEach(user => {
      const file = new MessageAttachment(user.displayAvatarURL({ format: "png", dynamic: true }))
      msg.channel.send({content: `Avatar de ${user.username}: `, files: [file]})
    });
  }
}