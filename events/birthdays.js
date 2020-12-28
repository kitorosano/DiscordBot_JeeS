const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
// const config = require("../models/config.model");
let {mongo} = require('../config');
const {scheduleJob, cancelJob} = require('node-schedule');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const months = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};

module.exports = { 
  async getEvents(today) {
    const day = `${today[2]}/${months[today[1]]}`
    const birthday = await birthdays.find({ day });
    return birthday;
  /**[ { guildID, userID, day("8/11"), time("00:01")}, {...}, {...} ] */
  },
  async execute(event, client) {
    const guild = await client.guilds.fetch(event.guildID);
    const channel = guild.channels.resolve('556213348585439245'); //HERE MAIN CHANNEL FROM GUILD/SERVER
    const member = await guild.members.fetch(event.userID);

    if(!channel || !member.user) return console.log("HAY ALGO QUE NO HAY");

    const BdayRole = guild.roles.cache.find(role => role.name === 'Cumpleañer@');
    member.roles.add(BdayRole)

    const MsgBday = new MessageEmbed()
          .setColor('YELLOW')
          .setAuthor('Hoy eres @Cumpleañer@', member.user.displayAvatarURL())
          .setDescription(`:confetti_ball: Muy Feliz Cumpleaños ${member.user.username}:partying_face: Todos te deseamos muchas bendiciones en el servidor JeeS.`)

    channel.send('@everyone');
    channel.send(MsgBday);

    let id = 'endBday-' + event._id.toString();
    scheduleJob(id,'59 2 * * *', () => {
      member.roles.remove(BdayRole)
      cancelJob(id)
    })
  },
};

