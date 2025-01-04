require('../utils/MongooseUtil');
const Models = require('./Models');

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async selectAll() { 
    const query = {}; 
    const admins = await Models.Admin.find(query).exec(); 
    return admins;
  },
  async insert(admin) {
      const mongoose = require('mongoose');
      admin._id = new mongoose.Types.ObjectId();
      const result = await Models.Admin.create(admin);
      return result;
    },
  async delete(_id) { 
        const result = await Models.Admin.findByIdAndRemove(_id); 
        return result;
    },
  async update(admin) {
        const newvalues = { username: admin.username, password: admin.password, email: admin.email, ten: admin.ten, trangthai: admin.trangthai,role: admin.role }
        const result = await Models.Admin.findByIdAndUpdate(admin._id, newvalues, { new: true });
        return result;
    },
    async selectByID(_id) {
            const admin = await Models.Admin.findById(_id).exec();
            return admin;
    },
};
module.exports = AdminDAO;