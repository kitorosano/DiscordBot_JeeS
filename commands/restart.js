const {token,} = require('../config');


module.exports = {
	name: 'restart',
	description: 'Restart JeeS bot',
	alias: ['reset'],
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {channel,client } = msg;
    
    if(!isMod) return;

		client.once('ready', async () => {
			channel.send('Buenos dias!');
		});


		await channel.send('Reiniciando...');
		await	client.destroy();
		await	client.login(token)

  },
};

