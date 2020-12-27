const mongoose = require("mongoose");

const churchSchema = new mongoose.Schema({
  guildID: { type: String },
  day: { type: String },
  time: { type: String }
});

module.exports = mongoose.model('Birthdays',churchSchema);
