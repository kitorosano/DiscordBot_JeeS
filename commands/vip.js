const {MessageEmbed, MessageAttachment, MessageReaction} = require('discord.js');

const addReactions = (message, reactions) => {
    message.react(reactions[0]) 
    reactions.shift()
    if(reactions.length > 0){
        setTimeout(() => addReactions(msg, reactions), 750)
    }
}   

module.exports = {
  name: 'vpi',
  description: '...',
  usage: '[emoji] [anime a mirar]',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel, client} = msg;
    const [emoji,anime] = args;

    console.log(args)
    // const getEmoji = (nombreEmoji) => client.emojis.cache.find(emoji => emoji.name = nombreEmoji);

    // const MsgVPI = new MessageEmbed()
    //     .setColor('BLACK')
    //     .setTitle(`¡:loudspeaker: Reunion de emergencia :rotating_light: !`)
    //     .setDescription(`Hoy se mira: ${anime}\nReacciona a este mensaje con un :raised_hand: para poder particiar.`)
    //     .setFooter(`Este mensaje se eliminara en 5m.`);
    
    // channel.send(MsgVPI)
    // .then(msg => {
    //     addReactions(msg, reactions)
    // })

    // .then(msg => setTimeout(() => {
    //     msg.delete();        
    // }, 300000)); //5m
    

    // const roles = await guild.roles.fetch();
    // const VPIrole = roles.cache.find(role => role.name === 'VPI');
    // member.roles.add(VPIrole)

    
  },
};

