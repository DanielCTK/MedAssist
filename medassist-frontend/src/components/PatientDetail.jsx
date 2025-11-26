// FILE: src/components/PatientDetail.jsx (PHIÊN BẢN PRO UI)

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Camera, FileText, Activity, Thermometer, Droplets, MoreHorizontal, Calendar, User, Download } from 'lucide-react';
import axios from 'axios';
import PatientHistoryChart from './PatientHistoryChart';

const API_URL = 'http://localhost:5000/api';

const PatientDetail = ({ patientId, onBackToList, onStartScan }) => {
    const [patientData, setPatientData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!patientId) return;
        const fetchPatientDetail = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('medassist_token');
                const response = await axios.get(`${API_URL}/patients/${patientId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.data && response.data.patient) {
                    setPatientData(response.data.patient);
                } else {
                    throw new Error("Dữ liệu không hợp lệ.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatientDetail();
    }, [patientId]);

    if (isLoading) return <div className="text-center p-10 text-gray-500 animate-pulse">Đang tải hồ sơ bệnh án...</div>;
    if (error) return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">Lỗi: {error}</div>;
    if (!patientData) return null;

    // Giả lập tuổi từ DOB
    const getAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const diagnosisHistory = patientData.diagnosisRecords || [];
    const chartData = diagnosisHistory.map(record => ({
        date: new Date(record.createdAt).toLocaleDateString('vi-VN'),
        level: record.aiResultCode,
        hba1c: record.hba1cValue,
    })).reverse();

    return (
        <div className="animate-fade-in space-y-6 font-sans text-gray-700">
            
            {/* HEADER: Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <button onClick={onBackToList} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-2 transition">
                        <ArrowLeft size={16} /> Quay lại danh sách
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Hồ sơ Bệnh án</h2>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-blue-600 shadow-sm">
                        <MoreHorizontal size={20} />
                    </button>
                    <button 
                        onClick={() => onStartScan(patientData.id)}
                        className="flex items-center gap-2 bg-[#0f766e] hover:bg-[#0d5f58] text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-teal-700/20 transition active:scale-95"
                    >
                        <Camera size={18} /> Scan Mới
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN (PROFILE CARD) */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-purple-50"></div>
                        
                        <div className="relative mb-4 inline-block">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${patientData.name}&size=128&background=random`} 
                                alt="Avatar" 
                                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg mx-auto"
                            />
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800">{patientData.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">{getAge(patientData.dob)} tuổi • TP.HCM</p>
                        
                        <button className="w-full py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                            <Edit size={16} /> Cập nhật thông tin
                        </button>
                    </div>

                    {/* INFORMATION DETAIL */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Thông tin chi tiết</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-400">Giới tính</span>
                                <span className="font-semibold text-gray-700">Nam</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-400">Ngày sinh</span>
                                <span className="font-semibold text-gray-700">{new Date(patientData.dob).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-400">Nhóm máu</span>
                                <span className="font-semibold text-gray-700">O+</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-400">Tiểu đường</span>
                                <span className="font-semibold text-gray-700">{patientData.diabetesType || 'Chưa rõ'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-400">Mã Bệnh án</span>
                                <span className="font-mono font-bold text-blue-600">#{patientData.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (RỘNG HƠN): CÁC CHỈ SỐ & LỊCH SỬ */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* VITALS ROW (Giả lập số liệu) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl"><Activity size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Nhịp tim</p>
                                <p className="text-xl font-bold text-gray-800">80 <span className="text-sm font-normal text-gray-400">bpm</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Thermometer size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Nhiệt độ</p>
                                <p className="text-xl font-bold text-gray-800">36.5 <span className="text-sm font-normal text-gray-400">°C</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Droplets size={24} /></div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Đường huyết</p>
                                <p className="text-xl font-bold text-gray-800">100 <span className="text-sm font-normal text-gray-400">mg/dl</span></p>
                            </div>
                        </div>
                    </div>

                    {/* REPORTS SECTION (Danh sách Scan) */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4 text-lg">Báo cáo chẩn đoán & Xét nghiệm</h4>
                        
                        {/* List ngang cuộn được */}
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {diagnosisHistory.length > 0 ? diagnosisHistory.map((record) => (
                                <div key={record.id} className="min-w-[200px] p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-white rounded-lg shadow-sm"><FileText size={18} className="text-blue-500"/></div>
                                        <span className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <h5 className="font-bold text-gray-700 text-sm mb-1 truncate">Scan Võng mạc AI</h5>
                                    <p className={`text-xs font-semibold ${record.aiResultCode > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {record.aiResultLabel}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-gray-400 text-sm py-4 italic w-full text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    Chưa có báo cáo nào. Hãy thực hiện Scan mới.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PRESCRIPTIONS / CHART SECTION */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-gray-800 text-lg">Biểu đồ Tiến triển DR</h4>
                            <button className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition">
                                + Thêm ghi chú
                            </button>
                        </div>
                        
                        {chartData.length > 0 ? (
                            <div style={{ height: '250px', width: '100%' }}>
                                <PatientHistoryChart data={chartData} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-xl text-gray-400">
                                <Activity size={32} className="mb-2 opacity-50"/>
                                <p>Chưa đủ dữ liệu biểu đồ</p>
                            </div>
                        )}
                        
                        {/* Danh sách thuốc (giả lập UI như bản mẫu) */}
                        <div className="mt-6 border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Insulin Glargine</p>
                                        <p className="text-xs text-gray-400">Tiêm dưới da</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">3 tháng</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-10 bg-blue-400 rounded-full"></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Vitamin A & Lutein</p>
                                        <p className="text-xs text-gray-400">Hỗ trợ thị lực</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">1 tháng</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PatientDetail;