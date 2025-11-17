const fs = require('fs/promises');
const path = require('path');

const aiService = require(path.join(__dirname, '..', 'services', 'aiService'));
const dbService = require(path.join(__dirname, '..', 'services', 'dbService'));

// --- BẢNG ÁNH XẠ KẾT QUẢ CHẨN ĐOÁN (0-4) ---
// Dùng để chuyển đổi mã số từ AI thành văn bản tiếng Việt hiển thị cho App
const DR_LABELS = {
    0: { label: "Không có bệnh (No DR)", severity: "Bình thường", advice: "Tái khám định kỳ 1 năm/lần." },
    1: { label: "Nhẹ (Mild)", severity: "Cảnh báo", advice: "Kiểm soát đường huyết, tái khám 6-12 tháng." },
    2: { label: "Trung bình (Moderate)", severity: "Nguy cơ", advice: "Cần bác sĩ chuyên khoa mắt khám kỹ, tái khám 3-6 tháng." },
    3: { label: "Nặng (Severe)", severity: "Nghiêm trọng", advice: "Điều trị laser hoặc tiêm nội nhãn ngay. Tái khám theo chỉ định." },
    4: { label: "Tăng sinh (Proliferative DR)", severity: "Rất nghiêm trọng", advice: "Phẫu thuật hoặc can thiệp khẩn cấp để tránh mù lòa." }
};

// -------------------------------------------------------------------
// HÀM 1: UPLOAD VÀ CHẨN ĐOÁN MỚI
// -------------------------------------------------------------------
const uploadAndDiagnose = async (req, res) => {
    const userId = req.user.id; 
    
    if (!req.file) {
        return res.status(400).json({ message: 'Không tìm thấy file ảnh đáy mắt.' });
    }

    const { path: imagePath, originalname: fileName, filename: savedFilename } = req.file;

    try {
        // 1. GỌI AI CORE SERVICE (Python FastAPI)
        // Kết quả trả về từ Python sẽ có dạng: { diagnosis_code: 2, confidence: 0.85, ... }
        const rawAiResult = await aiService.diagnoseImage(imagePath, fileName);

        // 2. XỬ LÝ KẾT QUẢ TỪ AI (Mapping 0-4 sang tiếng Việt)
        const diagnosisCode = rawAiResult.diagnosis_code; // 0, 1, 2, 3, hoặc 4
        const confidence = rawAiResult.confidence;        // Ví dụ: 0.8215

        // Lấy thông tin chi tiết từ bảng map
        const diagnosisInfo = DR_LABELS[diagnosisCode] || { label: "Không xác định", severity: "N/A", advice: "Vui lòng thử lại." };

        // Tạo object kết quả chuẩn hóa để trả về Frontend và lưu DB
        const finalResult = {
            code: diagnosisCode,
            label: diagnosisInfo.label,
            severity: diagnosisInfo.severity,
            advice: diagnosisInfo.advice,
            confidence: (confidence * 100).toFixed(2) + '%', // Chuyển thành phần trăm
            raw_data: rawAiResult // Lưu lại kết quả gốc để debug nếu cần
        };

        // 3. LƯU VÀO DATABASE (Prisma)
        // Lưu ý: Trong DB nên lưu 'code' (int) để dễ thống kê sau này
        const storagePath = `uploads/${savedFilename}`;
        
        const savedRecord = await dbService.saveDiagnosisRecord(
            userId, 
            finalResult, // Truyền object đã xử lý
            storagePath
        );
        
        // 4. XÓA FILE TẠM (Clean up)
        await fs.unlink(imagePath); 
        
        // 5. TRẢ VỀ KẾT QUẢ
        res.status(200).json({
            success: true,
            message: 'Chẩn đoán hoàn tất.',
            data: {
                record_id: savedRecord.id,
                image_url: storagePath, // Đường dẫn ảnh (cần cấu hình static folder ở app.js)
                diagnosis: finalResult
            }
        });

    } catch (error) {
        console.error('Lỗi Controller:', error.message);
        // Xóa file tạm nếu lỗi
        await fs.unlink(imagePath).catch(() => {}); 
        res.status(500).json({ success: false, message: error.message || 'Lỗi hệ thống.' });
    }
};

// -------------------------------------------------------------------
// HÀM 2: LẤY LỊCH SỬ CHẨN ĐOÁN
// -------------------------------------------------------------------
const getDiagnosisHistory = async (req, res) => {
    const userId = req.user.id; 

    try {
        const history = await dbService.getDiagnosisHistory(userId);

        // Map lại dữ liệu lịch sử (nếu DB chỉ lưu code, ta cần map lại sang text khi lấy ra)
        const formattedHistory = history.map(record => {
            // Giả sử trong DB bạn lưu kết quả vào cột 'result' dạng JSON hoặc Int
            // Logic này tùy thuộc vào cấu trúc bảng Database của bạn
            return record; 
        });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });
    } catch (error) {
        console.error('Lỗi lấy lịch sử:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
    }
};

module.exports = { 
    uploadAndDiagnose, 
    getDiagnosisHistory 
};