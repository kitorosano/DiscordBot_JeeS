const {MessageEmbed, MessageAttachment, ClientVoiceManager} = require('discord.js');
const ms = require('ms');

module.exports = {
	name: 'tempmute',
  description: 'Mutea a un miembro del servidor en todos los canales de texto.',
  usage: '<usuario> <duracion (1h, 2m, 10s)> [razon]',
  guildOnly: true,
  modOnly: true,
  args: true,
  async execute(msg, args, isMod) {
    const [who, time,...why] = args;
    const {guild, mentions,channel} = msg;

    if (!who) {
      const MsgNoMiembro = new MessageEmbed()
        .setColor("RED")
        .setAuthor('Asegurate de mencionar al un miembro para silenciar.')
      return channel.send(MsgNoMiembro)
		} else if(!isNaN(time)) {
      const MsgMalTiempo = new MessageEmbed()
        .setColor("ORANGE")
        .setAuthor('Asegurate de ingresar una duracion adecuada. Ej: 1h, 2m, 10s')
      return channel.send(MsgMalTiempo)
    }
    const razon = why.length > 0 ? why.join(' ') : 'Sin especificar';
    const target = mentions.users.first();

    const roles = await guild.roles.fetch();
    const mutedRole = roles.cache.find(role => role.name === 'Silenciado');
    const memberTarget = await guild.members.fetch(target.id);
    memberTarget.roles.add(mutedRole); //AGREGA EL ROL
    const {tag} = memberTarget.user

    const exampleEmbed = new MessageEmbed()
          .setColor("#323232")
          .setAuthor(`${tag} ha sido silenciad@ durante ${ms(ms(time))}`, memberTarget.user.displayAvatarURL({ format: "png", dynamic: true }))
          .setDescription(`**Razón**: ${razon}`)
          .setFooter(`Para desmutearlo enseguida usa: ¡unmute <usuario>`)
    channel.send(exampleEmbed)
    
    setTimeout(() => {
      memberTarget.roles.remove(mutedRole); //QUITA EL ROL
      const MsgDesmuteado = new MessageEmbed()
            .setColor("#424242")
            .setAuthor(`${tag} ya no está silenciad@`, memberTarget.user.displayAvatarURL({ format: "png", dynamic: true }))
      return msg.channel.send(MsgDesmuteado)
    }, ms(time));

  },
};