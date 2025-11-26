// File: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Đăng ký (POST)
router.post('/register', authController.register);

// 2. Đăng nhập (POST)
router.post('/login', authController.login);

// 3. Quên mật khẩu (POST)
router.post('/forgot-password', authController.forgotPassword);

// 4. Đặt lại mật khẩu (POST)
router.post('/reset-password', authController.resetPassword);

// LƯU Ý: Nếu dòng 18 cũ của bạn là router.get('/logout', ...) 
// hãy xóa nó đi vì trong controller chưa có hàm logout.

module.exports = router;