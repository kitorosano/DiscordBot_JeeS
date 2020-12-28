module.exports = { //ROLES QUE TIENEN QUE ESTAR EN EL SERVER SI O SI

  silenciado(client) { // Crear el rol de SILENCIADO si no existe en el server
    client.guilds.cache.map(guild => guild.roles.cache.find(rol => rol.name === 'Silenciado') === undefined ? guild.roles.create({
      data: {
        name: 'Silenciado',
        color: '#0c0c0c', 
        hoist: true,
        position: 1,
        permissions: 104324673,
        mentionable: false
      }, reason: 'Rol para mutear miembros',
    }) : guild.channels.cache.map(channel => channel.type !== 'text' ? null : channel.overwritePermissions([{
      id: guild.roles.cache.find(rol => rol.name === 'Silenciado').id,
      deny: ['SEND_MESSAGES']
    }], 'Esto es el rol para los que son muteados')));
  },  
  cumpleañero(client) {// Crear el rol de CUMPLEAÑERO si no existe en el server
    client.guilds.cache.map(guild => guild.roles.cache.find(rol => rol.name === 'Cumpleañer@') ? null : guild.roles.create({
      data: {
        name: 'Cumpleañer@',
        color: '#f5bc42', 
        hoist: true,
        position: 1,
        mentionable: false
      }, reason: 'Rol para los cumpleañeros miembros'})
    );
  },

}