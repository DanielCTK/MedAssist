const axios = require('axios');
const FormData = require('form-data');

const AI_CORE_URL = process.env.AI_CORE_URL || "http://127.0.0.1:8000/predict/dr";

// SỬA: Hàm nhận vào 'fileBuffer' thay vì 'filePath'
const diagnoseImage = async (fileBuffer, fileName) => {
    if (!AI_CORE_URL) throw new Error("AI_CORE_URL is missing.");

    try {
        const formData = new FormData();
        // Append buffer trực tiếp
        formData.append('file', fileBuffer, {
            filename: fileName,
            contentType: 'image/jpeg', // Giả định jpeg, hoặc lấy từ req.file.mimetype
        });

        const response = await axios.post(AI_CORE_URL, formData, {
            headers: { ...formData.getHeaders() },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000 // Giữ nguyên timeout 60s
        });

        return response.data; 

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error("❌ LỖI KẾT NỐI: Server Python chưa bật.");
        } else if (error.code === 'ECONNABORTED') {
            console.error("❌ LỖI TIMEOUT: AI xử lý quá lâu.");
        } else {
            console.error('AI Service Error:', error.message);
        }
        throw new Error('Không thể kết nối tới hệ thống AI.');
    }
};

module.exports = { diagnoseImage };