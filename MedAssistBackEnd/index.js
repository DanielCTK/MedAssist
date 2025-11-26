// FILE: index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Routes
const authRoutes = require(path.join(__dirname, './src/routes/authRoutes'));
const diagnosisRoutes = require(path.join(__dirname, './src/routes/diagnosisRoutes'));

// --- BỎ COMMENT DÒNG NÀY ---
const patientRoutes = require(path.join(__dirname, './src/routes/patientRoutes')); 
// ---------------------------

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Routes
app.use('/api/auth', authRoutes);
app.use('/api/diagnose', diagnosisRoutes);

// --- BỎ COMMENT DÒNG NÀY ---
app.use('/api/patients', patientRoutes); 
// ---------------------------

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'MedAssist AI Backend API is running.',
        status: 'ok'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server Node.js running on http://localhost:${PORT}`);
    console.log("🔥 Connected to Firebase Services");
});