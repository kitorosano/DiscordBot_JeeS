module.exports = {
	name: 'test',
	description:
		'Comando para testear funciones especificas desde el codigo del bot.',
	guildOnly: true,
	modOnly: true,
	async execute(msg, args, isMod) {
		const { guild } = msg;

		const roles = await guild.roles.fetch();
		const hackerRole = roles.find((role) => role.name === 'Hacker');

		// SETS RANDOM HEX COLOR
		const randomHex = Math.floor(Math.random() * 16777215).toString(16);
		const randomColor = '#' + randomHex;
		hackerRole.setColor(randomColor);
	},
};
