module.exports = {
  name: 'ping',
  description: 'Tiempo de respuesta del bot a tus mensajes',
  guildOnly: true,
  cooldown: 5,
  execute(msg, args, isMod) {
    msg.channel.send(`🏓Pong. Latencia de ${Date.now() - msg.createdTimestamp}ms. Latencia de Bot ${Math.round(msg.client.ws.ping)}ms`);
  }
}