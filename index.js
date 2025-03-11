const express = require("express");
const { port: PORT } = require("./config.js");

const app = express();

app.get("/", (req, res) => {
	const datetime = new Date().toLocaleString("es-UY", {
		timeZone: "America/Montevideo",
		hour12: false,
	});
	console.log(`Received ping at ${datetime}`);
	res.send("Hello world from Replit");
});

// Route specifically for uptime monitoring services
app.get("/ping", (req, res) => {
	console.log(`Health check ping received at ${new Date().toISOString()}`);
	res.status(200).send("Bot is running!");
});

app.listen(PORT, "0.0.0.0", () => console.log(`App listening at port: ${PORT}`));

const botjs = require("./bot.js");
