// MAS TIPOS DE REPLIES? GIFS FOTOS EMBEDS...

module.exports = {
	name: 'lame',
  description: 'El bot te dice efe.',
  aliases: ['lamentable'],
  args: true,
  usage: '<usuario>',
  cooldown: 10,
  guildOnly: true,
  async execute(msg, args) {
    return msg.channel.send(`${args[0]}... sos lamentable`)
  }
	
};