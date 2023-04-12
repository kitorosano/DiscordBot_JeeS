const { SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Tiempo de respuesta del bot a tus mensajes'),
  guildOnly: true,
  cooldown: 5,
  async execute(interaction) {
    await interaction.reply({
      content: `🏓Pong. Latencia de ${Date.now() - interaction.createdTimestamp}ms. Latencia de Bot ${Math.round(interaction.client.ws.ping)}ms`,
      ephemeral: true
    })
  }
}