const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

    const [who, action, ...fecha] = args;
    const target = mentions.users.first();
    if(!target) return channel.send(new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`))

    if(action === 'add') {
      const newBday = new birthdays({
        userID: target.id,
        guildID: guild.id,
        day: fecha
      });

      return await newBday.save().catch(e => console.log(`Failed to save birthday: ${e}`));

    } else if(action === 'remove') {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;
  
      return await birthdays.findOneAndDelete({ userID: target.id, guildID: guild.id }).catch(e => console.log(`Failed to delete bday: ${e}`));

    } else if (action === 'update') {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;

      const newBday = new birthdays({
        userID: target.id,
        guildID: guild.id,
        day: fecha
      });
  
      return await birthdays.findOneAndUpdate({ userID: target.id, guildID: guild.id }, { day: fecha }).catch(e => console.log(`Failed to update bday_ ${e}`))

    } else {
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;

      const MsgBday = new MessageEmbed()
          .setColor('#f0ff7a')
          .setDescription(`El cumpleaños de: ${target.username} es el ${bday.day}`)
            
      return channel.send(MsgBday)
    }
	},
};