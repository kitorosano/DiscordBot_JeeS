import { ChatInputCommandInteraction, Client, Message } from "discord.js";

module.exports = {
  async CommandAdapter(command, client: Client, entry: ChatInputCommandInteraction | Message) {
    let isMod: boolean = false;
    if(entry instanceof Message) {
      isMod = entry.member!.roles.cache.some(
        (role) => role.name === 'Moderador' || role.name === 'Admin'
      );
    } else if (entry instanceof ChatInputCommandInteraction) {
      isMod = client.guilds.cache.get(entry.guildId!)!.members.cache.get(entry.user.id)!.roles.cache.some(
        (role) => role.name === 'Moderador' || role.name === 'Admin'
      );
    }
    if (command.modOnly && !isMod) {
      // MENSAJE PARA COMANDOS SOLO DE MODERADORES
      return channel.send(
        `:no_pedestrians: **${author.username}**, alto ahí pantalones cuadrados.`
      );
    }

    if (command.guildOnly && channel.type === 'DM')
      return channel.send('No puedo ejecutar eso por mensaje directo');

    if (command.args && command.args != args.length) {
      const replyMsg = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Comando incompleto...`);

      if (command.usages) {
        replyMsg.setDescription(
          `El uso correcto sería: \n${command.usages
            .map((usage) => `\`${prefix}${command.name} ${usage}\``)
            .join('\n')}`
        );
      }
      return channel.send({ embeds: [replyMsg] });
    }

    await command.execute(entry, args, isMod);
  }
}