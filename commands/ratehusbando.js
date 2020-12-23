const {MessageEmbed} = require('discord.js');
const rnd = require('random');

module.exports = {
  name: 'ratehusbando',
  description: 'Califica a tu husbando',
  aliases: ['husbando'],
  usage: '<tu_husbando>',
  guildOnly: true,
  args: true,
  execute(msg, args) {
    let husbando = '';
    args.forEach(elt => {
      husbando+= elt.toString() + ' '
    });

    let rate = rnd.int(1,10);
    if(args.length === 1 && args[0] == '<@!776917497382436884>') return msg.channel.send(new MessageEmbed().setColor("YELLOW").setDescription(`😎 Y yo me doy un **11/10**`));

    const MsgRate = new MessageEmbed().setColor("YELLOW").setDescription(`🤔 Yo le doy a **${husbando}** un **${rate}/10**`)
    return msg.channel.send(MsgRate)
  }
}