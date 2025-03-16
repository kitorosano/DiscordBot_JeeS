const express = require("express");
const { port: PORT } = require("./config.js");

const app = express();

// Route specifically for uptime monitoring services
app.get("/ping", (req, res) => {
	const datetime = new Date().toLocaleString("es-UY", {
		timeZone: "America/Montevideo",
		hour12: false,
	});
	console.log(`Health check ping received at ${datetime}`);
	res.status(200).send("JeeS Discord Bot is running! 🚀");
});

app.listen(PORT, "0.0.0.0", () =>
	console.log(`App listening at port: ${PORT}`),
);

const botjs = require("./bot.js");
