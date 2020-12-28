require("dotenv").config();
module.exports = {
  prefix: "¡",
  token: process.env.TOKEN,
  mongo: process.env.MONGODB,
  xp: {
    from: 15,
    to: 25,
    cooldown: 60000 
  }
}