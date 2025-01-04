const express = require('express');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
const { v4: uuidv4 } = require('uuid');

// utils
const EmailUtil = require('../utils/EmailUtil');
// daos
const RoleDAO = require('../models/RoleDAO');
const UserDAO = require('../models/UserDAO');
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
const AdminDAO = require('../models/AdminDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

router.get('/users', async (req, res) => {
  try {
    const users = await UserDAO.selectAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});
router.post('/users', async (req, res) => {
  try {
    const { email, displayName, phone, personalEmail } = req.body;
    const user = {
      microsoftId: uuidv4(),
      displayName,
      email,
      accessToken: null,
      lastLogin: null, // Sửa lỗi chính tả ở đây
      role: "675efcfcf5200355f4e3c04e",
      status: 0,
      phone,
      personalEmail,

    };
    const result = await UserDAO.insert(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting user', error });
  }
});
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    let updatedUser;

    if (role !== undefined) {
      // Tìm và cập nhật quyền của người dùng
      updatedUser = await UserDAO.updateRole(userId, role);
    }

    if (status !== undefined) {
      // Convert status to number
      const statusValue = status === 1 ? 1 : 0;
      // Tìm và cập nhật trạng thái của người dùng
      updatedUser = await UserDAO.updateStatus(userId, statusValue);
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});
router.get('/users/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserDAO.selectByID(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user by ID', error });
  }
});
router.put('/users/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName } = req.body;
    const { phone } = req.body;
    const { personalEmail } = req.body;
    const user = { _id: id, displayName, phone, personalEmail };
    const result = await UserDAO.update(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});


//role
router.get('/roles', async (req, res) => {
  try {
    const roles = await RoleDAO.selectAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles', error });
  }
});

// Thêm vai trò mới
router.post('/roles', async (req, res) => {
  try {
    const { tenrole } = req.body;
    const role = { tenrole };
    const result = await RoleDAO.insert(role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting role', error });
  }
});

// Cập nhật vai trò
router.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tenrole } = req.body;
    const role = { _id: id, tenrole };
    const result = await RoleDAO.update(role);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
});

// Lấy vai trò theo ID
router.get('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RoleDAO.selectByID(id);
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role by ID', error });
  }
});

// Xóa vai trò
router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RoleDAO.delete(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role', error });
  }
});

module.exports = router;