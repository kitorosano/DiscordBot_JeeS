const {
  MessageEmbed,
  MessageAttachment,
  MessageReaction,
} = require("discord.js");

const { containsEmojis } = require("../utils/index.js");

//TODO: AGREGAR LIMITE DE PERSONAS PARA UNIRSE A UN VIP
//TODO: AGREGAR A QUE ROLES MENCIONA EL BOT

module.exports = {
  name: "vip",
  description:
    "Inicializa un mensaje de evento en el grupo enviado. Los que reaccionen al mensajes obtendran el rol VIP",
  usages: ["<emoji> [nombre del evento]"],
  aliases: ["event", "evento"],
  guildOnly: true,
  modOnly: true,
  args: 1,
  async execute(msg, args, isMod) {
    const { guild, mentions, channel, client } = msg;
    const [emoji, ...razon] = args;

    if (!containsEmojis(emoji)) {
      return msg.reply("El emoji no es valido");
    }

    const roles = await guild.roles.fetch();
    const VPIrole = roles.find((role) => role.name === "VIP");

    const MsgVIP = new MessageEmbed()
      .setColor("BLACK")
      .setTitle(`¡:loudspeaker: ATENCION MIEMBROS:rotating_light: !`)
      .setDescription(
        `${razon}\nReacciona a este mensaje con un ${emoji} para poder particiar.`,
      )
      .setFooter({ text: `Este mensaje se eliminara en 5m.` });

    channel.send({ embeds: [MsgVIP] }).then(async (msg) => {
      await msg.react(`${emoji}`);

      msg.client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.message.channel.id !== channel.id) return;
        if (user.id === "776917497382436884") return;

        const member = await guild.members.fetch(user);
        member.roles.add(VPIrole);
      });
      msg.client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.message.channel.id !== channel.id) return;
        if (user.id === "776917497382436884") return;

        const member = await guild.members.fetch(user);
        member.roles.remove(VPIrole);
      });
      setTimeout(() => {
        msg.delete();
      }, 300000);
    });
  },
};
