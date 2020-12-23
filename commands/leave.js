const ytdl = require('ytdl-core');
module.exports = {
  name: 'leave',
	disable: true,
  description: 'Expulsa al bot del canal de voz actual del usuario',
  guildOnly: true,
  async execute(msg, args) {
    if (msg.member.voice.channel) {
      await msg.member.voice.channel.leave();
    }
  }
}