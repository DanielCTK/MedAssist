const jwt = require('jsonwebtoken');

/**
 * Middleware để xác thực JWT (JSON Web Token).
 * Sẽ đọc token từ header 'Authorization'.
 */
const authenticateToken = (req, res, next) => {
    // Lấy header 'Authorization' (thường có dạng "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách lấy phần token

    if (token == null) {
        // 401 Unauthorized - Không cung cấp token
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    // Xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden - Token không hợp lệ (hết hạn, sai chữ ký, v.v.)
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        
        // Nếu token hợp lệ, lưu thông tin payload của user vào req
        // (Payload này được định nghĩa khi bạn tạo token lúc login)
        // Ví dụ: { id: user.id, email: user.email }
        req.user = user; 
        
        // Chuyển tiếp request đến middleware/controller tiếp theo
        next(); 
    });
};

module.exports = { authenticateToken };

