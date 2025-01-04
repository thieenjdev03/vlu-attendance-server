
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   microsoftId: { type: String, required: true, unique: true },
//   displayName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   accessToken: { type: String, required: true },
//   lastLogin: { type: Date, default: Date.now },
//   role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
//   status: { type: Number, default: 0 } // Thêm trường này
// });

// const User = mongoose.model('User', UserSchema);
// module.exports = User;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  microsoftId: { type: String},
  displayName: { type: String},
  email: { type: String, required: true, unique: true },
  accessToken: { type: String },
  lastLogin: { type: Date, default: null },
  role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
  status: { type: Number, default: 0 },
  phone: { type: String, default: null },
  personalEmail: { type: String, default: null }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;