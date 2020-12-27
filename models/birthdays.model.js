const mongoose = require("mongoose");

const bdaysSchema = new mongoose.Schema({
  guildID: { type: String },
  userID: { type: String },
  day: { type: String },
  time: { type: String, default: "05:26" },
});

module.exports = mongoose.model("Birthdays", bdaysSchema);
