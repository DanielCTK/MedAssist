// FILE: src/components/MainDashboard.jsx
// VERSION: HOÀN THIỆN - ĐÃ SỬA LỖI SCROLL SCAN TOOL

import React, { useState, useEffect } from 'react';
import TopBar from './TopBar'; 
import ChatbotWidget from './ChatbotWidget';

// Import các component chức năng
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import DiagnosisDashboard from './DiagnosisDashboard';
import PrescriptionModule from './PrescriptionModule';
import DashboardHome from './DashboardHome';
import Schedule from './Schedule';

const MainDashboard = ({ onLogout }) => {
    // --- State ---
    const [currentView, setCurrentView] = useState('home');
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    
    // User state
    const [user, setUser] = useState({ name: "Alisha Nicholls", role: "Trưởng khoa" }); 

    // Dark Mode state
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    // Avatar state
    const [doctorAvatar] = useState(() => localStorage.getItem('doctorAvatar') || "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg");

    // --- Handlers ---
    const handleSelectPatient = (id) => { setSelectedPatientId(id); setCurrentView('patient_detail'); };
    const handleStartScan = (id) => { setSelectedPatientId(id); setCurrentView('scan_tool'); };
    const handleBack = () => { setSelectedPatientId(null); setCurrentView('patients'); };
    
    // Cập nhật thông tin bác sĩ
    const handleUpdateUser = (newData) => setUser(prev => ({ ...prev, ...newData }));

    // --- Router / Render ---
    const renderMainContent = () => {
        switch (currentView) {
            case 'home': return <DashboardHome user={user} isDarkMode={isDarkMode} onUpdateUser={handleUpdateUser} />;
            
            case 'patients':
                return <div className="animate-fade-in pb-20"><PatientList onSelectPatient={handleSelectPatient} onStartScan={handleStartScan} /></div>;
            
            case 'patient_detail':
                return <div className="animate-fade-in pb-20"><PatientDetail patientId={selectedPatientId} onBackToList={handleBack} onStartScan={handleStartScan} /></div>;

            case 'pharmacy': return <div className="pb-20"><PrescriptionModule /></div>;
            case 'diagnosis': return <div className="pb-20"><PatientList onSelectPatient={handleSelectPatient} onStartScan={handleStartScan} /></div>;
            case 'calendar': return <div className="h-full p-4 pb-20"><Schedule /></div>;

            // --- SỬA LẠI ĐOẠN NÀY ---
            case 'scan_tool': 
                return (
                    <div className="w-full min-h-screen pb-32 animate-fade-in">
                        {/* Component chẩn đoán sẽ tự do co giãn chiều cao */}
                        <DiagnosisDashboard 
                            patientId={selectedPatientId} 
                            onLogout={onLogout} 
                            onScanComplete={handleBack} 
                        />
                    </div>
                );
            // -----------------------

            default: return <DashboardHome user={user} isDarkMode={isDarkMode} onUpdateUser={handleUpdateUser} />;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-x-hidden ${isDarkMode ? 'bg-[#0f172a] text-slate-200' : 'bg-[#F8F9FC] text-slate-800'}`}>
            
            {/* TOP BAR */}
            <TopBar currentView={currentView} setCurrentView={setCurrentView} onLogout={onLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} user={user} avatar={doctorAvatar} />

            {/* MAIN CONTENT (Scrollable Area của toàn trang web) */}
            <div className="pt-20 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen">
                {renderMainContent()}
            </div>

            <ChatbotWidget />
        </div>
    );
};

export default MainDashboard;