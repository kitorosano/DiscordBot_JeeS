const mongoose = require('mongoose');

const poolsSchema = new mongoose.Schema({
  guildID: { type: String },
  channelID: { type: String },
  messageID: { type: String },
  poolID: { type: String },
  question: { type: String },
  options: { type: Array, default: [] },
  isOpen: { type: Boolean, default: true },
});

module.exports = mongoose.model('Pools', poolsSchema);
