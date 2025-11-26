// FILE: src/components/DiagnosisDashboard.jsx
// VERSION: FIXED LAYOUT - NO MORE SCROLL ISSUE

import React, { useState } from 'react';
import { Activity, LogOut, Upload, Eye, ArrowLeft, Maximize, Settings } from 'lucide-react'; 
import CoreDiagnosticTool from './CoreDiagnosticTool';
import VisualAnalysis from './VisualAnalysis';

const DiagnosisDashboard = ({ patientId, onLogout, onScanComplete }) => {
    // State
    const [activeView, setActiveView] = useState('diagnostic'); 
    const [diagnosis, setDiagnosis] = useState(null); 
    const [isExpanded, setIsExpanded] = useState(false); // Dành cho chế độ full màn hình (optional)

    // Callback nhận kết quả
    const handleScanSuccess = (result) => {
        setDiagnosis(result);
        // Nếu muốn tự động chuyển tab: setActiveView('visual');
    };

    const getMenuItemClass = (viewName) => (`
        w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all duration-200 text-sm
        ${activeView === viewName 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]' 
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}
    `);

    // Render Content
    const renderContent = () => {
        switch (activeView) {
            case 'diagnostic':
                return <CoreDiagnosticTool patientId={patientId} onScanSuccess={handleScanSuccess} />;
            case 'visual':
                return <VisualAnalysis diagnosisData={diagnosis} isExpanded={isExpanded} />;
            default: return null;
        }
    };

    return (
        <div className="w-full font-sans">
            
            {/* STICKY HEADER BAR */}
            <div className="sticky top-20 z-40 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onScanComplete} 
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 bg-transparent hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-semibold text-sm"
                    >
                        <ArrowLeft size={18} /> Quay lại
                    </button>
                    <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-2 hidden md:block"></div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Activity size={20} className="text-blue-500" /> 
                        Workstation Chẩn đoán
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"><Settings size={18}/></button>
                </div>
            </div>

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDEBAR MENU (Sticky) */}
                <aside className="md:col-span-3 lg:col-span-2 sticky top-40">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-[24px] shadow-lg border border-gray-100 dark:border-slate-700">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 px-2 tracking-wider">Module</p>
                        <nav className="space-y-2">
                            <button onClick={() => setActiveView('diagnostic')} className={getMenuItemClass('diagnostic')}>
                                <Upload size={18} /> Scan Ảnh
                            </button>
                            <button 
                                onClick={() => setActiveView('visual')} 
                                disabled={!diagnosis} 
                                className={`${getMenuItemClass('visual')} ${!diagnosis && 'opacity-50 cursor-not-allowed hover:bg-transparent'}`}
                            >
                                <Eye size={18} /> 3D Model
                            </button>
                        </nav>
                    </div>
                    
                    {/* Mini Info Box */}
                    {patientId && (
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-[20px] border border-blue-100 dark:border-blue-800/50 text-center">
                            <p className="text-xs text-blue-400 font-bold uppercase mb-1">Bệnh nhân đang chọn</p>
                            <p className="text-lg font-black text-blue-700 dark:text-blue-300">#{patientId}</p>
                        </div>
                    )}
                </aside>

                {/* MAIN CONTENT AREA (Right side) */}
                {/* Ở đây chúng ta KHÔNG đặt overflow-hidden hay fix height nào cả */}
                <section className="md:col-span-9 lg:col-span-10 min-h-[500px]">
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-slate-700 p-1 overflow-hidden">
                        <div className="rounded-[28px] bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-8">
                            {renderContent()}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DiagnosisDashboard;