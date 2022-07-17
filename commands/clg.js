const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'clg',
	description: 'Console-Log a la propiedad dispuesta, para debuggear.',
	usages: ['[guild]', '[channel]', '[roles]', '[@member]', '[@role]'],
	modOnly: true,
	async execute(msg, args, isMod) {
		const { author, guild, mentions, channel } = msg;
		msg.delete();

		if (!args.length) return console.log(author);
		args.forEach((obj) => {
			if (mentions.users.size) mentions.users.map((user) => console.log(user));
			if (mentions.roles.size) mentions.roles.map((rol) => console.log(rol));
			if (obj === 'guild') return console.log(guild);
			if (obj === 'channel') return console.log(channel);
			if (obj === 'roles') return console.log(guild.roles.cache);
		});
	},
};
