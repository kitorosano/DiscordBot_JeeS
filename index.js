const express = require("express");
const { port: PORT } = require("./config.js");

const app = express();

app.get("/", (req, res) => {
	res.send("Hello world from Replit");
});

app.listen(PORT, () => console.log(`App listening at port: ${PORT}`));

const botjs = require("./bot.js");
