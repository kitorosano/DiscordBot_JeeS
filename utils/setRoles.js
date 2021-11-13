module.exports = { //ROLES QUE TIENEN QUE ESTAR EN EL SERVER SI O SI

  silenciado(client) { // Crear el rol de SILENCIADO si no existe en el server
    client.guilds.cache.map(guild => guild.roles.cache.find(rol => rol.name === 'Silenciado') === undefined ? guild.roles.create({
      data: {
        name: 'Silenciado',
        color: '#FFF', 
        hoist: true,
        position: 1,
        permissions: 104324673,
        mentionable: false
      }, reason: 'Rol para mutear miembros',
    }) : guild.channels.cache.map(channel => channel.type !== 'GUILD_TEXT' ? null : channel.overwritePermissions([{
      id: guild.roles.cache.find(rol => rol.name === 'Silenciado').id,
      deny: ['SEND_MESSAGES']
    }], 'Rol para los que son muteados')));
  },  
  cumpleañero(client) {// Crear el rol de CUMPLEAÑERO si no existe en el server
    client.guilds.cache.map(guild => guild.roles.cache.find(rol => rol.name === 'Cumpleañer@') ? null : guild.roles.create({
      data: {
        name: 'Cumpleañer@',
        color: '#f5bc42', 
        hoist: true,
        mentionable: false
      }, reason: 'Rol para los cumpleañeros miembros'})
    );
  },
  moderador(client) {// Crear el rol de Moderador si no existe en el server
    client.guilds.cache.map(guild => guild.roles.cache.find(rol => rol.name === 'Moderador') ? null : guild.roles.create({
      data: {
        name: 'Moderador',
        color: '#534473', 
        hoist: false,
        permissions: 2146959319,
        mentionable: false
      }, reason: 'Rol de moderacion para el bot'})
    );
  },

}