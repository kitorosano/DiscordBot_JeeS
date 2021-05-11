const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

module.exports = {
  name: 'vipend',
  description: 'Terminar el evento. Se les sera quitado el rol VIP a todos los miembros que los tengan.',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    msg.destroy();
    
    const roles = await guild.roles.fetch();
    const VPIrole = roles.cache.find(role => role.name === 'VIP');

    guild.members.cache.forEach(member => {
      if(member.roles.cache.find(role => role.name === 'VIP')) member.roles.remove(VPIrole);
    });

    const MsgVIP = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(`¡:loudspeaker: El evento termino :rotating_light: !`)
        .setDescription(`Muchas gracias por participar.`)

    channel.send(MsgVIP)

  },
};

