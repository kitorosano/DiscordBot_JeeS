// AGREGAR MAS REPLIES

const rnd = require('random');

module.exports = {
	name: 'gracias',
  description: 'El bot te reponde al gracias.',
  cooldown: 10,
  execute(msg, args, isMod) {
    const replies = [
      `De nada, ${msg.author} :sunglasses:`,
      `${msg.author}, cuando necesites maestro.`,
      `${msg.author}, mi casa es tu casa bro.`,
      `${msg.author}, PUEEDE SERR PAA?!.`,
    ];
    const index = rnd.int(0, replies.length -1)
    return msg.channel.send(replies[index])
  }
	
};