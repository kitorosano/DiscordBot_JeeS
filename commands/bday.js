const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
 
// Semi-modOnly
module.exports = {
	name: 'bday',
  description: 'Manejar cumpleaños',
  aliases: ['birthday'],
  usage: '<usuario> ([add/remove/update] [dia/mes])',
  guildOnly: true,
  args: true,
  async execute(msg, args) {
    const {member, guild, mentions, channel} = msg;
    const [who, action, fecha] = args;
    console.log(action)

    const target = mentions.users.first();
    if(!target) return;
    
    // check if auhtor is mod or admin for add/remove/update
    if((action === 'add' || action === 'remove' || action === 'update') && !member.roles.cache.find(role => role.name === 'Moderador')){
      return channel.send(`:no_pedestrians: **${target.username}**,alto ahí pantalones cuadrados.`)
    }

    if(action === 'add') {
      msg.delete()
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (bday) return channel.send(new MessageEmbed().setColor('RED').setDescription(`El cumpleaños de **${target.username}** ya está programado para el: ${bday.day}`));

      const newBday = new birthdays({
        userID: target.id,
        guildID: guild.id,
        day: fecha
      });
      await newBday.save().catch(e => console.log(`Failed to save birthday: ${e}`));

      return channel.send(new MessageEmbed().setColor('#f0ff7a').setDescription(`El cumpleaños de **${target.username}** fue programado para el: ${fecha}`))
      
    }
    if(action === 'remove') {
      msg.delete()
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;
  
      await birthdays.findOneAndDelete({ userID: target.id, guildID: guild.id }).catch(e => console.log(`Failed to delete bday: ${e}`));

      const MsgRemoved = new MessageEmbed()
          .setColor('#f0dd7a')
          .setDescription(`El cumpleaños de **${target.username}** fue eliminado`)  
      return channel.send(MsgRemoved)

    }
    if (action === 'update') {
      msg.delete()
      const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
      if (!bday) return false;

      await birthdays.findOneAndUpdate({ userID: target.id, guildID: guild.id }, { day: fecha }).catch(e => console.log(`Failed to update bday_ ${e}`))

      const MsgUpdated = new MessageEmbed()
          .setColor('#f0ff7a')
          .setDescription(`El cumpleaños de **${target.username}** ahora es el ${bday.day}`)
      return channel.send(MsgUpdated)

    } 
    
    const bday = await birthdays.findOne({ userID: target.id, guildID: guild.id });
    if (!bday) return channel.send(new MessageEmbed().setColor('RED').setDescription(`Aún no tenemos el cumpleaños de **${target.username}**`));

    const MsgBday = new MessageEmbed()
        .setColor('#f0ff7a')
        .setDescription(`El cumpleaños de **${target.username}** es el \`${bday.day}\``)

    return channel.send(MsgBday)
	},
};