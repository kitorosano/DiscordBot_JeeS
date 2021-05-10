const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

module.exports = {
  name: 'vipend',
  description: '...',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    const [emoji,...anime] = args;
    
    const roles = await guild.roles.fetch();
    const VPIrole = roles.cache.find(role => role.name === 'VIP');

    const MsgVIP = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(`¡:loudspeaker: El evento termino :rotating_light: !`)
        .setDescription(`Muchas gracias por participar.`)

    channel.send(MsgVIP)

  },
};

