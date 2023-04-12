const fs = require('node:fs');
const { token, clientId } = require('../config');
const { REST, Routes } = require('discord.js');

module.exports = (client) => {
	client.handleCommands = async () => {
		client.commandArray = [];

    const commandFolders = fs.readdirSync('./src/commands');
		for (const folder of commandFolders) {
			const commandFiles = fs
				.readdirSync(`./src/commands/${folder}`)
				.filter((file) => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				if ('data' in command && 'execute' in command) {
					client.commands.set(command.data.name, command);
					client.commandArray.push(command.data.toJSON());
				} else {
					console.log(
						`[ATENCIÓN] El comando ubicado en ${path}/${folder}/${file} no cuenta con las propiedades obligatorias "data" o "execute".`
					);
				}
			}
		}

		const rest = new REST({ version: '10' }).setToken(token);
		(async () => {
			try {
				console.log(
					`- Se comienza el refrescado de ${client.commandArray.length} comandos (/) de la aplicacion.`
				);

				const data = await rest.put(
					Routes.applicationCommands(clientId),
          { body: client.commandArray }
				);

				console.log(
					`+ Refrescado exitoso de ${data.length} comandos (/) al recargar la aplicacion.`
				);
			} catch (error) {
				console.error(error);
			}
		})();
	};
};
