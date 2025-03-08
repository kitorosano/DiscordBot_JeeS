const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "hacker",
  description: "Cambia el color del rol Hacker",
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const { guild } = msg;
    const roles = await guild.roles.fetch();
    const hackerRole = roles.find((role) => role.name === "Hacker");

    // SETS RANDOM HEX COLOR
    const randomHex = Math.floor(Math.random() * 16777215).toString(16);
    const randomColor = "#" + randomHex;
    hackerRole.setColor(randomColor);

    const MsgHacker = new MessageEmbed()
      .setColor(randomColor)
      .setFooter({
        text: "El color del rol Hacker ha cambiado",
        iconURL: this.getColorUrl(randomHex),
      });

    return msg.channel.send({
      embeds: [MsgHacker],
    });
  },
  getColorUrl: (color) => {
    const width = 100,
      height = 100;

    return `https://singlecolorimage.com/get/${color}/${width}x${height}`;
  },
};
