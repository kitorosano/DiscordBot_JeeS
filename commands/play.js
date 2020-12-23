const ytdl = require('ytdl-core');
module.exports = {
	disable: true,
  name: 'play',
  description: 'Reproduce musica desde YouTube',
  args: true,
  guildOnly: true,
  async execute(msg, args) {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
    }


  }
}