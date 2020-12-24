require("dotenv").config();
module.exports = {
  prefix: "¡",
  token: process.env.TOKEN,
  mongo: process.env.MONGODB,
  modUsers: ['768206386152341594', '778094338990538753'],
  xp: {
    from: 15,
    to: 25,
    cooldown: 60000 
  }
} 