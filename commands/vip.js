const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

const addReactions = (message, reactions) => {
    message.react(reactions[0]) 
    reactions.shift()
    if(reactions.length > 0){
        setTimeout(() => addReactions(msg, reactions), 750)
    }
}   

module.exports = {
  name: 'vip',
  description: '...',
  usage: '[emoji] [anime a mirar]',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    const [emoji,...anime] = args;

    const MsgVIP = new MessageEmbed()
        .setColor('BLACK')
        .setTitle(`¡:loudspeaker: Reunion de emergencia :rotating_light: !`)
        .setDescription(`Hoy se mira: ${anime}\nReacciona a este mensaje con un :raised_hand: para poder particiar.`)
        .setFooter(`Este mensaje se eliminara en 5m.`);
    
    channel.send(MsgVIP)
    .then(msg => {
        msg.react(':raised_hand:')
        addReactions(msg, reactions)
    })

    .then(msg => setTimeout(() => {
        msg.delete();        
    }, 5000)); //5m
    

    // const roles = await guild.roles.fetch();
    // const VPIrole = roles.cache.find(role => role.name === 'VPI');
    // member.roles.add(VPIrole)

    client.on('messageReactionAdd',(reaction, user) => {
      
    })
  },
};

