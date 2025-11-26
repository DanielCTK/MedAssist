// FILE: src/components/CoreDiagnosticTool.jsx
// VERSION: FINAL PRO + FIXED UPLOAD + CONNECTED 3D

import React, { useState, useRef } from 'react'; // <<< QUAN TRỌNG: Thêm useRef
import axios from 'axios';
import { Upload, X, ScanEye, Activity, ShieldCheck, AlertCircle, BrainCircuit, Save, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/diagnose/upload';

const CoreDiagnosticTool = ({
    patientId,
    // Logic chẩn đoán sẽ tự quản lý state, nhưng nhận thêm callback từ cha để báo cáo
    onScanSuccess, // <<< Callback từ cha
}) => {
    // --- STATE NỘI BỘ ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [tempScanResult, setTempScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false); 
    const [saveSuccess, setSaveSuccess] = useState(false);

    // 🟢 REF CHO INPUT FILE (GIẢI PHÁP SỬA LỖI UPLOAD)
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setTempScanResult(null); setError(''); setSaveSuccess(false);
        }
    };

    // Hàm kích hoạt khi bấm vào vùng upload
    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDiagnose = async () => {
        if (!selectedFile || !patientId) { setError("Vui lòng chọn ảnh và kiểm tra thông tin bệnh nhân."); return; }
        setLoading(true); setError('');
        const formData = new FormData();
        formData.append('fundusImage', selectedFile);
        formData.append('patientId', patientId);

        try {
            const token = localStorage.getItem('medassist_token');
            const response = await axios.post(API_URL, formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            
            // Lấy kết quả (API mới trả về {data: {diagnosis: ...}})
            const data = response.data?.data; // Lấy trọn vẹn object data để truyền cho VisualAnalysis
            const diagnosis = data?.diagnosis;

            if (diagnosis) {
                setTempScanResult(data); 
                
                // 🔥 BÁO CÁO LÊN CHA (DiagnosisDashboard) để mở khóa tab 3D
                if (onScanSuccess) {
                    onScanSuccess(diagnosis); 
                }
            } else {
                throw new Error("Cấu trúc dữ liệu không hợp lệ.");
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || "Không thể kết nối máy chủ AI.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToHistory = async () => {
        if (!tempScanResult) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem('medassist_token');
            await axios.post('http://localhost:5000/api/diagnose/save-history', {
                patientId: patientId, // Hoặc tempScanResult.patientId
                scanImageUrl: tempScanResult.scanImageUrl, // Lấy từ kết quả API upload
                diagnosisResult: tempScanResult.diagnosis,
            }, { headers: { 'Authorization': `Bearer ${token}` } });
            setSaveSuccess(true);
        } catch (err) {
            setError("Lỗi khi lưu hồ sơ: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Helper để style màu mức độ
    const getSeverityStyle = (code) => {
        const styles = [
            { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200', label: 'An toàn' },
            { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200', label: 'Cảnh báo nhẹ' },
            { color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Cảnh báo' },
            { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'Nguy hiểm' },
            { color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200', label: 'Nghiêm trọng' }
        ];
        return styles[code] || styles[0];
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in pb-20">
            
            {/* CỘT TRÁI: VÙNG XỬ LÝ ẢNH */}
            <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                {/* Header giả lập cửa sổ phần mềm */}
                <div className="bg-gray-900 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-400 text-xs ml-3 font-mono">RETINA_SCAN_MODULE_V2.0</span>
                    </div>
                    <div className="text-gray-400 flex items-center gap-2 text-xs">
                        <Activity size={14} className="text-green-500 animate-pulse"/> System Ready
                    </div>
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                    {/* ERROR MSG */}
                    {error && (
                        <div className="absolute top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Lỗi!</strong> <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* HIỂN THỊ ẢNH PREVIEW */}
                    {previewUrl ? (
                        <div className="relative w-full h-full flex items-center justify-center group">
                            <img src={previewUrl} alt="Scan" className="max-h-[500px] w-auto object-contain rounded-xl shadow-2xl border-4 border-white z-10 transition-transform duration-500 group-hover:scale-105"/>
                            
                            {/* Hiệu ứng Scan Line */}
                            {loading && (
                                <div className="absolute inset-0 w-full max-w-[600px] mx-auto bg-gradient-to-b from-transparent via-green-400/40 to-transparent h-full z-20 animate-scan-line pointer-events-none"></div>
                            )}

                            <button onClick={() => { setPreviewUrl(null); setSelectedFile(null); }} className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur text-gray-600 p-2 rounded-lg shadow-md hover:text-red-500 hover:bg-white transition-colors">
                                <X size={20}/>
                            </button>
                        </div>
                    ) : (
                        // --- DROPZONE ĐÃ SỬA ---
                        <div 
                            onClick={triggerFileSelect} // Sự kiện click thủ công
                            className="cursor-pointer flex flex-col items-center gap-4 p-12 border-3 border-dashed border-gray-300 rounded-[2rem] hover:border-[#4361ee] hover:bg-[#4361ee]/5 transition-all group w-full max-w-lg h-80 justify-center bg-white shadow-sm hover:shadow-md"
                        >
                            <div className="p-6 bg-blue-50 rounded-full shadow-inner group-hover:scale-110 transition-transform">
                                <Upload size={40} className="text-[#4361ee]" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-700 text-xl mb-1">Tải ảnh đáy mắt lên</p>
                                <p className="text-sm text-gray-400">Click vào đây hoặc kéo thả file</p>
                            </div>
                            {/* INPUT ẨN */}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                            />
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center shrink-0 z-20 relative">
                    <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                        {patientId ? `BN: #${patientId}` : 'Chưa chọn BN'}
                    </div>
                    <button
                        onClick={handleDiagnose}
                        disabled={!selectedFile || loading}
                        className={`px-8 py-4 rounded-xl font-bold text-white shadow-xl flex items-center gap-3 transition-all transform active:scale-95
                            ${!selectedFile || loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-[#4361ee] to-[#7209b7] hover:shadow-indigo-500/40 hover:-translate-y-1'}
                        `}
                    >
                        {loading ? <><BrainCircuit className="animate-spin" /> Đang xử lý AI...</> : <><ScanEye /> Chẩn đoán ngay</>}
                    </button>
                </div>
            </div>

            {/* CỘT PHẢI: KẾT QUẢ */}
            <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 flex flex-col h-full min-h-[600px]">
                <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-8 bg-[#4361ee] rounded-full"></div>
                    Kết quả Phân tích AI
                </h3>

                {!tempScanResult ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 text-center space-y-4">
                        <BrainCircuit size={80} strokeWidth={0.5} />
                        <p className="text-sm font-medium max-w-[200px]">Vui lòng tải ảnh và nhấn Chẩn đoán để xem kết quả.</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col animate-fade-in-up">
                        {/* Main Result */}
                        <div className="text-center mb-8 relative">
                            <div className={`inline-block p-6 rounded-full bg-opacity-10 mb-4 ${getSeverityStyle(tempScanResult.diagnosis.code).bg}`}>
                                <ShieldCheck size={56} className={getSeverityStyle(tempScanResult.diagnosis.code).color} />
                            </div>
                            <h4 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {tempScanResult.diagnosis.label}
                            </h4>
                            <span className={`inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border ${getSeverityStyle(tempScanResult.diagnosis.code).bg} ${getSeverityStyle(tempScanResult.diagnosis.code).color} ${getSeverityStyle(tempScanResult.diagnosis.code).border}`}>
                                {getSeverityStyle(tempScanResult.diagnosis.code).label}
                            </span>
                        </div>

                        {/* Confidence Meter */}
                        <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                                <span>Độ chính xác AI</span>
                                <span className="text-[#4361ee]">{tempScanResult.diagnosis.confidence}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] rounded-full shadow-[0_0_15px_rgba(67,97,238,0.6)] transition-all duration-1000 ease-out" 
                                    style={{ width: tempScanResult.diagnosis.confidence }}
                                ></div>
                            </div>
                        </div>

                        {/* Advice */}
                        {tempScanResult.diagnosis.advice && (
                            <div className="bg-[#fffbf0] p-5 rounded-2xl border border-[#fde68a] mb-auto">
                                <h5 className="font-bold text-[#d97706] mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    <AlertCircle size={16}/> Lời khuyên:
                                </h5>
                                <p className="text-sm text-[#92400e] leading-relaxed font-medium">
                                    {tempScanResult.diagnosis.advice}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
                            {saveSuccess ? (
                                <div className="w-full py-4 bg-green-50 text-green-700 rounded-xl font-bold text-center flex items-center justify-center gap-2 border border-green-200 animate-pulse">
                                    <ShieldCheck size={20}/> Đã lưu hồ sơ thành công!
                                </div>
                            ) : (
                                <button 
                                    onClick={handleSaveToHistory}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-[#1e293b] hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70"
                                >
                                    {isSaving ? <BrainCircuit className="animate-spin"/> : <Save />} Lưu vào Bệnh án
                                </button>
                            )}
                            
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-bold">Tùy chọn nâng cao</p>
                                <p className="text-xs font-bold text-[#4361ee] cursor-pointer hover:underline flex items-center justify-center gap-1">
                                    Chuyển qua chế độ 3D <ChevronRight size={14}/>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoreDiagnosticTool;