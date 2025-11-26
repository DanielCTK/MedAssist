const multer = require('multer');

// KHÔNG CẦN check folder 'uploads/' nữa vì chúng ta lưu lên mây.

// Thiết lập lưu trữ tạm thời trong RAM (Buffer)
const storage = multer.memoryStorage();

// Middleware chính
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giữ nguyên giới hạn 10MB
    fileFilter: (req, file, cb) => {
        // Giữ nguyên logic kiểm tra đuôi file
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Xuất ra Middleware
exports.uploadSingleImage = upload.single('fundusImage');