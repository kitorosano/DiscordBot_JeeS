const { MessageEmbed, Collection } = require('discord.js');
const mongoose = require('mongoose');
const poolsModel = require('../models/pools.model');
let { mongo } = require('../config');
const config = require('../config');

mongoose.connect(mongo, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  name: 'poolend',
  description: 'Cierra una encuesta y recuenta los resultados de los votos.',
  usages: ['<ID>'],
  aliases: ['encuestafin'],
  guildOnly: true,
  args: 1,
  async execute(msg, args, idMod) {
    const { guild, channel, client, author } = msg;
    const [poolId] = args;

    const pool = await poolsModel.findOne({
      guildID: guild.id,
      poolID: poolId,
      isOpen: true,
    });

    if (!pool) {
      return msg.reply('No se ha encontrado una encuesta abierta con ese identificador.');
    }

    const poolChannel = await client.channels.fetch(pool.channelID);
    const poolMessage = await poolChannel.messages.fetch(pool.messageID);

    if (poolMessage.author.id !== author.id && !idMod) {
      return msg.reply(
        'No puedes cerrar una encuesta que no sea tuya. Solo los moderadores pueden cerrar encuestas de otros.',
      );
    }

    await poolMessage.edit({
      embeds: [
        poolMessage.embeds[0].addField('Estado', 'Cerrada').setColor('#dc3545'),
      ],
    });

    const poolReactionsArray = poolMessage.reactions.cache.map((r) => r);

    const votes = poolReactionsArray
      .map((reaction, index) => ({
        emoji: reaction.emoji.name,
        count: reaction.count - 1,
        content: pool.options[index],
      }))
      .sort((a, b) => b.count - a.count);

    if (votes.length === 0) {
      msg.reply('No hay votos en esta encuesta.');
    } else if (votes[0].count !== votes[1].count) {
      const results = votes.map(
        (vote) => `${vote.emoji} ${vote.content} - **${vote.count}**`,
      );

      const winnerEmbed = new MessageEmbed()
        .setColor('#f0ad4e')
        .setTitle(`¡Encuesta Finalizada!`)
        .addFields(
          { name: 'Pregunta', value: pool.question },
          {
            name: 'Resultados',
            value: results.join('\n'),
          },
        )
        .setFooter({
          text: `ID de encuesta: ${pool.poolID}`,
        });

      await channel.send({ embeds: [winnerEmbed] });
      msg.delete();

      await poolMessage.edit({
        embeds: [
          poolMessage.embeds[0].addField(
            'Ganador',
            `${votes[0].emoji} ${votes[0].content}`,
          ),
        ],
      });
    } else {
      msg.reply('No hay un ganador claro en esta encuesta.');

      await poolMessage.edit({
        embeds: [
          poolMessage.embeds[0].addField(
            'Empate',
            `No hay un ganador claro en esta encuesta.`,
          ),
        ],
      });
    }

    await pool.updateOne({ isOpen: false });
  },
};
