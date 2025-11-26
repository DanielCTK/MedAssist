// FILE: src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Trỏ vào file Controller mới vừa viết ở trên
const patientController = require(path.join(__dirname, '..', 'controllers', 'patientController'));
const authMiddleware = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));

// Áp dụng middleware xác thực cho tất cả các routes bên dưới
router.use(authMiddleware);

// GET /api/patients - Lấy danh sách
router.get('/', patientController.getAllPatients);

// POST /api/patients - Tạo mới
router.post('/', patientController.createPatient);

// GET /api/patients/:id - Lấy chi tiết
router.get('/:id', patientController.getPatientById);

// DELETE /api/patients/:id - Xóa
router.delete('/:id', patientController.deletePatient);

module.exports = router;