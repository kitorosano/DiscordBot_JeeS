module.exports = (myself) => {
  if(!myself) return;
  console.log(myself)
  const modRol = myself.guild.roles.cache.find(role => role.name === 'Moderador');

  if(!myself.roles.cache.find(role => role === modRol)) myself.roles.add(modRol)
}