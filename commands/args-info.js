module.exports = {
	name: 'args-info',
	description: 'Informacion de los argumentos provistos.',
	args: 1,
	disable: true,
	usages: ['<argumentos>'],
	guildOnly: true,
	execute(msg, args, isMod) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		msg.channel.send(
			`Argumentos: ${args}\nTamaño de los argumentos: ${args.length}`
		);
	},
};
