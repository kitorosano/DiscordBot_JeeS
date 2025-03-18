const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const poolsModel = require('../models/pools.model');
let { mongo } = require('../config');

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
  usages: ['<-p Pregunta> [-id ID] [-o Opcion] [-o Opcion] ... [-o Opcion]'],
  aliases: ['encuesta'],
  guildOnly: true,
  async execute(msg, args) {
    const { guild, channel } = msg;

    const questionIndex = args.findIndex((arg) => arg === '-p');
    const poolIDIndex = args.findIndex((arg) => arg === '-id');
    const firstAnswerIndex = args.findIndex((arg) => arg === '-o');
    
    // check if the poolID is already in use
    const poolIdExists = await poolsModel.findOne({
      guildID: guild.id,
      poolID: args[poolIDIndex + 1],
      isOpen: true,
    });

    if (poolIDIndex !== -1 && poolIdExists) {
      return msg.reply(
        'Ya existe una encuesta abierta con ese identificador. Por favor, elige otro.',
      );
    } else if (questionIndex === -1) {
      return msg.reply('Debes proporcionar una pregunta para la encuesta.');
    } else if (firstAnswerIndex === -1) {
      return msg.reply('Debes proporcionar al menos una opción para votar.');
    }

    

    const question = args.slice(questionIndex + 1, firstAnswerIndex).join(' ');

    const answers = [];
    let answerIndex = firstAnswerIndex;
    while (answerIndex !== -1) {
      const nextAnswerIndex = args.findIndex(
        (arg, index) => arg === '-o' && index > answerIndex,
      );

      answers.push(
        args
          .slice(
            answerIndex + 1,
            nextAnswerIndex !== -1 ? nextAnswerIndex : args.length,
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
    const poolID =
      poolIDIndex !== -1 ? args.slice(poolIDIndex + 1)[0] : newPoolID;

    const pollEmbed = new MessageEmbed()
      .setColor('BLACK')
      .setTitle(`¡:bar_chart: Es hora de una encuesta!`)
      .addFields(
        { name: 'Pregunta', value: question },
        { name: 'Opciones', value: answersWithEmojis.join('\n') },
      )
      .setFooter({
        text: `ID de encuesta: ${poolID}`,
      });

    const pollMessage = await channel.send({ embeds: [pollEmbed] });
    const newPool = new poolsModel({
      guildID: guild.id,
      channelID: channel.id,
      messageID: pollMessage.id,
      poolID,
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
