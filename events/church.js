const {MessageEmbed} = require('discord.js');
const mongoose = require("mongoose");
const birthdays = require("../models/birthdays.model");
let {mongo} = require('../config');

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = {
  disable: true,
  async fetch(today) {
    return await days.find({ day: today });
  },
  async execute() {
    
  },
};