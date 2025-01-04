require('../utils/MongooseUtil');
const Role = require('./Role'); // Import mô hình Role

const RoleDAO = {
  async selectAll() {
    try {
      const roles = await Role.find().exec();
      return roles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async insert(role) {
    try {
      const mongoose = require('mongoose');
      role._id = new mongoose.Types.ObjectId();
      const result = await Role.create(role);
      return result;
    } catch (error) {
      console.error('Error inserting role:', error);
      throw error;
    }
  },

  async update(role) {
    try {
      const newValues = { tenrole: role.tenrole };
      const result = await Role.findByIdAndUpdate(role._id, newValues, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  async delete(_id) {
    try {
      const result = await Role.findByIdAndRemove(_id);
      return result;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  async selectByID(_id) {
    try {
      const role = await Role.findById(_id).exec();
      return role;
    } catch (error) {
      console.error('Error fetching role by ID:', error);
      throw error;
    }
  },
};

module.exports = RoleDAO;