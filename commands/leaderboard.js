const {MessageEmbed} = require('discord.js');
const Levels = require("discord-xp");
const { mongo } = require("../config");
Levels.setURL(mongo);

module.exports = {
  name: "leaderboard",
  description:
    "Muestra el top de nivel usuarios. Si no se proveen argumentos se hace un top 10.",
  aliases: ["levels", "dashboard", "top", "lb"],
  usage: "[limite]",
  guildOnly: true,
  async execute(msg, args) {
    const {channel, author, guild, client} = msg

    if (!args.length) args = [10];
    const rawLeaderboard = await Levels.fetchLeaderboard(guild.id, args[0]);

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
    const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard);

    const medals = [
      '🥇',
      '🥈',
      '🥉',
    ];

    const cadena = '. \s\s \s\s\s\s\s\s\s\s\s\s\s\s\s\s \s\s -';
    const MsgLeaderboard = new MessageEmbed() 
        .setColor('PURPLE')
        .setAuthor(`Posiciones en ${guild.name}`,guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/1.png')
        // .setDescription(`:reminder_ribbon: Tu Rango es \`#${leaderboard.find(user => user.username == author.username).position}\` en este servidor`)
        .addFields({
            name: '· Usuario',
            value: '\`\`\`\n' + leaderboard.map(user => `${user.position}. ${medals[user.position-1] || ''} ${user.username}`).join('\n') + '\`\`\`',
            inline: true
          },{
            name: '· Total de Puntos',
            value: '\`\`\`\n' + leaderboard.map(user => `✨ ${user.totalXP} EXP`).join('\n') + '\`\`\`',
            inline: true
          },{
            name: '. Prueba',
            value: cadena,
            inline: false
          })
        .addField('\u200B','\u200B') 
        .setFooter('Sistema de niveles del bot JeeS.', client.user.displayAvatarURL())

    // const MsgLeaderboard = new MessageEmbed() 
    //     .setColor('PURPLE')
    //     .setAuthor(`Posiciones en ${guild.name}`,guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/1.png')
    //     .setDescription('Sistema de niveles del bot JeeS.')
    //     .addFields({
    //       name: '· Usuario',
    //       value: '\u200B',
    //       inline: true
    //     },{
    //       name: '· Total de Puntos',
    //       value: '\u200B',
    //       inline: true
    //     })
    // const MsgPositions = '\`\`\`\n' + leaderboard.map(user => `${user.position}. ${medals[user.position-1] || ''} ${user.username}`).join('\n') + '\`\`\`'
    channel.send(MsgLeaderboard + '\n')
  },
};
