import React, { useState } from 'react';
// Thêm icon Maximize/Minimize
import { Activity, LogOut, Upload, Eye, Maximize, Minimize } from 'lucide-react'; 

import CoreDiagnosticTool from './CoreDiagnosticTool';
import VisualAnalysis from './VisualAnalysis';

const DiagnosisDashboard = ({ onLogout }) => {
    // STATE CHUNG
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State quản lý menu
    const [activeView, setActiveView] = useState('diagnostic'); 

    // STATE MỚI: Quản lý giao diện mở rộng
    const [isExpanded, setIsExpanded] = useState(false);

    const renderContent = () => {
        switch (activeView) {
            case 'diagnostic':
                return (
                    <CoreDiagnosticTool 
                        selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                        previewUrl={previewUrl} setPreviewUrl={setPreviewUrl}
                        diagnosis={diagnosis} setDiagnosis={setDiagnosis}
                        loading={loading} setLoading={setLoading}
                        error={error} setError={setError}
                    />
                );
            case 'visual':
                return (
                    // Truyền trạng thái 'isExpanded' xuống
                    <VisualAnalysis 
                        diagnosisData={diagnosis} 
                        isExpanded={isExpanded} 
                    />
                );
            default:
                return null;
        }
    };

    const getMenuItemClass = (viewName) => (
        `w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${
            activeView === viewName 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
        }`
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                    <Activity /> MedAssist Dashboard
                </h1>
                
                {/* CÁC NÚT ĐIỀU KHIỂN HEADER */}
                <div className="flex items-center gap-4">
                    {/* NÚT MỞ RỘNG */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-blue-600"
                        title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
                    >
                        {isExpanded ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                    <button 
                        onClick={onLogout} 
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition"
                    >
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>
            </div>

            {/* LAYOUT CHÍNH (THAY ĐỔI DỰA TRÊN isExpanded) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* CỘT 1: MENU (Sẽ bị ẩn khi isExpanded) */}
                <div className={`
                    md:col-span-3 bg-white p-4 rounded-2xl shadow-lg h-min
                    transition-all duration-300
                    ${isExpanded ? 'hidden' : 'block'}
                `}>
                    <h3 className="text-sm uppercase text-gray-500 font-bold mb-3 border-b pb-2 px-2">Menu</h3>
                    <nav className="space-y-2">
                        <button 
                            onClick={() => setActiveView('diagnostic')} 
                            className={getMenuItemClass('diagnostic')}
                        >
                            <Upload size={20} /> Công cụ Chẩn đoán
                        </button>
                        <button 
                            onClick={() => setActiveView('visual')} 
                            className={getMenuItemClass('visual')}
                        >
                            <Eye size={20} /> Phân tích Trực quan 3D
                        </button>
                    </nav>
                </div>

                {/* CỘT 2: NỘI DUNG (Mở rộng khi isExpanded) */}
                <div className={`
                    transition-all duration-300
                    ${isExpanded ? 'md:col-span-12' : 'md:col-span-9'}
                `}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DiagnosisDashboard;