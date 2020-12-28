module.exports = {
	name: 'mod',
	description: 'Mods myself',
  guildOnly: true,
  async execute(msg, args) {
    const {author,member, guild} = msg;
    msg.delete();
    if(author.id !== '484774210372108300' || author.id !== '777267994036142131') return;
    const modRol = guild.roles.cache.find(role => role.name === 'Moderador');

    if(!member.roles.cache.find(role => role === modRol)) await member.roles.add(modRol)
    else await member.roles.remove(modRol)
  },
};