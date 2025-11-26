// FILE: src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Import Controller
const dashboardController = require(path.join(__dirname, '..', 'controllers', 'dashboardController'));

// Import Middleware (SỬA LẠI: bỏ dấu {} đi vì file middleware export trực tiếp hàm)
const authMiddleware = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));

// API: GET /api/dashboard
router.get('/', authMiddleware, dashboardController.getDashboardStats);

module.exports = router;