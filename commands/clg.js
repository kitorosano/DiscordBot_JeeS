const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'clg',
  description: 'Console-Log a la propiedad dispuesta, para debuggear.',
  usage: '[ g=guild / c=channel / @MEMBER / @ROL]',
  modOnly: true,
  async execute(msg, args, isMod) {
    const {author,guild, mentions, channel} = msg;
    msg.delete()
    
    if(!args.length) return console.log(author);
    args.forEach(obj => {
      if(mentions.users.size) mentions.users.map(user => console.log(user))
      if(mentions.roles.size) mentions.roles.map(rol => console.log(rol))
      if(obj === 'g') return console.log(guild)
      if(obj === 'c') return console.log(channel)
      if(obj === 'r') return console.log(guild.roles.cache)
    });

  },
};