// FILE: src/components/PatientList.jsx (PHIÊN BẢN GIAO DIỆN TABLE HIỆN ĐẠI)

import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Camera, Trash2, Flag, MessageCircle, Phone, MoreHorizontal, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';
import AddPatientModal from './AddPatientModal'; 

// API URL
const API_URL = 'http://localhost:5000/api';

// Hàm random màu cờ trạng thái (giả lập)
const getStatusFlag = (id) => {
    const colors = ['text-red-500', 'text-yellow-500', 'text-blue-500'];
    return <Flag size={18} className={`${colors[id % 3]} fill-current`} />;
};

const PatientList = ({ onSelectPatient, onStartScan }) => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- LOGIC FETCH & FILTER (GIỮ NGUYÊN NHƯ CŨ) ---
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true); setError('');
            try {
                const token = localStorage.getItem('medassist_token');
                const response = await axios.get(`${API_URL}/patients`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (response.data?.patients) {
                    setPatients(response.data.patients);
                    setFilteredPatients(response.data.patients);
                } else { setPatients([]); setFilteredPatients([]); }
            } catch (err) { setError(err.message); } finally { setIsLoading(false); }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        const results = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredPatients(results);
    }, [searchTerm, patients]);

    const handleDeletePatient = async (patientId, patientName, e) => {
        e.stopPropagation();
        if (!window.confirm(`Xóa hồ sơ của "${patientName}"?`)) return;
        try {
            const token = localStorage.getItem('medassist_token');
            await axios.delete(`${API_URL}/patients/${patientId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setPatients(prev => prev.filter(p => p.id !== patientId));
        } catch (err) { alert("Lỗi khi xóa: " + err.message); }
    };

    // Xử lý thêm bệnh nhân mới (Bao gồm cả SĐT)
    const handleAddPatient = async (formData) => {
        try {
            const token = localStorage.getItem('medassist_token');
            const response = await axios.post(`${API_URL}/patients`, formData, { headers: { 'Authorization': `Bearer ${token}` } });
            const newPatient = response.data.patient;
            
            // Nếu backend chưa hỗ trợ lưu phone, ta tạm thời gán vào state ở frontend để test
            const patientWithMockData = { 
                ...newPatient, 
                phone: formData.phone, 
                email: formData.email 
            };
            
            setPatients(prev => [patientWithMockData, ...prev]);
            setIsModalOpen(false);
        } catch (err) { alert("Lỗi: " + err.message); }
    };

    // Hàm mở Zalo
    const openZalo = (e, phone) => {
        e.stopPropagation();
        if (phone) {
            window.open(`https://zalo.me/${phone}`, '_blank');
        } else {
            alert("Chưa có số điện thoại cho bệnh nhân này.");
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500 animate-pulse">Đang tải dữ liệu...</div>;

    return (
        <>
            {/* CONTAINER CHÍNH */}
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 animate-fade-in min-h-[80vh] flex flex-col">
                
                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Danh sách Bệnh nhân</h2>
                        <p className="text-gray-400 text-sm mt-1">Tổng số hồ sơ: <span className="text-blue-600 font-bold">{patients.length}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border border-gray-200">
                        <button className="px-6 py-2 bg-white text-blue-600 rounded-full shadow-sm font-semibold text-sm">Overview</button>
                        <button className="px-6 py-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition">List View</button>
                        <button className="px-6 py-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition">Invitations</button>
                    </div>
                </div>

                {/* TOOLBAR (SEARCH & ADD) */}
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" placeholder="Tìm kiếm theo tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-100 rounded-2xl outline-none transition-all text-sm"
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-200 transition"><Filter size={20}/></button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#4361ee] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                        >
                            <UserPlus size={20} /> Thêm Hồ sơ
                        </button>
                    </div>
                </div>

                {/* TABLE HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100/50 rounded-2xl mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4 md:col-span-3 pl-2">Họ & Tên</div>
                    <div className="col-span-2 text-center">Trạng thái</div>
                    <div className="col-span-2 hidden md:block">Ngày sinh</div>
                    <div className="col-span-2 hidden lg:block">Lần khám cuối</div>
                    <div className="col-span-4 md:col-span-3 lg:col-span-3 text-right pr-4">Hành động</div>
                </div>

                {/* TABLE BODY (LIST) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    {filteredPatients.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">Chưa có bệnh nhân nào.</div>
                    ) : (
                        filteredPatients.map((patient, index) => (
                            <div 
                                key={patient.id} 
                                onClick={() => onSelectPatient(patient.id)}
                                className="group grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }} // Stagger animation
                            >
                                {/* Cột 1: Info */}
                                <div className="col-span-4 md:col-span-3 flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${patient.name}&background=random&color=fff`} 
                                            alt={patient.name} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{patient.name}</h4>
                                        <p className="text-xs text-gray-400">ID: #{patient.id}</p>
                                    </div>
                                </div>

                                {/* Cột 2: Status */}
                                <div className="col-span-2 flex justify-center">
                                    <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all" title="Tình trạng sức khỏe">
                                        {getStatusFlag(patient.id)}
                                    </div>
                                </div>

                                {/* Cột 3: DOB */}
                                <div className="col-span-2 hidden md:block text-sm text-gray-500 font-medium">
                                    {patient.dob}
                                </div>

                                {/* Cột 4: Last Visit (Mock) */}
                                <div className="col-span-2 hidden lg:block text-sm text-gray-500">
                                    May 20, 2025
                                </div>

                                {/* Cột 5: Actions */}
                                <div className="col-span-4 md:col-span-3 lg:col-span-3 flex justify-end items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {/* Nút nhắn tin Zalo */}
                                    <button 
                                        onClick={(e) => openZalo(e, patient.phone)}
                                        title="Nhắn tin Zalo"
                                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                    
                                    {/* Nút Scan */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onStartScan(patient.id); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-[#4361ee] hover:text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                                    >
                                        <Camera size={16} /> Scan
                                    </button>

                                    {/* Nút More Actions */}
                                    <div className="relative group/menu">
                                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                                            <MoreHorizontal size={20} />
                                        </button>
                                        {/* Dropdown xóa (ẩn/hiện bằng CSS) */}
                                        <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-xl rounded-xl p-2 hidden group-hover/menu:block z-50 border border-gray-100">
                                            <button 
                                                onClick={(e) => handleDeletePatient(patient.id, patient.name, e)}
                                                className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm flex items-center gap-2"
                                            >
                                                <Trash2 size={16}/> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Thêm Bệnh nhân */}
            <AddPatientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPatientAdded={handleAddPatient}
            />
        </>
    );
};

export default PatientList;