// File: src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Lấy token từ header: "Bearer <token>"
        const token = req.headers.authorization.split(" ")[1];
        
        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Lưu thông tin user vào request để dùng ở controller sau này
        req.user = { 
            id: decodedToken.id, 
            email: decodedToken.email 
        };
        
        next(); // Cho phép đi tiếp
    } catch (error) {
        res.status(401).json({ message: "Bạn chưa đăng nhập hoặc phiên đăng nhập hết hạn!" });
    }
};