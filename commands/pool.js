const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const poolsModel = require('../models/pools.model');
let { mongo } = require('../config');
const config = require('../config');

mongoose.connect(mongo, {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const alphabetEmojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫'];

module.exports = {
  name: 'pool',
  description:
    'Abre una encuesta con posibles reacciones para que los miembros puedan votar.',
  usages: ['<-p Pregunta> [-o Opcion 1] [-o Opcion 2] ... [-o Opcion n]'],
  aliases: ['encuesta'],
  guildOnly: true,
  async execute(msg, args) {
    const { guild, channel, client, author } = msg;

    const questionIndex = args.findIndex((arg) => arg === '-p');
    const firstAnswerIndex = args.findIndex((arg) => arg === '-o');

    if (questionIndex === -1) {
      return msg.reply('Debes proporcionar una pregunta para la encuesta.');
    } else if (firstAnswerIndex === -1) {
      return msg.reply('Debes proporcionar al menos una opción para votar.');
    }

    const question = args.slice(questionIndex + 1, firstAnswerIndex).join(' ');

    const answers = [];
    let answerIndex = firstAnswerIndex;
    while (answerIndex !== -1) {
      const nextAnswerIndex = args.findIndex(
        (arg, i) => i > answerIndex && arg === '-o',
      );
      answers.push(
        args
          .slice(
            answerIndex + 1,
            nextAnswerIndex > -1 ? nextAnswerIndex : undefined,
          )
          .join(' '),
      );
      answerIndex = nextAnswerIndex;
    }

    if (answers.length < 2) {
      return msg.reply('Debes proporcionar al menos dos opciones para votar.');
    } else if (answers.length > 6) {
      return msg.reply('Solo puedes proporcionar hasta 6 opciones para votar.');
    }

    msg.delete();

    const emojisAnswers = answers.slice(0, alphabetEmojis.length);
    const answersWithEmojis = emojisAnswers.map((answer, index) => {
      return `${alphabetEmojis[index]} ${answer}`;
    });

    const newPoolID = Math.random().toString(36).substring(2, 8);

    const pollEmbed = new MessageEmbed()
      .setColor('BLACK')
      .setTitle(`¡:bar_chart: Es hora de una encuesta!`)
      .addFields(
        { name: 'Pregunta', value: question },
        { name: 'Opciones', value: answersWithEmojis.join('\n') },
      )
      .setFooter({
        text: `ID de encuesta: ${newPoolID}`,
      });

    const pollMessage = await channel.send({ embeds: [pollEmbed] });
    const newPool = new poolsModel({
      guildID: guild.id,
      channelID: channel.id,
      messageID: pollMessage.id,
      poolID: newPoolID,
      question,
      options: emojisAnswers,
    });
    await newPool
      .save()
      .catch((e) => console.log(`Failed to save pool info: ${e}`));

    emojisAnswers.forEach((_, index) => {
      pollMessage.react(alphabetEmojis[index]);
    });

    return pollMessage;
  },
};
