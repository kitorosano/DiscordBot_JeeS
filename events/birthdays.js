const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdayEvent = require("../models/birthdays.model");
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
    const day = `${parseInt(today[2])}/${months[today[1]]}`
    const events = await birthdayEvent.find({ day });
    return events;
  /**[ { guildID, userID, day("8/11"), time("00:01")}, {...}, {...} ] */
  },
  async execute(event, client) {
    const guild = await client.guilds.fetch(event.guildID);
    const member = await guild.members.fetch(event.userID);
    // const channel = guild.channels.resolve('775953256228716556'); //HERE MAIN CHANNEL FROM GUILD/SERVER
    const channel = guild.channels.resolve('837826705678532608'); //HERE TEST CHANNEL FROM GUILD/SERVER
    if(!channel.id || !member.user) return console.log("HAY ALGO QUE NO HAY");

    const initID = 'initEvent-'+ event._id.toString();
    let formattedTime, minute, hour;
    if(!event.mention) {
      formattedTime = event.time.split(':');
      minute = parseInt(formattedTime[1]);
      hour = parseInt(formattedTime[0]) + 3; //por el GMT-3
      if (hour > 23) hour -= 24;
    } else {
      formattedTime = new Date().toLocaleString().split(' ')[1].split(':');
      hour = formattedTime[0];
      minute = formattedTime[1] + 1
    }

    scheduleJob(initID,`${minute} ${hour} * * *`, async () => {

      // const BdayRole = guild.roles.cache.find(role => role.name === 'Cumpleañer@');
      const roles = await guild.roles.fetch();
      const BdayRole = roles.cache.find(role => role.name === 'Cumpleañer@');
      member.roles.add(BdayRole)
      console.log(member.roles)

      if(!event.mention) {
        const MsgBday = new MessageEmbed()
            .setColor('YELLOW')
            .setAuthor(`¡Hay un Cumpleañer@ entre nosotros!`, member.user.displayAvatarURL())
            .setDescription(`:confetti_ball: Que los cumplas muy feliz ${member.user}! Todos te deseamos un grandioso dia y muchas bendiciones en el servidor ${guild.name} :partying_face:`)

        channel.send('@everyone');
        channel.send(MsgBday);
        
        const bday = await birthdayEvent.findOne({ userID: event.userID, guildID: event.guildID });
        if (!bday) return false;
        await birthdayEvent.findOneAndUpdate({ userID: event.userID, guildID: event.guildID }, { mention: true }).catch(e => console.log(`Failed to update bday_ ${e}`))
      }

      /*APAGAR EL EVENTO*/
      const endID = 'endBday-' + event._id.toString();
      scheduleJob(endID,'59 2 * * *', () => {
        member.roles.remove(BdayRole)
        console.log('rol removido')
  
        (async function restartBday(){
          const bday = await birthdayEvent.findOne({ userID: event.userID, guildID: event.guildID });
          if (!bday) return false;
          await birthdayEvent.findOneAndUpdate({ userID: event.userID, guildID: event.guildID }, { mention: false }).catch(e => console.log(`Failed to update bday_ ${e}`))
        }())
  
        cancelJob(id)
      })

    })
  },
};

