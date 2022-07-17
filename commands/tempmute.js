const {
	MessageEmbed,
	MessageAttachment,
	ClientVoiceManager,
} = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'tempmute',
	description: 'Mutea a un miembro del servidor en todos los canales de texto.',
	usages: ['<usuario> <duracion (1h, 2m, 10s)> [razon]'],
	guildOnly: true,
	modOnly: true,
	args: 2,
	async execute(msg, args, isMod) {
		const [who, time, ...why] = args;
		const { guild, mentions, channel } = msg;

		const razon = why.length > 0 ? why.join(' ') : 'Sin especificar';
		const target = mentions.users.first();

		const roles = await guild.roles.fetch();
		const mutedRole = roles.find((role) => role.name === 'Silenciado');
		const memberTarget = await guild.members.fetch(target.id);

		if (memberTarget.roles.cache.has(mutedRole.id)) {
			// SI YA ESTABA MUTEADO
			const MsgNoSePuede = new MessageEmbed().setColor('ORANGE').setAuthor({
				name: 'No puedes mutear a alguien que ya está silenciado.',
			});
			return channel.send({ embeds: [MsgNoSePuede] });
		}

		memberTarget.roles.add(mutedRole); //AGREGA EL ROL
		const { tag } = memberTarget.user;

		const exampleEmbed = new MessageEmbed()
			.setColor('#323232')
			.setAuthor({
				name: `${tag} ha sido silenciad@ durante ${ms(ms(time))}`,
				iconURL: memberTarget.user.displayAvatarURL({
					format: 'png',
					dynamic: true,
				}),
			})
			.setDescription(`**Razón**: ${razon}`)
			.setFooter({ text: `Para desmutearlo enseguida usa: ¡unmute <usuario>` });
		channel.send({ embeds: [exampleEmbed] });

		setTimeout(() => {
			memberTarget.roles.remove(mutedRole); //QUITA EL ROL
			const MsgDesmuteado = new MessageEmbed().setColor('#424242').setAuthor({
				name: `${tag} ya no está silenciad@`,
				iconURL: memberTarget.user.displayAvatarURL({
					format: 'png',
					dynamic: true,
				}),
			});
			return msg.channel.send({ embeds: [MsgDesmuteado] });
		}, ms(time));
	},
};
