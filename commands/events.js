//COMANDO QUE LISTA LOS EVENTOS DEL DIA,

//MAYBE HERE COMBINE CREATE EVENT FOR BDAY OF CHURCH ACTIVITY

//Configure main channel to send messages 
module.exports = {
  disable: true,
	name: 'events',
  description: '',
  aliases: ['today'],
  modUsage: '[add/remove/update]',
  guildOnly: true,
  async execute(msg, args, isMod) {
    const {member, author,guild, mentions, channel} = msg;
    let [action] = args;


  },
};