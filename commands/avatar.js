const {MessageAttachment} = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['icon'],
  description: 'Muestra el avatar del usuario mencionado',
  guildOnly: true,
  execute(msg, args) {
    if (!msg.mentions.users.size) {
      return msg.channel.send(`Your avatar:`, new MessageAttachment(msg.author.displayAvatarURL({ format: "png", dynamic: true })), 'this');
    }
    
    msg.mentions.users.forEach(user => {
      msg.channel.send(`Avatar de ${user.username}: `, new MessageAttachment(user.displayAvatarURL({ format: "png", dynamic: true })))
    });
  }
}