const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Định nghĩa thư mục lưu trữ file tạm
const uploadDir = 'uploads/';

// Đảm bảo thư mục 'uploads' tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Thiết lập nơi lưu trữ tạm thời cho file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu file tạm thời vào thư mục 'uploads'
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // Đảm bảo tên file là duy nhất để tránh ghi đè
        const ext = path.extname(file.originalname);
        cb(null, `scan-${Date.now()}${ext}`);
    }
});

// Middleware chính cho việc tải file ảnh
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận các định dạng ảnh phổ biến cho ảnh đáy mắt
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
            // Báo lỗi nếu định dạng file không đúng
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Xuất ra Middleware đã được gọi sẵn (để tiện lợi)
// Nó sẽ tìm file có tên 'fundusImage' trong request form-data
exports.uploadSingleImage = upload.single('fundusImage');

