const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const birthdayEvent = require('../models/birthdays.model');
// const config = require("../models/config.model");
let { mongo } = require('../config');
const { scheduleJob, cancelJob } = require('node-schedule');
const config = require('../config');

mongoose.connect(mongo, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
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

module.exports = {
	async getEvents(today) {
		const day = `${parseInt(today[2])}/${months[today[1]]}`;
		const events = await birthdayEvent.find({ day });
		return events;
		/**[ { guildID, userID, day("8/11"), time("00:01")}, {...}, {...} ] */
	},
	async execute(event, client) {
		const guild = await client.guilds.fetch(event.guildID);
		let member;
		try {
			member = await guild.members.fetch(event.userID);
		} catch (e) {
			console.log(
				`Este cumpleañero de id '${event.userID}' no está en el servidor`
			);
		}
		const channel = guild.channels.resolve(config.MAIN_CHANNEL); //HERE MAIN CHANNEL FROM GUILD/SERVER
		// const channel = guild.channels.resolve(config.TEST_CHANNEL); //HERE TEST CHANNEL FROM GUILD/SERVER
		// if (!channel.id || !member) return console.log('HAY ALGO QUE NO HAY');

		// const BdayRole = guild.roles.cache.find(role => role.name === 'Cumpleañer@');
		const roles = await guild.roles.fetch();
		const BdayRole = roles.find((role) => role.name.includes('Cumpleañer@')); //new includes because ====== Cumpleañer@ ======

		//Si el evento no ha sido mencionado, entonces ejecutarlo.
		if (!event.mention) {
			let MsgBday;
			// MENSAJE DEPÉNDIENDO DE SI ESTA EN EL SERVIDOR O NO
      if(!member){
        MsgBday = new MessageEmbed() 
        .setColor('YELLOW')
        .setAuthor({
          name: `¡Hay un Cumpleañer@ pero no está entre nosotros!`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `:confetti_ball: Hoy alguien esta cumpliendo años... pero no se encuentra en el servidor:disappointed: Aun asi, le deseamos un grandioso dia y muchas bendiciones en el servidor ${guild.name} :partying_face:`
        );
        
        channel.send('@everyone');
        return channel.send({ embeds: [MsgBday] }).then(async (msg) => {
          await msg.react(`🥳`);
        });
      }
      member.roles.add(BdayRole);

      MsgBday = new MessageEmbed()
        .setColor('YELLOW')
        .setAuthor({
          name: `¡Hay un Cumpleañer@ entre nosotros!`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setDescription(
          `:confetti_ball: Que los cumplas muy feliz ${member.user}! Todos te deseamos un grandioso dia y muchas bendiciones en el servidor ${guild.name} :partying_face:`
        );
          
			channel.send('@everyone');
			channel.send({ embeds: [MsgBday] }).then(async (msg) => {
				await msg.react(`🥳`);
			});

			// Me aseguro que mencione al usuario en su cumpleaños, por si surge un reinicio imprevisto y salta otra mencion
			const bday = await birthdayEvent.findOne({
				userID: event.userID,
				guildID: event.guildID,
			});
			if (!bday) return false;
			await birthdayEvent
				.findOneAndUpdate(
					{ userID: event.userID, guildID: event.guildID },
					{ mention: true }
				)
				.catch((e) => console.log(`Failed to update bday_ ${e}`));
		}

		// QUITAR EL ROL NI BIEN TERMINE EL DIA
		const endID = 'endBday-' + event._id.toString();
		scheduleJob(
			endID,
			{ second: 50, minute: 59, hour: 23, tz: 'America/Montevideo' },
			async () => {
        if(member) member.roles.remove(BdayRole);
				// console.log('rol removido')
				await resetBdayState(event);
				cancelJob(endID);
			}
		);

		const resetBdayState = async (event) => {
			// Ahora que termino el cumpleaños, vuelvo a poner la mencion en false, para su proximo cumpleaños
			const bday = await birthdayEvent.findOne({
				userID: event.userID,
				guildID: event.guildID,
			});
			if (!bday) return false;
			await birthdayEvent
				.findOneAndUpdate(
					{ userID: event.userID, guildID: event.guildID },
					{ mention: false }
				)
				.catch((e) => console.log(`Failed to update bday_ ${e}`));
		};
	},
};
