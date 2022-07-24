require('dotenv').config();
module.exports = {
	prefix: '¡',
	token: process.env.TOKEN,
	mongo: process.env.MONGODB,
	xp: {
		from: 15,
		to: 25,
		cooldown: 60000,
	},
	TEST_CHANNEL: '837826705678532608',
	MAIN_CHANNEL: '775953256228716556',
};
