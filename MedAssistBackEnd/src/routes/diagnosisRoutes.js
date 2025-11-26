// FILE: src/routes/diagnosisRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');

// Import Controller & Middleware
const diagnosisController = require(path.join(__dirname, '..', 'controllers', 'diagnosisController'));
const authMiddleware = require(path.join(__dirname, '..', 'middlewares', 'authMiddleware'));
const uploadMiddleware = require(path.join(__dirname, '..', 'middlewares', 'uploadMiddleware'));

// --- KIỂM TRA AN TOÀN (DEBUG) ---
// Nếu uploadMiddleware.uploadSingleImage bị lỗi undefined, server sẽ crash ngay tại đây
if (!uploadMiddleware.uploadSingleImage) {
    console.error("❌ LỖI: uploadMiddleware.uploadSingleImage không tồn tại. Kiểm tra lại file uploadMiddleware.js");
}

// ==================================================================
// ĐỊNH NGHĨA ROUTES (Chỉ liên quan đến chẩn đoán AI)
// ==================================================================

// 1. Upload ảnh và nhận chẩn đoán AI
// POST /api/diagnose/predict
router.post('/upload', 
    authMiddleware, 
    uploadMiddleware.uploadSingleImage, // Middleware xử lý file ảnh
    diagnosisController.uploadAndDiagnose // Controller xử lý logic
);

// 2. Lưu kết quả vào lịch sử (sau khi bác sĩ xác nhận)
// POST /api/diagnose/save-record
router.post('/save-history', 
    authMiddleware, 
    diagnosisController.saveRecordToHistory
);

// 3. Lấy lịch sử chẩn đoán của bác sĩ
// GET /api/diagnose/history
router.get('/history', 
    authMiddleware, 
    diagnosisController.getDiagnosisHistory
);

// --- QUAN TRỌNG: ĐÃ XÓA CÁC ROUTE BỆNH NHÂN (PATIENTS) Ở ĐÂY ---
// Vì chúng ta đã chuyển chúng sang file patientRoutes.js rồi.

module.exports = router;