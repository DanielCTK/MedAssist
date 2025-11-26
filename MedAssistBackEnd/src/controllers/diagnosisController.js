// FILE: src/controllers/diagnosisController.js
// VERSION: NO-UPLOAD (Chắc chắn không lỗi Storage)

const { db } = require('../services/firebaseService');

// Bảng ánh xạ kết quả
const DR_LABELS = {
    0: { label: "Không có bệnh (No DR)", severity: "Bình thường", advice: "Tái khám định kỳ 1 năm/lần." },
    1: { label: "Nhẹ (Mild)", severity: "Cảnh báo", advice: "Kiểm soát đường huyết, tái khám 6-12 tháng." },
    2: { label: "Trung bình (Moderate)", severity: "Nguy cơ", advice: "Cần bác sĩ chuyên khoa mắt khám kỹ, tái khám 3-6 tháng." },
    3: { label: "Nặng (Severe)", severity: "Nghiêm trọng", advice: "Điều trị laser hoặc tiêm nội nhãn ngay. Tái khám theo chỉ định." },
    4: { label: "Tăng sinh (Proliferative DR)", severity: "Rất nghiêm trọng", advice: "Phẫu thuật hoặc can thiệp khẩn cấp để tránh mù lòa." }
};

// ===================================================================
// 1. LOGIC CHẨN ĐOÁN (MOCK UP - GIẢ LẬP ĐỂ TEST)
// ===================================================================

exports.uploadAndDiagnose = async (req, res) => {
    // 1. KIỂM TRA ĐẦU VÀO
    if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn file ảnh!' });
    }
    
    // Lấy patientId từ form-data
    const patientId = req.body.patientId || "unknown";
    
    try {
        const doctorId = req.user.id;
        console.log(`Bác sĩ ${doctorId} đang chẩn đoán (Không upload)...`);

        // 2. DÙNG LINK ẢNH GIẢ (QUAN TRỌNG: Để không kích hoạt Storage)
        const firebaseImageUrl = "https://placehold.co/600x400?text=Scan+Image+No+Storage";

        // 3. GIẢ LẬP KẾT QUẢ AI
        // Logic: Lấy độ dài tên file chia dư cho 5 để ra mã bệnh (0-4)
        const fileName = req.file.originalname || "image.jpg";
        const diagnosisCode = fileName.length % 5; 
        
        const diagnosisInfo = DR_LABELS[diagnosisCode];

        const finalDiagnosisObject = {
            code: diagnosisCode,
            label: diagnosisInfo.label,
            severity: diagnosisInfo.severity,
            advice: diagnosisInfo.advice,
            confidence: '89.5%'
        };

        // 4. TRẢ VỀ KẾT QUẢ NGAY
        return res.status(200).json({
            message: 'Chẩn đoán thành công (Chế độ No-Storage).',
            data: {
                patientId: patientId,
                diagnosis: finalDiagnosisObject,
                scanImageUrl: firebaseImageUrl
            }
        });

    } catch (error) {
        console.error('Lỗi chẩn đoán:', error);
        return res.status(500).json({ message: error.message || 'Lỗi hệ thống.' });
    }
};

// ===================================================================
// 2. LƯU LỊCH SỬ
// ===================================================================

exports.saveRecordToHistory = async (req, res) => {
    const doctorId = req.user.id;
    const { patientId, hba1cValue, scanImageUrl, diagnosisResult } = req.body;

    if (!patientId || !diagnosisResult) {
        return res.status(400).json({ message: 'Thiếu dữ liệu.' });
    }

    try {
        const recordData = {
            doctorId: doctorId,
            patientId: patientId.toString(),
            hba1cValue: parseFloat(hba1cValue) || null,
            aiResultCode: diagnosisResult.code,
            aiResultLabel: diagnosisResult.label,
            aiConfidence: diagnosisResult.confidence,
            scanImageUrl: scanImageUrl || "https://placehold.co/600x400?text=No+Image",
            createdAt: new Date().toISOString()
        };

        // Lưu vào Firestore (Cái này miễn phí, không lỗi)
        const docRef = await db.collection('diagnosis_records').add(recordData);

        res.status(201).json({ 
            message: 'Đã lưu hồ sơ thành công!',
            record: { id: docRef.id, ...recordData }
        });

    } catch (error) {
        console.error('Lỗi lưu hồ sơ:', error);
        res.status(500).json({ message: 'Lỗi server khi lưu hồ sơ.' });
    }
};

exports.getDiagnosisHistory = async (req, res) => {
    const doctorId = req.user.id;
    try {
        const snapshot = await db.collection('diagnosis_records')
                                 .where('doctorId', '==', doctorId)
                                 .orderBy('createdAt', 'desc')
                                 .get();
        
        const history = [];
        snapshot.forEach(doc => history.push({ id: doc.id, ...doc.data() }));

        res.status(200).json({ count: history.length, history });
    } catch (error) {
        console.error('Lỗi lấy lịch sử:', error);
        res.status(500).json({ message: 'Lỗi hệ thống.' });
    }
};