import React from 'react';
import { Upload, X, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/diagnose/upload';

const CoreDiagnosticTool = ({
    selectedFile, setSelectedFile,
    previewUrl, setPreviewUrl,
    diagnosis, setDiagnosis,
    loading, setLoading,
    error, setError
}) => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setDiagnosis(null); 
            setError('');
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setDiagnosis(null);
        setError('');
    };

    const handleDiagnose = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('fundusImage', selectedFile);
        try {
            const token = localStorage.getItem('medassist_token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setDiagnosis(data.data.diagnosis); 
            } else {
                setError(data.message || 'Lỗi xử lý từ server.');
            }
        } catch (err) {
            console.error(err);
            setError('Không thể kết nối đến Server.');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (code) => {
        if (code === 0) return 'text-green-600 bg-green-100 border-green-200';
        if (code <= 2) return 'text-orange-600 bg-orange-100 border-orange-200';
        return 'text-red-600 bg-red-100 border-red-200';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* CỘT TRÁI: UPLOAD ẢNH */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload size={24} className="text-blue-500"/> Tải ảnh đáy mắt
                </h2>
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/50 min-h-[300px] flex flex-col justify-center items-center relative">
                    {!previewUrl ? (
                        <>
                            <Upload size={48} className="text-blue-300 mb-3" />
                            <p className="text-gray-500 mb-4">Kéo thả hoặc chọn ảnh</p>
                            <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
                                Chọn ảnh
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </>
                    ) : (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <img src={previewUrl} alt="Preview" className="max-h-[300px] rounded-lg shadow-md object-contain" />
                            <button 
                                onClick={handleReset}
                                className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full shadow hover:bg-red-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleDiagnose}
                    disabled={!selectedFile || loading}
                    className={`w-full mt-6 py-3 rounded-xl font-bold text-lg text-white shadow-md transition-all ${!selectedFile || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-1'}`}
                >
                    {loading ? '🤖 AI Đang Phân Tích...' : '🚀 Bắt đầu Chẩn đoán'}
                </button>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
                        <AlertTriangle size={20} /> {error}
                    </div>
                )}
            </div>
            {/* CỘT PHẢI: KẾT QUẢ */}
            <div className="flex flex-col gap-6">
                {!diagnosis ? (
                    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                        <FileText size={64} className="mb-4 text-gray-200"/>
                        <p>Kết quả phân tích sẽ hiển thị tại đây</p>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 animate-fade-in">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="text-blue-600"/> Kết quả Phân tích
                            </h2>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <CheckCircle size={16}/> Hoàn tất
                            </span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Chẩn đoán của AI</p>
                                <p className="text-3xl font-extrabold text-blue-800 mt-1">{diagnosis.label}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${getSeverityColor(diagnosis.code)}`}>
                                    <p className="text-sm opacity-80 font-semibold">Mức độ nghiêm trọng</p>
                                    <p className="text-lg font-bold">{diagnosis.severity}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <p className="text-sm text-gray-500 font-semibold">Độ tin cậy AI</p>
                                    <p className="text-lg font-bold text-gray-800">{diagnosis.confidence}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                                <h4 className="font-bold text-blue-800 mb-2">💡 Lời khuyên y tế:</h4>
                                <p className="text-gray-700 leading-relaxed">{diagnosis.advice}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoreDiagnosticTool;