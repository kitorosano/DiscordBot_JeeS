const fs = require('node:fs');

module.exports = (client) => {
  client.handleDates = async () => {
    const today = new Date().toDateString(); // Obtener fecha de hoy

    const dateFiles = fs
      .readdirSync('./src/dates')
      .filter((file) => file.endsWith('.js'));
    for (const file of dateFiles) {
      //para cada tipo de fecha como archivo .js, obtengo las fechas del dia.
      const typeEvent = require(`../dates/${file}`); //ESTO PASARSELO AL COMANDO ¡dates, PARA EVENTOS DEL DIA
      if (typeEvent.disable) continue; //filtrar fechas desactivados

      const typeEvents = await typeEvent.getEvents(today.split(' '), client); //Obtener entradas del dia para este tipo de fecha
      if (!typeEvents.length) continue; //Si no hay nada de esta fecha para hoy, a.k.a si el array esta vacio

      typeEvents.forEach((singleEventData) => {
        //para cada fecha de grupo, configurar una "alarma" del dia para cada uno
        typeEvent.execute(singleEventData, client);
      });
    }

    console.log(`+ Cargado de calendario del dia ${today} completado.`);
  }
}