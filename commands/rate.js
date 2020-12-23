const {prefix} = require('../config');

module.exports = {
	name: 'rate',
	description: 'Evalua a tu :eyes:.',
  usage: '<waifu/husbando> <nombre>',
  args: true,
  disable: true,
	cooldown: 5,
	execute(msg, args) {
    const data = [];
    const { commands } = msg.client;

    if (!args.length == 1) {
      return msg.author.send('Necesitas decirme a quien deseas calificar');
    }

	},
};