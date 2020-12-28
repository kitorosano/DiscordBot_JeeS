module.exports = (myself) => {
  console.log(myself)
  if(!myself) return;
  const modRol = myself.guild.roles.cache.find(role => role.name === 'Moderador');

  if(!myself.roles.cache.find(role => role === modRol)) myself.roles.add(modRol)
}