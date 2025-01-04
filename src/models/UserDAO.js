require('../utils/MongooseUtil');
const Users = require('./User');

const UserDAO = {

    async selectAll() {
        try {
          const users = await Users.find().exec();
          return users;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
      },
      async insert(user) {
        try {
          const mongoose = require('mongoose');
          user._id = new mongoose.Types.ObjectId();
          const result = await Users.create(user);
          return result;
        } catch (error) {
          console.error('Error inserting user:', error);
          throw error;
        }
      },
  async delete(_id) { 
        const result = await Users.User.findByIdAndRemove(_id); 
        return result;
    },



    async delete(_id) {
      try {
        const result = await Users.findByIdAndRemove(_id);
        return result;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
  
    async updateRole(userId, newRoleId) {
      try {
        const result = await Users.findByIdAndUpdate(userId, { role: newRoleId }, { new: true });
        return result;
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    async updateStatus(userId, newStatus) {
      try {
        console.log('userId:', userId);
        console.log('newStatus:', newStatus);
    
        if (!userId || (newStatus !== 1 && newStatus !== 0)) {
          throw new Error('Invalid input');
        }
    
        const statusValue = newStatus === 1 ? 1 : 0; // Convert status to number
        const result = await Users.findByIdAndUpdate(userId, { status: statusValue }, { new: true });
    
        if (!result) {
          throw new Error('User not found');
        }
    
        return result;
      } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
    },
    async selectByID(_id) {
      try {
        const user = await Users.findById(_id).exec();
        return user;
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
    },
    async update(user) {
          try {
            const newvalues = { displayName: user.displayName,phone: user.phone, personalEmail: user.personalEmail}
            const result = await Users.findByIdAndUpdate(user._id, newvalues, { new: true });
            return result;
          } catch (error) {
            console.error('Error updating role:', error);
            throw error;
          }
      },
    // async update(role) {
    //   try {
    //     const newValues = { tenrole: role.tenrole };
    //     const result = await Role.findByIdAndUpdate(role._id, newValues, { new: true });
    //     return result;
    //   } catch (error) {
    //     console.error('Error updating role:', error);
    //     throw error;
    //   }
    // },
    

};
module.exports = UserDAO;