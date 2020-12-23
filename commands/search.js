const ytsr = require('ytsr');
module.exports = {
	disable: true,
  name: 'search',
  description: 'Busca un video en YouTube.',
  args: true,
  guildOnly: true,
  async execute(msg, args) {
    let filter = "";
    args.forEach(t => filter+=t+" ");

  }
}