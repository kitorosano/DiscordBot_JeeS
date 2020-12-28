const mongoose = require("mongoose");

const churchSchema = new mongoose.Schema({
  guildID: { type: String },
  day: { type: String },
  time: { type: String },
  link: { type: String},
  code: { type: String},
  pass: { type: String}
});

module.exports = mongoose.model('Birthdays',churchSchema);
