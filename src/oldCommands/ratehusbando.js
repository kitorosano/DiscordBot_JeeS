const { MessageEmbed } = require('discord.js');
const rnd = require('random');

module.exports = {
	name: 'ratehusbando',
	description: 'Califica a tu husbando',
	aliases: ['husbando'],
	usages: ['<tu_husbando>'],
	guildOnly: true,
	args: 1,
	execute(msg, args, isMod) {
		const { author, channel, guild, mentions } = msg;
		let husbando = mentions.users.find((user) =>
			user.username == args[0] ? user : args.join(' ')
		);
		// console.log(guild.members.cache.map(member => member.user.username));
		let rate = rnd.int(3, 8) + rnd.int(-2, 2);
		if (args.length === 1 && husbando == 'JeeS')
			return channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('YELLOW')
						.setDescription(`😎 Y yo me doy un **11/10**`),
				],
			});

		const MsgRate = new MessageEmbed()
			.setColor('YELLOW')
			.setDescription(`🤔 Yo le doy a **${husbando}** un **${rate}/10**`);
		return channel.send({ embeds: [MsgRate] });
	},
};
