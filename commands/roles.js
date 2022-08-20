// FINISHED

const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const rolesModel = require('../models/roles.model');
let { mongo } = require('../config');
const config = require('../config');

mongoose.connect(mongo, {
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = {
	name: 'roles',
	description: 'Manejar informacion sobre los roles obtenibles del servidor.',
	usages: [''],
	modUsages: ['add <@rol> <meta>', 'remove <@rol>', 'update <@rol> <meta>'],
	guildOnly: true,
	async execute(msg, args, isMod) {
		const { member, guild, channel, client } = msg;
		let [action, _role, howto] = args;

		// Comprobar que no se trata de una accion moderacion por parte de un usuario normal
		if (
			(action === 'add' || action === 'remove' || action === 'update') &&
			!isMod
		)
			return channel.send(
				`:no_pedestrians: Alto ahí **${member.user.username}** pantalones cuadrados.`
			);

		// Comprobar que el uso del rol de moderacion es correcto
		if (args.length !== 0 && args.length < 3) {
			const replyMsg = new MessageEmbed()
				.setColor('RED')
				.setTitle(`Comando incompleto...`)
				.setDescription(
					`El uso correcto sería: \n\`${config.prefix}${
						this.name
					} ${this.modUsages.filter(
						(usage) => usage.split(' ')[0] === action
					)}\``
				);

			return channel.send({ embeds: [replyMsg] });
		}

		if (action === 'add') {
			// msg.delete()
			const role = guild.roles.cache.find((r) => r.id === parseRole2ID(_role));
			const findedRole = await rolesModel.findOne({
				guildID: guild.id,
				roleID: role.id,
			});
			if (findedRole)
				return channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								`El rol **<@&${role.id}>** ya está configurado para obtenerse de la siguiente manera: \`${findedRole.goal}\`.\nSi quieres cambiarlo usa \`${config.prefix}roles update <@rol> <meta>\``
							),
					],
				});

			const newRoleInfo = new rolesModel({
				guildID: guild.id,
				roleID: role.id,
				goal: howto,
			});
			await newRoleInfo
				.save()
				.catch((e) => console.log(`Failed to save role info: ${e}`));

			return channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('#f0ad7a')
						.setDescription(
							`El rol **<@&${role.id}>** se configuro para obtenerse de la siguiente manera: \`${howto}\``
						),
				],
			});
		}
		if (action === 'remove') {
			// msg.delete()
			const role = guild.roles.cache.find((r) => r.id === parseRole2ID(_role));
			const findedRole = await rolesModel.findOne({
				roleID: role.id,
				guildID: guild.id,
			});
			if (!findedRole) return false;

			await rolesModel
				.findOneAndDelete({ roleID: role.id, guildID: guild.id })
				.catch((e) => console.log(`Failed to delete role info: ${e}`));

			const MsgRemoved = new MessageEmbed()
				.setColor('#f0ad7a')
				.setDescription(
					`La informacion del rol **<@&${role.id}>** fue eliminada.`
				);
			return channel.send({ embeds: [MsgRemoved] });
		}
		if (action === 'update') {
			// msg.delete();
			const role = guild.roles.cache.find((r) => r.id === parseRole2ID(_role));
			const findedRole = await rolesModel.findOne({
				roleID: role.id,
				guildID: guild.id,
			});
			if (!findedRole) return false;

			await rolesModel
				.findOneAndUpdate(
					{ roleID: role.id, guildID: guild.id },
					{ goal: howto }
				)
				.catch((e) => console.log(`Failed to update role_ ${e}`));

			const MsgUpdated = new MessageEmbed()
				.setColor('#f0ad7a')
				.setDescription(
					`El rol **<@&${role.id}>** se configuro para obtenerse de la siguiente manera: \`${howto}\``
				);
			return channel.send({ embeds: [MsgUpdated] });
		}

		// obtener todos los roles configurados 
		const findedRoles = await rolesModel.find({ guildID: guild.id });
		if (!findedRoles) return false;

		const sorteableRoles = findedRoles.map(({ roleID, goal }) => ({
			roleID,
			goal,
			rawPosition: guild.roles.cache.find((r) => r.id === roleID).rawPosition,
		}));

		const MsgRoles = new MessageEmbed()
			.setColor('#f0ad7a')
			.setTitle(':reminder_ribbon: Roles obtenibles:')
			.setDescription(
				sorteableRoles
					.sort((a, b) => {
						if (a.rawPosition < b.rawPosition) return 1;
						if (a.rawPosition > b.rawPosition) return -1;
						return 0;
					})
					.map(({ roleID, goal }) => `**<@&${roleID}>**: \`${goal}\``)
					.join('\n')
			)
			.setFooter({
				text: 'Informacion de roles en JeeS.',
				iconURL: client.user.displayAvatarURL(),
			});

		return channel.send({ embeds: [MsgRoles] });
	},
};

const parseRole2ID = (role) => {
	if (role.startsWith('<@&')) {
		return role.slice(3, -1);
	} else {
		return role;
	}
};
