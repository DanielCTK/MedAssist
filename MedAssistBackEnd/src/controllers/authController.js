// File: src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const crypto = require('crypto');
const { db } = require('../services/firebaseService'); 

// Mock mailService đơn giản để tránh lỗi nếu bạn chưa có file mailService
const mailService = {
    sendPasswordResetEmail: async (email, link) => {
        console.log(`[MOCK EMAIL] Gửi link reset tới ${email}: ${link}`);
        return true;
    }
};
// Nếu bạn đã có file mailService thật thì bỏ comment dòng dưới:
// const mailService = require('../services/mailService');

// --- 1. ĐĂNG KÝ ---
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Thiếu thông tin.' });
    
    try {
        const userRef = db.collection('users');
        const snapshot = await userRef.where('email', '==', email).get();

        if (!snapshot.empty) return res.status(409).json({ message: 'Email đã tồn tại.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const docRef = await userRef.add({
            email, password: hashedPassword, name, role: 'doctor', createdAt: new Date().toISOString()
        });

        const token = jwt.sign({ id: docRef.id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'Đăng ký thành công.', token, user: { id: docRef.id, email, name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- 2. ĐĂNG NHẬP ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });

        const doc = snapshot.docs[0];
        const user = doc.data();
        if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });
        
        const token = jwt.sign({ id: doc.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Đăng nhập thành công.', token, user: { id: doc.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- 3. QUÊN MẬT KHẨU (Hàm bị thiếu gây lỗi) ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email là bắt buộc.' });

    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) return res.status(200).json({ message: 'Link reset đã gửi (nếu email tồn tại).' });

        const doc = snapshot.docs[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 10 * 60 * 1000;

        await db.collection('users').doc(doc.id).update({ resetToken, resetTokenExpiresAt: expiresAt });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        await mailService.sendPasswordResetEmail(email, resetLink);

        res.status(200).json({ message: 'Link reset mật khẩu đã được gửi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// --- 4. RESET PASSWORD (Hàm bị thiếu gây lỗi) ---
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin.' });

    try {
        const snapshot = await db.collection('users').where('resetToken', '==', token).get();
        if (snapshot.empty) return res.status(400).json({ message: 'Token lỗi.' });

        const doc = snapshot.docs[0];
        if (doc.data().resetTokenExpiresAt < Date.now()) return res.status(400).json({ message: 'Token hết hạn.' });

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection('users').doc(doc.id).update({ password: newHashedPassword, resetToken: null, resetTokenExpiresAt: null });

        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};