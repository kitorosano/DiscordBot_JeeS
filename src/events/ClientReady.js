const {Events} = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setActivity('¡help');
    console.log(`== LISTO! EL BOT ${client.user.tag} A SIDO INICIADO CORRECTAMENTE! ==`)
  }
}