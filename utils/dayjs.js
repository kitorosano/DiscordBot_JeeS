
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

const dayjs = require('dayjs')
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Montevideo");

module.exports = dayjs;