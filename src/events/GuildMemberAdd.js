const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
		const channel = client.guild.systemChannel;
		if (!channel) return;
		channel
      .send(`Te damos la bienvenida ${member} al servidor Jees!`)
	    .then(msg => msg.react('🤲'))
  }
}