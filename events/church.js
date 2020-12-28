const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const churchEvent = require("../models/church.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const days = {'Sun': 'Transmisión por Facebook', 'Mon': '', 'Tue': '', 'Wed': 'Culto de Oración', 'Thu': 'Celula de Jovenes', 'Fri': '', 'Sat': 'Reunion de Jovenes'};

module.exports = {
  disable: true,
  async getEvents(today) {
    const day = today[0];
    const events = await churchEvent.find({ day });
    return events;
  },
  async execute(event, client) {
    const guild = await client.guilds.fetch(event.guildID);
    const channel = guild.channels.resolve('556213348585439245'); //HERE MAIN CHANNEL FROM GUILD/SERVER

    if(!channel || !member.user) return console.log("HAY ALGO QUE NO HAY");

    const MsgChurch = new MessageEmbed()
        .setColor('#088ccf')
        .setTitle(`Hay una reunion de Zoom programada!`)
        .setDescription(``)

    channel.send('@everyone');
    channel.send(MsgChurch);
  },
};