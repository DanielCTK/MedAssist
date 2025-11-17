const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==============================================================================
// 1. QUẢN LÝ NGƯỜI DÙNG (USER) - Khôi phục lại để sửa lỗi Login
// ==============================================================================

/**
 * Tìm user theo email (Dùng cho Login)
 */
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email: email }
    });
};

/**
 * Tạo user mới (Dùng cho Register)
 */
const createUser = async (userData) => {
    // userData thường gồm: { email, password, name }
    return await prisma.user.create({
        data: userData
    });
};

// ==============================================================================
// 2. QUẢN LÝ BỆNH ÁN (DIAGNOSIS) - Code AI mới của bạn
// ==============================================================================

/**
 * Lưu kết quả chẩn đoán vào Database
 */
const saveDiagnosisRecord = async (userId, diagnosisResult, imagePath) => {
    console.log("🔍 Đang lưu vào DB:", diagnosisResult); 

    try {
        const record = await prisma.diagnosisRecord.create({
            data: {
                userId: userId,
                imagePath: imagePath,

                // --- MAPPING DỮ LIỆU ---
                diagnosisCode: diagnosisResult.code,       
                diagnosisLabel: diagnosisResult.label,     
                confidence: diagnosisResult.confidence,    
                
                // Lưu JSON chi tiết
                fullResult: JSON.stringify(diagnosisResult), 
                
                createdAt: new Date()
            }
        });

        console.log("✅ Lưu DB thành công, ID:", record.id);
        return record;

    } catch (error) {
        console.error("❌ Lỗi Prisma khi lưu bản ghi:", error);
        throw new Error("Database error while saving diagnosis record.");
    }
};

/**
 * Lấy lịch sử chẩn đoán của User
 */
const getDiagnosisHistory = async (userId) => {
    try {
        const history = await prisma.diagnosisRecord.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' } // Mới nhất lên đầu
        });
        return history;
    } catch (error) {
        console.error("❌ Lỗi Prisma khi lấy lịch sử:", error);
        throw new Error("Database error while fetching history.");
    }
};

// ==============================================================================
// 3. EXPORT TẤT CẢ CÁC HÀM
// ==============================================================================
module.exports = { 
    // Nhóm User
    findUserByEmail,
    createUser,
    
    // Nhóm AI
    saveDiagnosisRecord, 
    getDiagnosisHistory 
};