const {token,} = require('../config');

module.exports = {
	name: 'restart',
	description: 'Restart JeeS bot',
	alias: ['reset'],
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {channel,client } = msg;
    
    if(!isMod) return;

		await channel.send('Restarting...');
		await	client.destroy();
		await	client.login(token);

  },
};

