const config = require('../config');

module.exports = {
	async getEvents() {
		return [true];
	},
	async execute(event, client) {
		const guilds = await client.guilds.fetch();

		guilds.forEach(async (guild) => {
			const hackerRole = await guild.roles.fetch('839999346459672609'); // OBTENER EL ROL HACKER //TODO: OBTENERLO DE LA BASE DE DATOS

			// SETS RANDOM HEX COLOR
			const randomHex = Math.floor(Math.random() * 16777215).toString(16);
      const randomColor = '#' + randomHex;
      hackerRole.setColor(randomColor);
      console.log(randomColor);
		});
	},
};
