const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const birthdaysModel = require('../models/birthdays.model');
let { mongo } = require('../config');

//TODO: MOSTRAR DIFERENCIAS ENTRE MODERACION Y NORMAL

mongoose.connect(mongo, {
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const months = {
	Jan: 1,
	Feb: 2,
	Mar: 3,
	Apr: 4,
	May: 5,
	Jun: 6,
	Jul: 7,
	Aug: 8,
	Sep: 9,
	Oct: 10,
	Nov: 11,
	Dec: 12,
};

// Semi-modOnly
module.exports = {
	name: 'bday',
	description: 'Manejar cumpleaños, ver cumpleaños previos o siguientes',
	aliases: ['birthday'],
	usages: ['[@usuario]', '[next/prev]'],
	modUsages: [
		'<usuario> add [dia/mes]',
		'<usuario> remove [dia/mes]',
		'<usuario> update [dia/mes]',
	],
	guildOnly: true,
	async execute(msg, args, isMod) {
		const { member, author, guild, mentions, channel } = msg;
		let [who, action, fecha] = args;

		if (who === 'next') {
			// Ver proximo cumpleaños
			let today = new Date(),
				bDay,
				bMonth;
			let todayCopy = new Date(today);
			let nextBdays;
			let founded = false;
			while (!founded) {
				today.setDate(today.getDate() + 1);
				if (
					today.getDate() == todayCopy.getDate() &&
					today.getMonth == todayCopy.getMonth
				)
					return channel.send('No tenemos proximos cumpleaños');

				bDay = parseInt(today.toDateString().split(' ')[2]);
				bMonth = months[today.toDateString().split(' ')[1]];

				nextBdays = await birthdaysModel.find({ day: `${bDay}/${bMonth}` });
				if (nextBdays.length) founded = true;
			}

			return channel.send({
				embeds: nextBdays.map((nBday) =>
					new MessageEmbed()
						.setColor('#ffe47a')
						.setDescription(
							`El proximo cumpleaños será de **<@${nBday.userID}>** el \`${nBday.day}\``
						)
				),
			});
		}

		if (who === 'prev') {
			// Ver cumpleaños anterior
			let today = new Date(),
				bDay,
				bMonth;
			let todayCopy = new Date(today);
			let prevBdays;
			let founded = false;
			while (!founded) {
				today.setDate(today.getDate() - 1);
				if (
					today.getDate() == todayCopy.getDate() &&
					today.getMonth == todayCopy.getMonth
				)
					return channel.send('No tenemos proximos cumpleaños');

				bDay = parseInt(today.toDateString().split(' ')[2]);
				bMonth = months[today.toDateString().split(' ')[1]];

				prevBdays = await birthdaysModel.find({ day: `${bDay}/${bMonth}` });
				if (prevBdays.length) founded = true;
			}

			return channel.send({
				embeds: prevBdays.map((nBday) =>
					new MessageEmbed()
						.setColor('#ffe47a')
						.setDescription(
							`El cumpleaños anterior fue de **<@${nBday.userID}>** el dia \`${nBday.day}\``
						)
				),
			});
		}

		let target = mentions.users.first();
		if (!target) target = author;

		// SI SE ESPECIFICA UNA ACCION PERO NO ES UN MODERADOR, SIMPLEMENTE LE MOSRTAMOS LA INFO DEL CUMPLEAÑERO
		if (
			(action === 'add' || action === 'remove' || action === 'update') &&
			!isMod
		)
			// action = undefined;
			return channel.send(
				`:no_pedestrians: Alto ahí **${member.user.username}** pantalones cuadrados.`
			);

		if (action === 'add') {
			// msg.delete()
			const bday = await birthdaysModel.findOne({
				userID: target.id,
				guildID: guild.id,
			});
			if (bday)
				return channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								`El cumpleaños de **${target.username}** ya está programado para el: ${bday.day}`
							),
					],
				});

			const newBday = new birthdaysModel({
				userID: target.id,
				guildID: guild.id,
				day: fecha,
			});
			await newBday
				.save()
				.catch((e) => console.log(`Failed to save birthday: ${e}`));

			return channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('#f0ff7a')
						.setDescription(
							`El cumpleaños de **${target.username}** fue programado para el \`${fecha}\``
						),
				],
			});
		}
		if (action === 'remove') {
			// msg.delete()
			const bday = await birthdaysModel.findOne({
				userID: target.id,
				guildID: guild.id,
			});
			if (!bday) return false;

			await birthdaysModel
				.findOneAndDelete({ userID: target.id, guildID: guild.id })
				.catch((e) => console.log(`Failed to delete bday: ${e}`));

			const MsgRemoved = new MessageEmbed()
				.setColor('#f0ad7a')
				.setDescription(
					`El cumpleaños de **${target.username}** fue eliminado`
				);
			return channel.send({ embeds: [MsgRemoved] });
		}
		if (action === 'update') {
			// msg.delete();
			const bday = await birthdaysModel.findOne({
				userID: target.id,
				guildID: guild.id,
			});
			if (!bday) return false;

			await birthdaysModel
				.findOneAndUpdate(
					{ userID: target.id, guildID: guild.id },
					{ day: fecha }
				)
				.catch((e) => console.log(`Failed to update bday_ ${e}`));

			const MsgUpdated = new MessageEmbed()
				.setColor('#f0ff7a')
				.setDescription(
					`El cumpleaños de **${target.username}** ahora es el \`${fecha}\``
				);
			return channel.send({ embeds: [MsgUpdated] });
		}
		if (who === 'list') {
			// OBTENER TODOS LOS CUMPLEAÑOS DEL SERVIDOR
			const bdays = await birthdaysModel.find({ guildID: guild.id });
			if (!bdays) return false;

			const MsgBdays = new MessageEmbed()
				.setColor('#f0ff7a')
				.setTitle(':birthday: Cumpleaños establecidos:')
				.setDescription(
					bdays
            .sort((a, b) => a.day.split('/')[0] - b.day.split('/')[0]) // ORDENAR POR DIA
						.sort(
							(a, b) =>
								parseInt(a.day.split('/')[1]) - parseInt(b.day.split('/')[1]) // ORDENAR POR MES
						)
						.map((bday) => `**<@${bday.userID}>** para el \`${bday.day}\``)
						.join('\n')
				);

			return channel.send({ embeds: [MsgBdays] });
		}
		if (action === undefined) {
			const bday = await birthdaysModel.findOne({
				userID: target.id,
				guildID: guild.id,
			});
			if (!bday)
				return channel.send({
					embeds: [
						new MessageEmbed()
							.setColor('RED')
							.setDescription(
								`Aún no tenemos el cumpleaños de **${target.username}**`
							),
					],
				});

			const MsgBday = new MessageEmbed()
				.setColor('#ffe47a')
				.setDescription(
					`El cumpleaños de **${target.username}** es el \`${bday.day}\``
				);

			return channel.send({ embeds: [MsgBday] });
		}
	},
};

/**
 * 
    ¡bday <@758881316862427137> add 4/8
    ¡bday <@751985385902571600> add 10/6
    ¡bday <@301478608097247244> add 4/10
    ¡bday <@749809629516529735> add 18/3
    ¡bday <@749028727815405618> add 27/11
    ¡bday <@727689672242757642> add 13/5
    ¡bday <@475986897680728075> add 1/10
    ¡bday <@566643523831726081> add 14/12
    ¡bday <@690337652771520572> add 26/4
    ¡bday <@754361719232528466> add 15/5
    ¡bday <@751986305902051359> add 24/7
    ¡bday <@748962153725427796> add 10/10
    ¡bday <@741873998006321173> add 17/11
    ¡bday <@612697886592991318> add 17/7
    ¡bday <@591831080089288705> add 15/10
    ¡bday <@751985162769662114> add 14/10
    ¡bday <@758160992588398593> add 27/3
    ¡bday <@777267994036142131> add 9/1
    ¡bday <@484774210372108300> add 9/1
    ¡bday <@780506471209238538> add 23/11
    ¡bday <@770107521493893150> add 14/11
    ¡bday <@612097099542167574> add 14/11
    ¡bday <@748949745892065362> add 14/5
    ¡bday <@702644725890678895> add 4/6
 */
