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

// login
// router.post('/login', async function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username && password) {
//     const admin = await AdminDAO.selectByUsernameAndPassword(username,password);
//     if (admin) {
//       const token = JwtUtil.genToken();
//       res.json({ success: true, message: 'Authentication successful', token: token });
//     } else {
//       res.json({ success: false, message: 'Incorrect username or password' });
//     }
//   } else {
//     res.json({ success: false, message: 'Please input username and password' });
//   }
// });
// router.get('/token', JwtUtil.checkToken, function (req, res) {
//   const token = req.headers['x-access-token'] || req.headers['authorization'];
//   res.json({ success: true, message: 'Token is valid', token: token });
// });
//admin_user
// router.get('/users', JwtUtil.checkToken, async function (req, res) { 
//   const admins = await AdminDAO.selectAll(); 
//   res.json(admins);
// });
// router.post('/users', JwtUtil.checkToken, async function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   const cid = req.body.role;
//   const email = req.body.email;
//   const ten = req.body.ten;
//   const trangthai = req.body.trangthai;
//   const role = await RoleDAO.selectByID(cid);
//   const admin = { username: username, password: password, email: email, ten: ten, trangthai:trangthai, role: role };
//   const result = await AdminDAO.insert(admin);
//   res.json(result);
// });
// router.delete('/users/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const result = await AdminDAO.delete(_id);
//   res.json(result);
// });
// router.put('/users/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const username = req.body.username;
//   const password = req.body.password;
//   const cid = req.body.role;
//   const email = req.body.email;
//   const ten = req.body.ten;
//   const trangthai = req.body.trangthai;
//   const role = await RoleDAO.selectByID(cid);

//   const admin = { _id: _id,username: username, password: password, email: email, ten: ten, trangthai:trangthai, role: role };
//   const result = await AdminDAO.update(admin);
//   res.json(result);
// });
// router.get('/users/:id', async function (req, res) {
//   const _id = req.params.id;
//   const user = await AdminDAO.selectByID(_id);
//   res.json(user);
// });

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
    const { email } = req.body;
    const user = {
      microsoftId: uuidv4(),
      displayName: null,
      email,
      accessToken: null,
      lastLogin: null, // Sửa lỗi chính tả ở đây
      role: "675efcfcf5200355f4e3c04e",
      status: 0,
      phone: null,
      personalEmail: null

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
    const user = { _id: id, displayName,phone, personalEmail };
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

// category
// router.get('/categories', JwtUtil.checkToken, async function (req, res) {
//   const categories = await CategoryDAO.selectAll();
//   res.json(categories);
// });

// // category
// router.post('/categories', JwtUtil.checkToken, async function (req, res) {
//   const name = req.body.name;
//   const category = { name: name };
//   const result = await CategoryDAO.insert(category);
//   res.json(result);
// });
// // category
// router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const name = req.body.name;
//   const category = { _id: _id, name: name };
//   const result = await CategoryDAO.update(category);
//   res.json(result);
// });
// // category
// router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const result = await CategoryDAO.delete(_id);
//   res.json(result);
// });
// // product
// router.get('/products', JwtUtil.checkToken, async function (req, res) {
//   // get data
//   var products = await ProductDAO.selectAll();
//   // pagination
//   const sizePage = 4;
//   const noPages = Math.ceil(products.length / sizePage);
//   var curPage = 1;
//   if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
//   const offset = (curPage - 1) * sizePage;
//   products = products.slice(offset, offset + sizePage);
//   // return
//   const result = { products: products, noPages: noPages, curPage: curPage };
//   res.json(result);
// });
// // product
// router.post('/products', JwtUtil.checkToken, async function (req, res) {
//   const name = req.body.name;
//   const price = req.body.price;
//   const cid = req.body.category;
//   const image = req.body.image;
//   const now = new Date().getTime(); // milliseconds
//   const category = await CategoryDAO.selectByID(cid);
//   const product = { name: name, price: price, image: image, cdate: now, category: category };
//   const result = await ProductDAO.insert(product);
//   res.json(result);
// });
// // product
// router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const name = req.body.name;
//   const price = req.body.price;
//   const cid = req.body.category;
//   const image = req.body.image;
//   const now = new Date().getTime(); // milliseconds
//   const category = await CategoryDAO.selectByID(cid);
//   const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
//   const result = await ProductDAO.update(product);
//   res.json(result);
// });
// // product
// router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const result = await ProductDAO.delete(_id);
//   res.json(result);
// });
// // order
// router.get('/orders', JwtUtil.checkToken, async function (req, res) {
//   const orders = await OrderDAO.selectAll();
//   res.json(orders);
// });
// // order
// router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const newStatus = req.body.status;
//   const result = await OrderDAO.update(_id, newStatus);
//   res.json(result);
// });
// // order
// router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
//   const _cid = req.params.cid;
//   const orders = await OrderDAO.selectByCustID(_cid);
//   res.json(orders);
// });
// // customer
// router.get('/customers', JwtUtil.checkToken, async function (req, res) {
//   const customers = await CustomerDAO.selectAll();
//   res.json(customers);
// });
// // customer
// router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const token = req.body.token;
//   const result = await CustomerDAO.active(_id, token, 0);
//   res.json(result);
// });
// // customer
// router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
//   const _id = req.params.id;
//   const cust = await CustomerDAO.selectByID(_id);
//   if (cust) {
//     const send = await EmailUtil.send(cust.email, cust._id, cust.token);
//     if (send) {
//       res.json({ success: true, message: 'Please check email' });
//     } else {
//       res.json({ success: false, message: 'Email failure' });
//     }
//   } else {
//     res.json({ success: false, message: 'Not exists customer' });
//   }
// });
module.exports = router;