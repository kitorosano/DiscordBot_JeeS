const { Events } = require("discord.js");
const { mongo, prefix, xp } = require("../config");
const rnd = require('random');
const Levels = require('discord-xp');
Levels.setURL(mongo);

const { CommandAdapter } = require('./CommandAdapter');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    let { content, author, member, channel, guild } = message;
		if (author.bot) return; // TERMINAR SI ES UN BOT

		const hasLeveledUp = await Levels.appendXp(
			author.id,
			guild.id,
			rnd.int(xp.from, xp.to)
		); //Agrego a la BD la nueva xp entre <from> a <to>

		if (hasLeveledUp) {
			const { level } = await Levels.fetch(author.id, guild.id);
			const MsgLvlUp = new MessageEmbed()
				.setColor('#ADC00')
				.setAuthor({
					name: `¡Felicidades! ${author.username}`,
					iconURL: author.displayAvatarURL({
						format: 'png',
						dynamic: true,
						size: 4096,
					}),
				})
				.setDescription(
					`:tada: Has ascendido a **nivel ${level}**!. :confetti_ball: Cada vez mas cerca del admin.`
				);

      // Enviar mensaje en el canal actual y luego de 3s eliminarlo
			channel
        .send({ embeds: [MsgLvlUp] })
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000);
        });
		}

    // == MANEJO DE PERMISOS Y ARGUMENTOS DE COMANDOS
		if (!content.startsWith(prefix)) return; //TERMINAR SI NO ES UN COMANDO

		const args = content.slice(prefix.length).split(/ +/); //Obtengo un array con el comando sin el prefijo y los argumentos
		const commandName = args.shift().toLowerCase(); //Aparto el comando del array de los argumentos y lo hago minuscula.

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);
		if (!command) return; //OBTENER COMANDO O SU ALIAS, Y SI ESTE NO EXISTE TERMINAR

		// const MsgNoMod = new MessageEmbed().setColor('RED').setDescription(':no_pedestrians: Alto ahí pantalones cuadrados... :eyes:')
		const isMod = member.roles.cache.find(
			(role) => role.name === 'Moderador' || role.name === 'Admin'
		);
		if (command.modOnly && !isMod) {
			// MENSAJE PARA COMANDOS SOLO DE MODERADORES
			return channel.send(
				`:no_pedestrians: **${author.username}**, alto ahí pantalones cuadrados.`
			);
		}

		if (command.guildOnly && channel.type === 'DM')
			return channel.send('No puedo ejecutar eso por mensaje directo');

		if (command.args && command.args != args.length) {
			const replyMsg = new MessageEmbed()
				.setColor('RED')
				.setTitle(`Comando incompleto...`);

			if (command.usages) {
				replyMsg.setDescription(
					`El uso correcto sería: \n${command.usages
						.map((usage) => `\`${prefix}${command.name} ${usage}\``)
						.join('\n')}`
				);
			}
			return channel.send({ embeds: [replyMsg] });
		}

    // == MANEJO DE COOLDOWN
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 2) * 1000;

		if (timestamps.has(author.id)) {
			const expirationTime = timestamps.get(author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				message
					.reply(
						`por favor espera ${timeLeft.toFixed(
							1
						)} segundo(s) mas para reusar el comando \`${command.name}\``
					)
					.then((message) => {
						setTimeout(() => message.delete(), 5000);
					});
				return;
			}
		}
		timestamps.set(author.id, now);
		setTimeout(() => timestamps.delete(author.id), cooldownAmount);

    // == EJECUCION DE COMANDO
		try {
			// command.execute(message, args, isMod);
      await CommandAdapter(command, client, message, args)
		} catch (error) {
			console.error(error);
			const MsgError = new MessageEmbed()
				.setColor('RED')
				.setAuthor({ name: 'Ha ocurrido un error al ejecutar el comando!' });
			message.reply(MsgError);
		}
  }
}