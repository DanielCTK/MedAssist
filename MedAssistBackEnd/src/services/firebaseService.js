const admin = require("firebase-admin");
const path = require("path");

// Đường dẫn đến file key bạn vừa tải về
const serviceAccount = require("../config/serviceAccountKey.json");

// Khởi tạo Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Thay 'medassist-xxxxx' bằng Project ID của bạn (xem trong Project Settings trên web)
  // Hoặc vào mục Storage trên web, copy cái link gs://... bỏ gs:// đi
  storageBucket: "medassist-ed4cd.appspot.com" 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };