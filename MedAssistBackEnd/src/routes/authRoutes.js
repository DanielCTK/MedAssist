const express = require('express');
const router = express.Router();
const path = require('path'); 

// Import Controller 
const authController = require(path.join(__dirname, '..', 'controllers', 'authController'));

// Route: POST /api/auth/register (Đăng ký)
router.post('/register', authController.register);

// Route: POST /api/auth/login (Đăng nhập)
router.post('/login', authController.login);

// === 2 ROUTES MỚI CHO QUÊN MẬT KHẨU ===

// Route: POST /api/auth/forgot-password (Yêu cầu gửi email reset)
router.post('/forgot-password', authController.forgotPassword);

// Route: POST /api/auth/reset-password (Đặt lại mật khẩu)
router.post('/reset-password', authController.resetPassword);

module.exports = router;
