const nodemailer = require('nodemailer');

// 1. CẤU HÌNH TRANSPORTER (DỊCH VỤ GỬI MAIL)
// Chúng ta sẽ dùng Gmail làm ví dụ.
// BẠN PHẢI THAY THẾ CÁC GIÁ TRỊ NÀY TRONG FILE .env
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true cho cổng 465, false cho các cổng khác
    auth: {
        user: process.env.EMAIL_USER, // Ví dụ: 'medassist.contact@gmail.com'
        pass: process.env.EMAIL_PASS, // Mật khẩu Ứng dụng (App Password) của Gmail
    },
});

/**
 * Hàm gửi email reset mật khẩu
 * @param {string} toEmail - Email của người nhận
 * @param {string} resetLink - Đường link reset (ví dụ: http://localhost:5173/reset-password/TOKEN_HERE)
 */
const sendPasswordResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
        from: '"MedAssist AI" <no-reply@medassist.com>', // Địa chỉ người gửi
        to: toEmail, // Địa chỉ người nhận
        subject: '[MedAssist AI] Yêu cầu Đặt lại Mật khẩu', // Tiêu đề
        
        // Nội dung Email (HTML)
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Bạn đã yêu cầu đặt lại mật khẩu cho MedAssist AI?</h2>
                <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu của bạn. Link này sẽ hết hạn sau 10 phút.</p>
                <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Đặt lại Mật khẩu
                </a>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                <hr>
                <p style="font-size: 0.9em; color: #777;">Link trực tiếp: <a href="${resetLink}">${resetLink}</a></p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email reset đã được gửi tới: ${toEmail}`);
        return true;
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        throw new Error('Không thể gửi email reset.');
    }
};

module.exports = { sendPasswordResetEmail };

    
