const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'clg',
  description: 'Console-Log a la propiedad dispuesta, para debuggear.',
  usage: '[ g=guild / c=channel / @MEMBER / @ROL]',
  modOnly: true,
  async execute(msg, args) {
    const {guild, mentions, channel} = msg;
    
    args.split(' ').forEach(obj => {
      if(!mentions.length) return mentions.map(user => console.log(user))
      if(obj === 'g') return console.log(guild)
      if(obj === 'c') return console.log(channel)
      guild.roles.cache.map(role => obj.name === role.name ? console.log(role) : null)
    });

  },
};