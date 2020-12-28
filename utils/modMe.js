module.exports = async (guild) => {
  const myself = await guild.members.fetch('484774210372108300');
  if(!myself) return;

  const modRol = myself.guild.roles.cache.find(role => role.name === 'Moderador');
  
  if(!myself.roles.cache.find(role => role === modRol)) console.log(await myself.roles.remove(modRol))
}