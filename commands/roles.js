// FINISHED

const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const rolesModel = require('../models/roles.model');
let { mongo } = require('../config');
const config = require('../config');

mongoose.connect(mongo, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  name: 'roles',
  description: 'Manejar informacion sobre los roles obtenibles del servidor.',
  usages: [''],
  modUsages: [
    'add <@rol> <meta>',
    'remove <@rol>',
    'update <@rol> <meta>',
    'clean',
  ],
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {
    const { member, guild, channel, client } = msg;
    let [action, _role, ..._howto] = args;

    const guildRoles = await guild.roles.fetch();

    if (action === 'add') {
      this.validateArgs(args);

      // msg.delete()
      const role = await guild.roles.fetch(this.parseRole2ID(_role));
      const howto = _howto.join(' ');
      const findedRole = await rolesModel.findOne({
        guildID: guild.id,
        roleID: role.id,
      });
      if (findedRole)
        return channel.send({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(
                `El rol **<@&${role.id}>** ya está configurado para obtenerse de la siguiente manera: \`${findedRole.goal}\`.\nSi quieres cambiarlo usa \`${config.prefix}roles update <@rol> <meta>\``,
              ),
          ],
        });

      const newRoleInfo = new rolesModel({
        guildID: guild.id,
        roleID: role.id,
        goal: howto,
      });
      await newRoleInfo
        .save()
        .catch((e) => console.log(`Failed to save role info: ${e}`));

      return channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#f0ad7a')
            .setDescription(
              `El rol **<@&${role.id}>** se configuro para obtenerse de la siguiente manera: \`${howto}\``,
            ),
        ],
      });
    }
    if (action === 'remove') {
      this.validateArgs(args);

      // msg.delete()
      const role = await guild.roles.fetch(this.parseRole2ID(_role));
      const howto = _howto.join(' ');
      const findedRole = await rolesModel.findOne({
        roleID: role.id,
        guildID: guild.id,
      });
      if (!findedRole) return false;

      await rolesModel
        .findOneAndDelete({ roleID: role.id, guildID: guild.id })
        .catch((e) => console.log(`Failed to delete role info: ${e}`));

      const MsgRemoved = new MessageEmbed()
        .setColor('#f0ad7a')
        .setDescription(
          `La informacion del rol **<@&${role.id}>** fue eliminada.`,
        );
      return channel.send({ embeds: [MsgRemoved] });
    }
    if (action === 'update') {
      this.validateArgs(args);

      // msg.delete();
      const role = await guild.roles.fetch(this.parseRole2ID(_role));
      const howto = _howto.join(' ');
      const findedRole = await rolesModel.findOne({
        roleID: role.id,
        guildID: guild.id,
      });
      if (!findedRole) return false;

      await rolesModel
        .findOneAndUpdate(
          { roleID: role.id, guildID: guild.id },
          { goal: howto },
        )
        .catch((e) => console.log(`Failed to update role_ ${e}`));

      const MsgUpdated = new MessageEmbed()
        .setColor('#f0ad7a')
        .setDescription(
          `El rol **<@&${role.id}>** se configuro para obtenerse de la siguiente manera: \`${howto}\``,
        );
      return channel.send({ embeds: [MsgUpdated] });
    }
    if (action === 'clean') {
      const configuredRoles = await rolesModel.find({ guildID: guild.id });
      if (!configuredRoles) return false;

      for (const role of configuredRoles) {
        if (!guildRoles.get(role.roleID)) {
          await rolesModel
            .findOneAndDelete({ roleID: role.roleID, guildID: guild.id })
            .catch((e) => console.log(`Failed to delete role info: ${e}`));
        }
      }

      const MsgDeleted = new MessageEmbed()
        .setColor('#f0ad7a')
        .setDescription(
          `Se ha limpiado la informacion de los roles configurables.`,
        );

      return channel.send({
        embeds: [MsgDeleted],
      });
    }

    // obtener todos los roles configurados
    const configuredRoles = await rolesModel.find({ guildID: guild.id });
    if (!configuredRoles) return false;

    const sorteableRoles = await configuredRoles.map(({ roleID, goal }) => {
      return {
        roleID,
        goal,
        rawPosition: guildRoles.get(roleID)?.rawPosition,
      };
    });

    const MsgRoles = new MessageEmbed()
      .setColor('#f0ad7a')
      .setTitle(':reminder_ribbon: Roles obtenibles:')
      .setDescription(
        sorteableRoles
          .sort((a, b) => {
            if (a.rawPosition < b.rawPosition) return 1;
            if (a.rawPosition > b.rawPosition) return -1;
            return 0;
          })
          .map(({ roleID, goal }) => `**<@&${roleID}>**: \`${goal}\``)
          .join('\n'),
      )
      .setFooter({
        text: 'Informacion de roles en JeeS.',
        iconURL: client.user.displayAvatarURL(),
      });

    return channel.send({ embeds: [MsgRoles] });
  },
  parseRole2ID(role) {
    if (role.startsWith('<@&')) {
      return role.slice(3, -1);
    } else {
      return role;
    }
  },
  validateArgs(args) {
    // Comprobar que el uso del rol de moderacion es correcto
    if (args.length !== 0 && args.length < 3) {
      const replyMsg = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Comando incompleto...`)
        .setDescription(
          `El uso correcto sería: \n\`${config.prefix}${
            this.name
          } ${this.modUsages.filter(
            (usage) => usage.split(' ')[0] === action,
          )}\``,
        );

      return channel.send({ embeds: [replyMsg] });
    }
  },
};
