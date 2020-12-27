const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
// const config = require("../models/config.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

module.exports = { 
  async fetch(today) {
    return await birthdays.find({ birthday: today });
  /**[ { guildID, userID, day("8/11"), time("00:01")}, {...}, {...} ] */
  },
  async execute(event, trigger, client) {
    const guild = await client.guilds.fetch(event.guildID);
    console.log(guild.name)
    const channel = guild.channels.resolve('556213348585439245'); //HERE MAIN CHANNEL FROM GUILD/SERVER
    console.log(channel.name)
    const user = await guild.member(event.userID);
    console.log(user.username)

    const MsgBday = new MessageEmbed()
          .setColor('YELLOW')
          .setDescription(`:confetti_ball: Muy Feliz Cumpleaños ${user.username}:partying_face: Todos te deseamos muchas bendiciones en el servidor JeeS.`)
          .setFooter('Hoy eres @cumpleañer@', user.displayAvatarURL())

    channel.send('@everyone')
    channel.send(MsgBday);

    trigger.delete();
  },
};

