const {
	Client,
	GatewayIntentBits,
	Collection,
	Partials
} = require('discord.js');
const { token } = require('./config');
const fs = require('fs');
const { scheduleJob } = require('node-schedule');

const client = new Client({
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
	intents: [
		GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.Message,
    Partials.GuildMember
	],
});
client.commands = new Collection();

/**== OBTENER Y EJECUTAR TODAS LAS FUNCIONES **/
const functionsFiles = fs
  .readdirSync('./src/functions')
  .filter((file) => file.endsWith('.js'));
for (file of functionsFiles) {
  require(`./functions/${file}`)(client);
}

client.login(token); //LOGEAR Y ARRANCAR EL BOT
client.handleCommands();
client.handleEvents();
client.handleDates();
scheduleJob({ minute: 0, hour: 0, tz: 'America/Montevideo' }, client.handleDates); // CONFIGURO REINICIAR LOS EVENTOS A LAS 00:00 GMT-3