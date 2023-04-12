const { Events } = require("discord.js");

const { CommandAdapter } = require("./CommandAdapter")

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if(!interaction.isChatInputCommand()) return;

    const command =
			client.commands.get(interaction.commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(interaction.commandName)
			);
		if (!command) return; //OBTENER COMANDO O SU ALIAS, Y SI ESTE NO EXISTE TERMINAR

    try {
      // await command.execute(interaction, client);
      await CommandAdapter(command, client, interaction)
    } catch(error) {
      console.error(`Error ejecutando el comando ${interaction.commandName}`);
      console.error(error);
      await interaction.reply({
        content: "Hubo un error al ejecutar el comando.",
        ephemeral: true
      })
    }
  }
}