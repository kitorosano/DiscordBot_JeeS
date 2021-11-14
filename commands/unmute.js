const {MessageEmbed, MessageAttachment} = require('discord.js');

module.exports = {
	name: 'unmute',
  description: 'Desmutea a un miembro del servidor en todos los canales de texto.',
  usage: '<usuario>',
  guildOnly: true,
  modOnly: true,
  args: true,
  async execute(msg, args) {
    const {guild, mentions, channel} = msg;
    const target = mentions.users.first();
    if(!target) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`)]})

    const roles = await guild.roles.fetch();
    const mutedRole = roles.find(role => role.name === 'Silenciado');
    const memberTarget = await guild.members.fetch(target.id);
    
    if(memberTarget.roles.cache.find(role => role === mutedRole)) {
      memberTarget.roles.remove(mutedRole); //QUITA EL ROL
      const {tag} = memberTarget.user
  
      const MsgDesmuteado = new MessageEmbed()
            .setColor("#424242")
            .setAuthor(`${tag} ya no está silenciad@`, memberTarget.user.displayAvatarURL({ format: "png", dynamic: true }))
      return channel.send({embeds: [MsgDesmuteado]})
    } else {
      const MsgNoSePuede = new MessageEmbed()
            .setColor("ORANGE")
            .setAuthor('No puedes desmutear a alguien que no esta silenciado.')
      return channel.send({embeds: [MsgNoSePuede]})
    }
  },
};