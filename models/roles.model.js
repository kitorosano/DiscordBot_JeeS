const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
	guildID: { type: String },
	roleID: { type: String },
	goal: { type: String },
});

module.exports = mongoose.model('Roles', rolesSchema);
