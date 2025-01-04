const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tenrole: { type: String, required: true }
}, { versionKey: false });

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;