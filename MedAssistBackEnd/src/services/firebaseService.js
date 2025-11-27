const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// 1. Lấy thông tin từ Biến môi trường (Dành cho Render)
const firebaseConfigEnv = process.env.FIREBASE_CREDENTIALS; 

let serviceAccount;

if (firebaseConfigEnv) {
    // Nếu có biến môi trường (đang chạy trên Render)
    // Parse chuỗi JSON thành Object
    try {
        serviceAccount = JSON.parse(firebaseConfigEnv);
        console.log("✅ Đã tải Credentials từ biến môi trường (Render Mode)");
    } catch (error) {
        console.error("❌ Lỗi parse JSON từ biến môi trường:", error);
    }
} else {
    // 2. Nếu không có, tìm file json (Dành cho Localhost máy bạn)
    const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = require(serviceAccountPath);
        console.log("✅ Đã tải Credentials từ file JSON (Local Mode)");
    } else {
        console.error("❌ LỖI: Không tìm thấy Key Firebase (cả Env lẫn File). Server sẽ crash.");
    }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Thay bằng tên bucket của bạn (bỏ gs://)
    storageBucket: "medassist-ed4cd.appspot.com" 
  });
  console.log("🔥 Firebase Admin connected!");
} catch (error) {
  console.error("❌ Firebase Init Error:", error);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };