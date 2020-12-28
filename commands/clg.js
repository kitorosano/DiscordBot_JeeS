const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'clg',
  description: 'Console-Log a la propiedad dispuesta, para debuggear.',
  usage: '[ g=guild / c=channel / @MEMBER / @ROL]',
  modOnly: true,
  async execute(msg, args) {
    const {guild, mentions, channel} = msg;
    
    args.forEach(obj => {
      if(mentions.users.size) return mentions.members.forEarch(member => console.log(member))
      if(obj === 'g') return console.log(guild)
      if(obj === 'c') return console.log(channel)
      guild.roles.cache.map(role => obj.name === role.name ? console.log(role) : null)
    });

  },
};