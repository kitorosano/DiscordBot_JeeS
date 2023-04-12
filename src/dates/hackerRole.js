const config = require('../config');

module.exports = {
	async getEvents() {
		return [true];
	},
	async execute(event, client) {
		const guilds = await client.guilds.fetch();

		guilds.forEach(async (_guild) => {
			const guild = await _guild.fetch();
			const hackerRole = await guild.roles.fetch('839999346459672609'); // OBTENER EL ROL HACKER //TODO: OBTENERLO DE LA BASE DE DATOS

			if (!hackerRole)
				return console.log(
					'No se encontro el rol hacker en el servidor ' + guild.name
				);
			// SETS RANDOM HEX COLOR
			const randomHex = Math.floor(Math.random() * 16777215).toString(16);
			const randomColor = '#' + randomHex;
			hackerRole.setColor(randomColor);
		});
	},
};
