// FILE: src/controllers/patientController.js
// VERSION: FIREBASE NO-SQL - ĐÃ REFACTOR

const { db } = require('../services/firebaseService');

/** 1. LẤY DANH SÁCH BỆNH NHÂN */
exports.getAllPatients = async (req, res) => {
    try {
        const doctorId = req.user.id;
        console.log(`Bác sĩ ID=${doctorId} đang lấy danh sách bệnh nhân từ Firestore.`);

        const snapshot = await db.collection('patients')
                                 .where('doctorId', '==', doctorId)
                                 .orderBy('createdAt', 'desc')
                                 .get();

        const patients = [];
        snapshot.forEach(doc => {
            patients.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json({ patients });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bệnh nhân:', error);
        // Nếu lỗi do thiếu Index trong Firestore, trả về mảng rỗng để không crash app
        return res.status(200).json({ patients: [] });
    }
};

/** 2. TẠO BỆNH NHÂN MỚI */
exports.createPatient = async (req, res) => {
    const { name, dob, diabetesType, gender, phone } = req.body;
    const doctorId = req.user.id;

    if (!name || !dob) {
        return res.status(400).json({ message: "Tên và ngày sinh là bắt buộc." });
    }

    try {
        const newPatientData = {
            name,
            dob, // Lưu dạng string YYYY-MM-DD
            diabetesType: diabetesType || 'Unknown',
            gender: gender || 'Unknown',
            phone: phone || '',
            doctorId: doctorId,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('patients').add(newPatientData);

        return res.status(201).json({ 
            message: "Tạo bệnh nhân thành công!",
            patient: { id: docRef.id, ...newPatientData }
        });
    } catch (error) {
        console.error('Lỗi khi tạo bệnh nhân:', error);
        return res.status(500).json({ message: 'Lỗi server khi tạo bệnh nhân.' });
    }
};

/** 3. LẤY CHI TIẾT BỆNH NHÂN */
exports.getPatientById = async (req, res) => {
    try {
        const patientId = req.params.id; // Firebase ID là chuỗi, KHÔNG dùng parseInt
        
        const docRef = db.collection('patients').doc(patientId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân." });
        }

        const patientData = doc.data();

        // Bảo mật: Kiểm tra xem bệnh nhân này có thuộc về bác sĩ đang gọi API không
        if (patientData.doctorId !== req.user.id) {
             return res.status(403).json({ message: "Bạn không có quyền truy cập bệnh nhân này." });
        }

        // Lấy thêm lịch sử khám bệnh (Diagnosis Records) của bệnh nhân này
        const historySnapshot = await db.collection('diagnosis_records')
                                        .where('patientId', '==', patientId)
                                        .orderBy('createdAt', 'desc')
                                        .get();
        
        const history = [];
        historySnapshot.forEach(h => history.push({ id: h.id, ...h.data() }));

        return res.status(200).json({ 
            patient: { id: doc.id, ...patientData, diagnosisRecords: history } 
        });

    } catch (error) {
        console.error(`Lỗi lấy chi tiết bệnh nhân:`, error);
        return res.status(500).json({ message: 'Lỗi server.' });
    }
};

/** 4. XÓA BỆNH NHÂN (VÀ XÓA LUÔN HỒ SƠ KHÁM) */
exports.deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const doctorId = req.user.id;

        const docRef = db.collection('patients').doc(patientId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Không tìm thấy bệnh nhân." });
        }

        if (doc.data().doctorId !== doctorId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bệnh nhân này." });
        }

        // --- Bắt đầu xóa ---
        const batch = db.batch();

        // 1. Xóa thông tin bệnh nhân
        batch.delete(docRef);

        // 2. Tìm và xóa tất cả hồ sơ khám bệnh (diagnosis_records) của bệnh nhân này
        const recordsSnapshot = await db.collection('diagnosis_records')
                                        .where('patientId', '==', patientId)
                                        .get();
        
        recordsSnapshot.forEach(record => {
            batch.delete(record.ref);
        });

        // Thực thi lệnh xóa hàng loạt
        await batch.commit();

        return res.status(200).json({ message: "Đã xóa bệnh nhân và toàn bộ hồ sơ liên quan." });

    } catch (error) {
        console.error('Lỗi khi xóa bệnh nhân:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa bệnh nhân.' });
    }
};