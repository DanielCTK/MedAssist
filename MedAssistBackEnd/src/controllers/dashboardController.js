// FILE: src/controllers/dashboardController.js
const { db } = require('../services/firebaseService');

exports.getDashboardStats = async (req, res) => {
    try {
        const doctorId = req.user.id; // Lấy ID từ token

        // --- QUERY FIRESTORE (Chạy song song) ---
        // Sử dụng .count() của Firestore để đếm số lượng document nhanh chóng
        const patientsQuery = db.collection('patients')
                                .where('doctorId', '==', doctorId)
                                .count()
                                .get();

        const diagnosisQuery = db.collection('diagnosis_records')
                                 .where('doctorId', '==', doctorId)
                                 .count()
                                 .get();
        
        const doctorQuery = db.collection('users').doc(doctorId).get();

        // Chờ tất cả kết quả trả về
        const [patientsSnap, diagnosisSnap, doctorDoc] = await Promise.all([
            patientsQuery,
            diagnosisQuery,
            doctorQuery
        ]);

        // --- TRÍCH XUẤT DỮ LIỆU ---
        const patientCount = patientsSnap.data().count;
        const diagnosisCount = diagnosisSnap.data().count;
        const doctorInfo = doctorDoc.exists ? doctorDoc.data() : { name: 'Bác sĩ', email: '', createdAt: new Date() };

        // --- LOGIC TÍNH TOÁN GIẢ LẬP (Giữ nguyên logic cũ của bạn) ---
        // Ví dụ: Coi 70% số ca là đã hoàn thành
        // const finishedP = Math.floor(patientCount * 0.7); // (Không dùng biến này thì có thể bỏ)
        
        // --- TRẢ VỀ JSON (Giữ nguyên cấu trúc để Frontend không lỗi) ---
        res.status(200).json({
            patientCount,
            diagnosisCount,
            chartData: {
                patients: [
                    { name: 'Tổng bệnh nhân', value: patientCount },
                    // Fake thêm dữ liệu để biểu đồ tròn trông đẹp hơn nếu count = 0
                    ...(patientCount === 0 ? [{ name: 'Chưa có dữ liệu', value: 1 }] : [])
                ],
                diagnoses: [
                    { name: 'Đã thực hiện', value: diagnosisCount },
                    // Fake số liệu "Chờ duyệt" bằng 10% số thật để biểu đồ sinh động
                    { name: 'Chờ xử lý', value: Math.floor(diagnosisCount * 0.1) } 
                ]
            },
            doctor: {
                name: doctorInfo.name || "Bác sĩ",
                email: doctorInfo.email,
                joinedDate: doctorInfo.createdAt
            }
        });

    } catch (error) {
        console.error("Lỗi Dashboard Stats:", error);
        res.status(500).json({ message: "Lỗi server khi tải thống kê." });
    }
};