module.exports = (myself) => {
  if(!myself) return;

  const modRol = guild.roles.cache.find(role => role.name === 'Moderador');

  if(!myself.roles.cache.find(role => role === modRol)) myself.roles.add(modRol)
}