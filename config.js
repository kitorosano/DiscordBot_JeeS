require("dotenv").config();
module.exports = {
  prefix: "¡",
  token: process.env.TOKEN,
  mongo: process.env.MONGODB,
  allowedUsers: [],
  modUsers: ['612097099542167574', '484774210372108300'],
  xp: {
    from: 15,
    to: 25,
    cooldown: 60000 
  }
}