const express = require('express');
const router = express.Router();
const path = require('path'); 

// Import Controller và Middlewares (Sử dụng path.join để đảm bảo an toàn)
const diagnosisController = require(path.join(__dirname, '..', 'controllers', 'diagnosisController'));
const { authenticateToken } = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));
const { uploadSingleImage } = require(path.join(__dirname, '..', 'middlewares', 'uploadMiddleware'));

// API: POST /api/diagnose/upload (Chẩn đoán mới)
// URL đầy đủ: http://localhost:5000/api/diagnose/upload
router.post(
    '/upload', 
    authenticateToken,          // 1. Yêu cầu xác thực
    uploadSingleImage,          // 2. Xử lý file ảnh 'fundusImage'
    diagnosisController.uploadAndDiagnose // 3. Chạy logic chẩn đoán
);

// API: GET /api/diagnose/history (Lấy lịch sử chẩn đoán)
// URL đầy đủ: http://localhost:5000/api/diagnose/history
router.get(
    '/history',
    authenticateToken, // Yêu cầu xác thực để biết lấy lịch sử của ai
    diagnosisController.getDiagnosisHistory // Chạy logic lấy lịch sử
);


module.exports = router;

