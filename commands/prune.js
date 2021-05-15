const {MessageEmbed} = require('discord.js');
const Levels = require("discord-xp");
const {mongo} = require('../config');
Levels.setURL(mongo);

module.exports = {
	name: 'prune',	
  description: 'Elimina cantidad mensajes. Incluso se puede especificar de que usuarios borrar mensajes.',
  aliases: ['delete', 'del','purge', 'test'],
  usage: '<cantidad> [usuarios]',
  guildOnly: true,
	modOnly: true,
	args: true,
  async execute(msg, args) {
    const {author, guild, mentions, channel} = msg;
    const [many, ...who] = args;
    
		if(isNaN(many)) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Asegurese de ingresar una cantidad de mensajes a eliminar`))
    if(many > 100) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Ingrese un valor menor a 100`))
		if(many <= 1) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Ingrese un valor mayor a 1`))

		if(!mentions.users) {
			const target = mentions.users;
			target.forEach(async member => {
				if(!member) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`))
				const messages = await channel.messages.fetch();
				
				const userMessages = messages.filter(msg => msg.author.id === member.user.id);
				console.log(userMessages);
				console.log("==============")
			});
		}else {
			// channel.bulkDelete(many)
			// .then(mensajes => channel.send(new MessageEmbed().setColor("GREEN").setAuthor(`Se han eliminado ${mensajes.size}/${many} mensajes.`)))
			// .catch(() => channel.send(new MessageEmbed().setColor("RED").setAuthor(`Algo malio sal...`)));
		}
			

	},
};