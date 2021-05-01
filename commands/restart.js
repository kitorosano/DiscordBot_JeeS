const {token,} = require('../config');


module.exports = {
	name: 'restart',
	description: 'Restart JeeS bot',
	aliases: ['reset'],
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {channel,client } = msg;
    
    if(!isMod) return;

		await channel.send('*Reiniciando...*');
		await	client.destroy();
		await	client.login(token)
		channel.send('**Buenos dias!**');
  },
};

