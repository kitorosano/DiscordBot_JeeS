const {MessageEmbed} = require('discord.js');
const Levels = require("discord-xp");
const {mongo} = require('../config');
Levels.setURL(mongo);

module.exports = {
  name: 'prune',	
  description: 'Elimina entre 1-100 mensajes del canal. Se puede especificar de que usuarios borrar los mensajes.',
  aliases: ['delete', 'del','purge'],
  usage: '<cantidad total> [@usuarios]',
  guildOnly: true,
	modOnly: true,
	args: true,		
  async execute(msg, args) {
    const {author, guild, mentions, channel} = msg;
    const [many, ...who] = args;
    
		if(isNaN(many)) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Asegurese de ingresar una cantidad de mensajes a eliminar`)]})
    if(many > 100) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Ingrese un valor menor a 100`)]})
		if(many <= 1) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Ingrese un valor mayor a 1`)]})

		if(!mentions.users.size) {
			
			return channel.bulkDelete(many, true)
			.then(mensajes => {
				channel.send({embeds: [new MessageEmbed().setColor("GREEN").setAuthor(`Se han eliminado ${mensajes.size}/${many} mensajes.`)]})
				.then(msg => setTimeout(() => msg.delete() ,5000))
			})
			.catch(() => channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Algo malio sal...`)]}));
		
		}else {
			let count = 1;
			mentions.users.forEach(async member => {
				if(!member) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`)]})
				
				const messages = channel.messages.fetch();
				const userMessages = (await messages).filter(msg => msg.author.id === member.id);

				channel.bulkDelete(Array.from(userMessages.keys()).slice(0, parseInt(many / mentions.users.size) +1), true)
				.catch((e) => channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Algo malio sal...`).setFooter('Recuerda que no puedo eliminar mensajes anteriores a 2 semanas')]}));
			});

			channel.send({embeds: [new MessageEmbed().setColor("GREEN").setAuthor(`Se han eliminado ${many} mensajes en total de los usuarios mencionados.`)]})
			.then(msg => {count++; setTimeout(() => msg.delete() ,5000)})
		}
	},
};