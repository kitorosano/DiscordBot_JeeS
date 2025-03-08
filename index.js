const express = require('express');
const { port: PORT } = require('./config.js');

const app = express();

app.get('/keep-alive', (req, res) => {
	res.send('Hello world from Glitch')
});

app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));

const botjs = require('./bot.js')