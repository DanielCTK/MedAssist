// 1. Tải biến môi trường (DATABASE_URL, JWT_SECRET, PORT, AI_CORE_URL)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import các file Routes (Sử dụng path.join để đảm bảo an toàn)
const authRoutes = require(path.join(__dirname, './src/routes/authRoutes'));
const diagnosisRoutes = require(path.join(__dirname, './src/routes/diagnosisRoutes'));

// Lấy cổng từ file .env, nếu không có thì mặc định là 5000
const PORT = process.env.PORT || 5000;

// Khởi tạo ứng dụng Express
const app = express();

// 2. Áp dụng Middlewares chung
app.use(cors()); // Cho phép Frontend (ReactJS) truy cập API
app.use(express.json()); // Cho phép Server xử lý dữ liệu JSON
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu form URL-encoded

// 3. Kết nối các Routes
// Gắn '/api/auth' cho authRoutes (ví dụ: /api/auth/login)
app.use('/api/auth', authRoutes);
// Gắn '/api/diagnose' cho diagnosisRoutes (ví dụ: /api/diagnose/upload)
app.use('/api/diagnose', diagnosisRoutes);

// Route mặc định (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'MedAssist AI Backend API is running successfully.',
        status: 'ok'
    });
});

// 4. Khởi động Server
app.listen(PORT, () => {
    console.log(`✅ Server Node.js running on http://localhost:${PORT}`);
    console.log("Waiting for requests...");
});

