const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
 
module.exports = {
	name: 'bday',
  description: 'Manejar cumpleaños',
  aliases: ['birthday'],
  usage: '<usuario> [add/remove/update] [dia/mes]',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args) {
    const {author, guild, mentions, channel} = msg;
    const [who, action, fecha] = args;

    const target = mentions.users.first();
    if(!target) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`))
    
    // check if auhtor is mod or admin for add/remove/update
    if(action === 'add') {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (bday) return channel.send(new MessageEmbed().setColor('RED').setTitle(`El cumpleaños de ${target.username} ya está programado para el: ${bday.day}`));

      const newBday = new birthdays({
        userID: target.id,
        guildID: guild.id,
        day: fecha
      });
      await newBday.save().catch(e => console.log(`Failed to save birthday: ${e}`));

      return channel.send(new MessageEmbed().setColor('#f0ff7a').setTitle(`El cumpleaños de ${target.username} fue programado para el: ${bday.day}`))

    } else if(action === 'remove') {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;
  
      await birthdays.findOneAndDelete({ userID: target.id, guildID: guild.id }).catch(e => console.log(`Failed to delete bday: ${e}`));

      const MsgRemoved = new MessageEmbed()
          .setColor('#f0ff7a')
          .setTitle(`El cumpleaños de ${target.username} fue eliminado`)  
      return channel.send(MsgRemoved)

    } else if (action === 'update') {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;

      await birthdays.findOneAndUpdate({ userID: target.id, guildID: guild.id }, { day: fecha }).catch(e => console.log(`Failed to update bday_ ${e}`))

      const MsgUpdated = new MessageEmbed()
          .setColor('#f0ff7a')
          .setTitle(`El cumpleaños de ${target.username} ahora es el ${bday.day}`)
      return channel.send(MsgUpdated)

    } else {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return new MessageEmbed().setColor('RED').setDescription('Aun no tenemos el cumpleaños de esta persona...');

      const MsgBday = new MessageEmbed()
          .setColor('#f0ff7a')
          .setDescription(`El cumpleaños de **${target.username}** es el \`${bday.day}\``)

      return channel.send(MsgBday)
    }
	},
};