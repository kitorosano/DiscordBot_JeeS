const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pool",
  description:
    "Abre una encuesta con posibles reacciones para que los miembros puedan votar.",
  usages: ["<-p Pregunta> [-o Opcion 1] [-o Opcion 2] ... [-o Opcion n]"],
  aliases: ["encuesta"],
  guildOnly: true,
  async execute(msg, args) {
    const { guild, channel, client, author } = msg;

    const questionIndex = args.findIndex((arg) => arg === "-p");
    const firstAnswerIndex = args.findIndex((arg) => arg === "-o");

    if (questionIndex === -1) {
      return msg.reply("Debes proporcionar una pregunta para la encuesta.");
    } else if (firstAnswerIndex === -1) {
      return msg.reply("Debes proporcionar al menos una opción para votar.");
    }

    const question = args.slice(questionIndex + 1, firstAnswerIndex).join(" ");

    const answers = [];
    let answerIndex = firstAnswerIndex;
    while (answerIndex !== -1) {
      const nextAnswerIndex = args.findIndex(
        (arg, i) => i > answerIndex && arg === "-o",
      );
      answers.push(
        args
          .slice(
            answerIndex + 1,
            nextAnswerIndex > -1 ? nextAnswerIndex : undefined,
          )
          .join(" "),
      );
      answerIndex = nextAnswerIndex;
    }

    if (answers.length < 2) {
      return msg.reply("Debes proporcionar al menos dos opciones para votar.");
    } else if (answers.length > 6) {
      return msg.reply("Solo puedes proporcionar hasta 6 opciones para votar.");
    }

    const emojis = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫"];
    const emojisAnswers = answers.slice(0, emojis.length);
    const answersWithEmojis = emojisAnswers.map((answer, index) => {
      return `${emojis[index]} ${answer}`;
    });

    const pollEmbed = new MessageEmbed()
      .setColor("BLACK")
      .setTitle(`¡:bar_chart: Es hora de una encuesta!`)
      .addFields(
        { name: "Pregunta", value: question },
        { name: "Opciones", value: answersWithEmojis.join("\n") },
      )
      .setFooter({
        text: "Reacciona con el emoji de la opción que prefieras.",
      });

    const pollMessage = await channel.send({ embeds: [pollEmbed] });

    emojisAnswers.forEach((_, index) => {
      pollMessage.react(emojis[index]);
    });

    // const filter = (reaction, user) => {
    //   return emojis.includes(reaction.emoji.name) && !user.bot;
    // };

    // const collector = pollMessage.createReactionCollector({
    //   filter,
    //   dispose: true,
    // });

    // collector.on("collect", (reaction, user) => {
    //   const { emoji } = reaction;
    //   const index = emojis.indexOf(emoji.name);
    //   const answer = answers[index];

    //   console.log(`User: ${user.tag} reacted with: ${emoji.name} - ${answer}`);
    // });

    // collector.on("remove", (reaction, user) => {
    //   const { emoji } = reaction;
    //   const index = emojis.indexOf(emoji.name);
    //   const answer = answers[index];

    //   console.log(
    //     `User: ${user.tag} removed reaction: ${emoji.name} - ${answer}`,
    //   );
    // });

    // collector.on("end", (collected, reason) => {
    //   console.log(`Poll ended: ${reason}`);
    // });

    return pollMessage;
  },
};
