const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provee informacion sobre el servidor.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`Este es el servidor ${interaction.guild.name} que actualmente cuenta con ${interaction.guild.memberCount} miembros.`);
	},
};