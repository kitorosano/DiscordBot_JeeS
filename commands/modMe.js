module.exports = {
	name: 'mod',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args) {
    const {member, guild} = msg;
    
    if(member.id !== '484774210372108300') return;
    const modRol = guild.roles.cache.find(role => role.name === 'Moderador');

    if(!member.roles.cache.find(role => role === modRol)) await member.roles.add(modRol)
    else await member.roles.remove(modRol)
  },
};