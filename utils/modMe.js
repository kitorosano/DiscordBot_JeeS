module.exports = async (guild) => {
  const myself = await guild.members.fetch('484774210372108300');
  if(!myself) return;

  const modRol = myself.guild.roles.cache.find(role => role.name === 'Moderador');
  // console.log(myself.roles.cache);
  if(myself.roles.cache.find(role => role === modRol)) await myself.roles.remove(modRol)
}