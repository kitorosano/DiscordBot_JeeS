const Levels = require("discord-xp");
const { mongo } = require("../config");
Levels.setURL(mongo);

module.exports = {
  name: "leaderboard",
  description:
    "Muestra el top de nivel usuarios. Si no se proveen argumentos se hace un top 10.",
  aliases: ["levels", "dashboard", "top"],
  usage: "[limite]",
  guildOnly: true,
  async execute(msg, args) {
    if (!args.length) args = [10];
    const rawLeaderboard = await Levels.fetchLeaderboard(msg.guild.id, args[0]);

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
    const leaderboard = await Levels.computeLeaderboard(msg.client, rawLeaderboard, true);
    const lb = leaderboard.map(e => (
        `${e.position}. ${e.username}\n\t*\`Nivel\`*\`: ${e.level}\` | *\`EXP\`*\`: ${e.totalXP.toString()}\``
      ));
    msg.channel.send(`${lb.join("\n")}`);
  },
};
