const mongoose = require("mongoose");

const bdaysSchema = new mongoose.Schema({
  guildID: { type: String },
  userID: { type: String },
  day: { type: String },
  time: { type: String, default: "00:01" },
  mention: {type: Boolean, default: false}
});

module.exports = mongoose.model("Birthdays", bdaysSchema);

//quitar el time?