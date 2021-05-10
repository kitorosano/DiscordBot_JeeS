const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

module.exports = {
  name: 'vip',
  description: '...',
  usage: '[emoji] [anime a mirar]',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    const [emoji,...anime] = args;
    
    const roles = await guild.roles.fetch();
    const VPIrole = roles.cache.find(role => role.name === 'VPI');

    const MsgVIP = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(`¡:loudspeaker: Reunion de emergencia :rotating_light: !`)
        .setDescription(`Hoy se mira: ${anime}\nReacciona a este mensaje con un ${emoji} para poder particiar.`)
        .setFooter(`Este mensaje se eliminara en 5m.`);

    channel.send(MsgVIP)
    .then(async msg => {
      await msg.react(`${emoji}`);
      
      msg.client.on('messageReactionAdd',async (reaction, user) => {
        if(reaction.message.channel.id !== channel.id) return;
        if(user.id === '776917497382436884') return;

        const member = await guild.members.fetch(user);
        member.roles.add(VPIrole)
      })
      setTimeout(() => {
        msg.delete();        
      }, 5000)
    })

  },
};

