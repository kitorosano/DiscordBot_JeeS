module.exports = {
  name: 'ping',
  description: 'Tiempo de respuesta del bot a tus mensajes',
  guildOnly: true,
  disable: true,
  cooldown: 5,
  execute(msg, args) {
    msg.channel.send('pong');
  }
}