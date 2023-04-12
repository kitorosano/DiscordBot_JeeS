const fs = require('node:fs');

module.exports = (client) => {
  client.handleEvents = async () => {

    const eventsFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
    for(const file of eventsFiles) {
      const event = require(`../events/${file}`);

      if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
      } else {
        client.on(event.name, (...args) => event.execute(...args, client))
      }
    }

    console.log(`+ Cargado de eventos de cliente del sistema completado.`);
  }
}