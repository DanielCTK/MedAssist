// services/aiService.js

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const AI_CORE_URL = process.env.AI_CORE_URL || "http://127.0.0.1:8000/predict/dr";

const diagnoseImage = async (filePath, fileName) => {
    if (!AI_CORE_URL) throw new Error("AI_CORE_URL is missing.");

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), {
            filename: fileName,
            contentType: 'image/jpeg', 
        });

        // Gọi sang Python Service
        const response = await axios.post(AI_CORE_URL, formData, {
            headers: { ...formData.getHeaders() },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            
            // --- SỬA TẠI ĐÂY: Tăng lên 60 giây ---
            timeout: 60000 
        });

        return response.data; 

    } catch (error) {
        // Log chi tiết lỗi để dễ debug
        if (error.code === 'ECONNREFUSED') {
            console.error("❌ LỖI KẾT NỐI: Server Python chưa bật hoặc sai cổng (Port).");
        } else if (error.code === 'ECONNABORTED') {
            console.error("❌ LỖI TIMEOUT: AI xử lý quá lâu, hãy tăng thêm timeout.");
        } else {
            console.error('AI Service Error Details:', error.message);
        }
        
        throw new Error('Không thể kết nối tới hệ thống AI hoặc ảnh không hợp lệ.');
    }
};

module.exports = { diagnoseImage };