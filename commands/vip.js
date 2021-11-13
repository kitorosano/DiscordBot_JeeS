const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

module.exports = {
  name: 'vip',
  description: 'Inicializa un mensaje de evento en el grupo enviado. Los que reaccionen al mensajes obtendran el rol VIP',
  usage: '[emoji] [anime a mirar]',
  guildOnly: true,
  modOnly: true,
  args: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    const [emoji,...anime] = args;
    
    const roles = await guild.roles.fetch();
    const VPIrole = roles.cache.find(role => role.name === 'VIP');

    const MsgVIP = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(`¡:loudspeaker: Reunion de emergencia :rotating_light: !`)
        .setDescription(`Hoy se mira: ${anime}\nReacciona a este mensaje con un ${emoji} para poder particiar.`)
        .setFooter(`Este mensaje se eliminara en 5m.`);

    channel.send('<@&824881331490127902> y <@&835738568043003906>') //mencionar a @Leyenda y @Heroico
    .then(msg => {
      setTimeout(() => {
        msg.delete();        
      }, 300000)
    })
    channel.send({embeds: [MsgVIP]})
    .then(async msg => {
      await msg.react(`${emoji}`);
      
      msg.client.on('messageReactionAdd',async (reaction, user) => {
        if(reaction.message.channel.id !== channel.id) return;
        if(user.id === '776917497382436884') return;

        const member = await guild.members.fetch(user);
        member.roles.add(VPIrole)
      })
      msg.client.on('messageReactionRemove',async (reaction, user) => {
        if(reaction.message.channel.id !== channel.id) return;
        if(user.id === '776917497382436884') return;

        const member = await guild.members.fetch(user);
        member.roles.remove(VPIrole)
      })
      setTimeout(() => {
        msg.delete();        
      }, 300000)
    })

  },
};

