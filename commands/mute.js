const {MessageEmbed, MessageAttachment} = require('discord.js');

module.exports = {
	name: 'mute',
  description: 'Mutea a un miembro del servidor en todos los canales de texto.',
  usage: '<usuario> [razón]',
  guildOnly: true,
  modOnly: true,
  args: true,
  async execute(msg, args, isMod) {
    const {guild, mentions, channel} = msg;
    const [who, ...why] = args;
    
    const razon = why.length > 0 ? why.join(' ') : 'Sin especificar';
    const target = mentions.users.first();
    if(!target) return channel.send({embeds: [new MessageEmbed().setColor("RED").setAuthor(`Miembro no encontrado`)]})

    const roles = await guild.roles.fetch();
    const mutedRole = roles.find(role => role.name === 'Silenciado');
    const memberTarget = await guild.members.fetch(target.id);

    if(memberTarget.roles.cache.find(role => role !== mutedRole)) {
      memberTarget.roles.add(mutedRole); //AGREGA EL ROL
      const {tag} = memberTarget.user

      const exampleEmbed = new MessageEmbed()
            .setColor("#323232")
            .setAuthor(`${tag} ha sido silenciad@`, memberTarget.user.displayAvatarURL({ format: "png", dynamic: true }))
            .setDescription(`**Razón**: ${razon}`)
            .setFooter(`Para desmutearlo utiliza: ¡unmute <usuario>`)
      return msg.channel.send({embeds: [exampleEmbed]})
    } else {
      const MsgNoSePuede = new MessageEmbed()
            .setColor("ORANGE")
            .setAuthor('No puedes mutear a alguien que ya está silenciado.')
      return channel.send({embeds: [MsgNoSePuede]})
    }
  },
};