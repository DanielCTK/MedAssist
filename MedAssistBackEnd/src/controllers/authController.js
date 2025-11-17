const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto'); // <-- THƯ VIỆN MỚI
const mailService = require(path.join(__dirname, '..', 'services', 'mailService')); // <-- SERVICE MỚI

// Sử dụng path.join để import service một cách an toàn
const dbService = require(path.join(__dirname, '..', 'services', 'dbService'));

// ==========================================================
// HÀM XÁC THỰC CƠ BẢN (Register / Login)
// ==========================================================

exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const existingUser = await dbService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await dbService.createUser(email, hashedPassword, name);
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.status(201).json({ 
            message: 'Registration successful.', 
            token, 
            user: { id: newUser.id, email: newUser.email, name: newUser.name }
        });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await dbService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.status(200).json({ 
            message: 'Login successful.', 
            token,
            user: { id: user.id, email: user.email, name: user.name } 
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};


// ==========================================================
// HÀM MỚI: QUÊN MẬT KHẨU (Forgot Password)
// ==========================================================

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await dbService.findUserByEmail(email);

        // 1. Nếu không tìm thấy user, vẫn báo thành công (để tránh rò rỉ thông tin user)
        if (!user) {
            return res.status(200).json({ message: 'If user exists, a reset link has been sent.' });
        }

        // 2. Tạo token reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // 3. Đặt thời gian hết hạn (10 phút)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        // 4. Lưu token và thời gian hết hạn vào Database
        await dbService.saveResetToken(email, resetToken, expiresAt);

        // 5. Tạo link reset (Frontend URL)
        // LƯU Ý: Phải thay thế URL này bằng URL Frontend thực tế của bạn (localhost:5173/reset-password/TOKEN)
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`; 

        // 6. Gửi Email (Dùng mailService)
        await mailService.sendPasswordResetEmail(email, resetLink);

        // 7. Trả về thông báo thành công
        res.status(200).json({ 
            message: 'Password reset link sent to email.',
            // Thêm token vào response (CHỈ DÙNG ĐỂ DEBUG, SẼ XÓA TRONG PRODUCTION)
            // debug_token: resetToken 
        });

    } catch (error) {
        console.error('Forgot Password Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error while sending reset email.' });
    }
};


// ==========================================================
// HÀM MỚI: ĐẶT LẠI MẬT KHẨU (Reset Password)
// ==========================================================

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Token and a password of at least 6 characters are required.' });
    }

    try {
        // 1. Tìm user bằng token (hàm này kiểm tra cả thời gian hết hạn)
        const user = await dbService.findUserByResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // 2. Mã hóa mật khẩu mới
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Cập nhật mật khẩu và xóa token reset khỏi DB
        await dbService.updatePassword(user.id, newHashedPassword);

        // 4. Trả về thành công
        res.status(200).json({ message: 'Password reset successful. You can now login.' });

    } catch (error) {
        console.error('Reset Password Error:', error.message);
        res.status(500).json({ message: 'Server error while resetting password.' });
    }
};
