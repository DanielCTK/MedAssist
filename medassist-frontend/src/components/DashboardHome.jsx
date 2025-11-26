// FILE: src/components/DashboardHome.jsx
// VERSION: SYMTRA STYLE + REAL DATA + 3D EFFECT

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, Calendar, AlertCircle, Info, Phone, Filter, Upload, Edit2, X, Stethoscope, ChevronDown, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- STYLES 3D ---
// Class tạo hiệu ứng nổi 3D mạnh mẽ
const card3DStyle = (isDark) => `
    relative p-6 rounded-[32px] transition-all duration-500 ease-out
    ${isDark 
        ? 'bg-[#1e293b] border border-slate-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]' 
        : 'bg-white border border-white shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff]'}
    hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)]
`;

const DashboardHome = ({ user, isDarkMode, onUpdateUser }) => {
    
    // --- STATE ---
    // Dữ liệu thống kê
    const [stats, setStats] = useState({ patientCount: 0, diagnosisCount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Modal Edit Profile
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: user.name, title: user.title, email: user.email });

    // Data Chart (Mặc định rỗng)
    const [chartData1, setChartData1] = useState([{ name: 'Done', value: 1 }, { name: 'Rest', value: 1 }]); // Patients
    const [chartData2, setChartData2] = useState([{ name: 'Risk', value: 1 }, { name: 'Safe', value: 1 }]); // Diagnoses

    // --- FETCH REAL DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('medassist_token');
                // Gọi API Dashboard thật
                const response = await axios.get('http://localhost:5000/api/dashboard', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data;

                setStats({
                    patientCount: data.patientCount,
                    diagnosisCount: data.diagnosisCount
                });

                // Cập nhật biểu đồ với số liệu THẬT
                // Chart 1: Tổng bệnh nhân (Ví dụ: So với mục tiêu 100)
                const goalPatients = 50; 
                setChartData1([
                    { name: 'Patients', value: data.patientCount },
                    { name: 'Target', value: Math.max(0, goalPatients - data.patientCount) }
                ]);

                // Chart 2: Chẩn đoán rủi ro (Ví dụ giả định 30% là rủi ro)
                const riskCount = Math.round(data.diagnosisCount * 0.3); 
                setChartData2([
                    { name: 'Risk', value: riskCount },
                    { name: 'Normal', value: data.diagnosisCount - riskCount }
                ]);

            } catch (err) {
                console.error("Load Dashboard Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle Edit User
    const handleSaveProfile = (e) => {
        e.preventDefault();
        onUpdateUser(editForm);
        setIsEditOpen(false);
    };

    return (
        <div className="space-y-8 pb-20 animate-fade-in-up">
            
            {/* --- HEADER: TÊN BÁC SĨ & CÔNG CỤ --- */}
            <div className={`flex flex-col md:flex-row justify-between items-center p-6 rounded-[24px] shadow-sm border ${isDarkMode?'bg-slate-800 border-slate-700':'bg-white border-gray-50'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/40">
                         <Stethoscope size={28} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-extrabold ${isDarkMode?'text-white':'text-slate-800'}`}>
                            Tổng quan Khoa: <span className="text-blue-500 font-normal">Chẩn đoán Hình ảnh</span>
                        </h2>
                    </div>
                </div>

                {/* INFO BÁC SĨ & NÚT EDIT */}
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <div className="text-right hidden md:block">
                        <h3 className={`font-bold text-lg ${isDarkMode?'text-slate-200':'text-slate-800'}`}>{user.name}</h3>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{user.title}</p>
                    </div>
                    <button 
                        onClick={() => setIsEditOpen(true)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        title="Chỉnh sửa thông tin cá nhân"
                    >
                        <Edit2 size={20}/>
                    </button>
                    <div className="w-px h-10 bg-gray-200 dark:bg-slate-700"></div>
                    <div className="text-right">
                         <span className="block text-xs text-gray-400">Ngày làm việc</span>
                         <span className={`font-bold ${isDarkMode?'text-white':'text-gray-800'}`}>19/06/2025</span>
                    </div>
                </div>
            </div>

            {/* --- ROW 1: HAI BIỂU ĐỒ 3D LỚN (Dữ liệu thật) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* CARD 1: BỆNH NHÂN (Màu xanh) */}
                <div className={card3DStyle(isDarkMode)}>
                    <h3 className={`text-lg font-bold mb-6 ${isDarkMode?'text-white':'text-gray-800'}`}>Tổng Bệnh nhân</h3>
                    <div className="flex items-center gap-8">
                        {/* Biểu đồ */}
                        <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData1} cy={90} innerRadius={60} outerRadius={80} startAngle={180} endAngle={0} dataKey="value" paddingAngle={5}>
                                        <Cell fill="#3b82f6" className="drop-shadow-xl" /> {/* Xanh */}
                                        <Cell fill={isDarkMode ? "#334155" : "#e5e7eb"} />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Số liệu ở giữa */}
                            <div className="absolute top-20 inset-x-0 text-center -mt-3">
                                <span className={`text-5xl font-black block ${isDarkMode?'text-white':'text-slate-800'}`}>
                                    {isLoading ? '...' : stats.patientCount}
                                </span>
                                <span className="text-xs text-gray-400 font-bold uppercase">Hồ sơ</span>
                            </div>
                        </div>

                        {/* Chú thích */}
                        <div className="flex-1 space-y-4">
                             <div className="flex justify-between items-center">
                                 <span className={`text-sm font-medium flex items-center gap-2 ${isDarkMode?'text-slate-300':'text-gray-600'}`}><span className="w-3 h-3 rounded-full bg-blue-600"></span> Trong hệ thống</span>
                                 <span className="font-bold text-lg">{stats.patientCount}</span>
                             </div>
                             <div className="w-full h-px bg-gray-100 dark:bg-slate-700"></div>
                             <div className="flex justify-between items-center">
                                 <span className={`text-sm font-medium flex items-center gap-2 ${isDarkMode?'text-slate-300':'text-gray-600'}`}><span className="w-3 h-3 rounded-full bg-blue-100"></span> Dự kiến tuần tới</span>
                                 <span className="font-bold text-lg text-gray-400">4</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* CARD 2: RỦI RO (Màu đỏ - Chẩn đoán) */}
                <div className={card3DStyle(isDarkMode)}>
                    <h3 className={`text-lg font-bold mb-6 ${isDarkMode?'text-white':'text-gray-800'}`}>Ca nguy cơ cao (Từ Chẩn đoán)</h3>
                    <div className="flex items-center gap-8">
                        {/* Biểu đồ */}
                        <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData2} cy={90} innerRadius={60} outerRadius={80} startAngle={180} endAngle={0} dataKey="value" paddingAngle={5}>
                                        <Cell fill="#ef4444" className="drop-shadow-xl" /> {/* Đỏ */}
                                        <Cell fill={isDarkMode ? "#334155" : "#e5e7eb"} />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-20 inset-x-0 text-center -mt-3">
                                <span className={`text-5xl font-black block ${isDarkMode?'text-white':'text-slate-800'}`}>
                                    {Math.round(stats.diagnosisCount * 0.3)} 
                                </span>
                                <span className="text-xs text-gray-400 font-bold uppercase">Ca</span>
                            </div>
                        </div>

                        {/* Chú thích */}
                        <div className="flex-1 space-y-4">
                             <div className="flex justify-between items-center">
                                 <span className={`text-sm font-medium flex items-center gap-2 ${isDarkMode?'text-slate-300':'text-gray-600'}`}><span className="w-3 h-3 rounded-full bg-red-500"></span> Mức độ nặng</span>
                                 <span className="font-bold text-lg text-red-500">{Math.round(stats.diagnosisCount * 0.3)}</span>
                             </div>
                             <div className="w-full h-px bg-gray-100 dark:bg-slate-700"></div>
                             <div className="flex justify-between items-center">
                                 <span className={`text-sm font-medium flex items-center gap-2 ${isDarkMode?'text-slate-300':'text-gray-600'}`}><span className="w-3 h-3 rounded-full bg-gray-300"></span> Đã xử lý</span>
                                 <span className="font-bold text-lg text-green-500">5</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ROW 2: GANTT CHART (TIMELINE BỆNH NHÂN) VÀ ALERTS --- */}
            <div className="grid grid-cols-12 gap-8">
                
                {/* 2.1 TIMELINE (9 Phần) - GIẢ LẬP VÌ BACKEND CHƯA CÓ API TIMELINE */}
                <div className={`col-span-12 lg:col-span-8 ${card3DStyle(isDarkMode)} !p-8`}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className={`text-xl font-extrabold ${isDarkMode?'text-white':'text-gray-800'}`}>Lịch trình Hoạt động</h3>
                        
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-blue-500 shadow-sm"></div> Scan AI</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-purple-500 shadow-sm"></div> Tư vấn</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-gray-400 shadow-sm"></div> Nghỉ</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {/* Header giờ */}
                        <div className="flex ml-[150px] min-w-[500px] text-xs font-bold text-gray-400 border-b border-dashed pb-3 mb-4">
                            {[8,9,10,11,12,13,14,15,16].map(h => (
                                <div key={h} className="flex-1 border-l border-dashed border-gray-200 pl-1">{h}:00</div>
                            ))}
                        </div>
                        
                        {/* Rows */}
                        <div className="space-y-4 min-w-[500px]">
                            {[
                                { name: 'Nguyễn Văn A', task: {start: 1, width: 3, color: 'bg-blue-500', title: 'Scan Võng mạc'} },
                                { name: 'Trần Thị B', task: {start: 4, width: 1, color: 'bg-purple-500', title: 'Tư vấn'} },
                                { name: 'Lê Văn C', task: {start: 2, width: 4, color: 'bg-blue-600', title: 'Phẫu thuật'} },
                                { name: 'Phạm Dũng', task: {start: 0, width: 2, color: 'bg-gray-400', title: 'Xét nghiệm'} },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center h-12 group">
                                    {/* Tên */}
                                    <div className="w-[150px] flex items-center gap-3 pr-4 border-r border-gray-100">
                                        <img src={`https://ui-avatars.com/api/?name=${item.name}&background=random`} className="w-8 h-8 rounded-full shadow-sm"/>
                                        <span className={`text-xs font-bold truncate ${isDarkMode?'text-gray-300':'text-gray-700'}`}>{item.name}</span>
                                    </div>
                                    {/* Thanh */}
                                    <div className="flex-1 h-full relative px-2 bg-gray-50/50 rounded-r-xl group-hover:bg-blue-50/30 transition-colors">
                                        {[0,1,2,3,4,5,6,7].map(k => <div key={k} className="absolute h-full w-px bg-gray-200 dashed" style={{left: `${k * 12.5}%`}}></div>)}
                                        <div 
                                            className={`absolute top-2 bottom-2 rounded-lg shadow-md ${item.task.color} flex items-center px-3 text-[10px] font-bold text-white whitespace-nowrap cursor-pointer hover:scale-105 transition-transform`}
                                            style={{ left: `${item.task.start * 12.5}%`, width: `${item.task.width * 12.5}%` }}
                                        >
                                            {item.task.title}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2.2 RIGHT COLUMN (ALERTS & TEAM) (3 Phần) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    
                    {/* IMPORTANT ALERTS CARD */}
                    <div className={card3DStyle(isDarkMode)}>
                         <h3 className={`font-bold text-lg mb-6 ${isDarkMode?'text-white':'text-gray-800'}`}>Thông báo Quan trọng</h3>
                         <div className="space-y-4">
                            {/* Alert 1 */}
                            <div className={`p-4 rounded-2xl border-l-4 border-red-500 ${isDarkMode?'bg-slate-800':'bg-red-50'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0"/>
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode?'text-white':'text-gray-800'}`}>Cảnh báo Bệnh nhân #P012</p>
                                        <p className="text-xs text-gray-500 mt-1">Chỉ số DR tăng cấp độ 3. Cần can thiệp ngay.</p>
                                        <span className="text-[10px] text-gray-400 font-mono mt-2 block">10 mins ago</span>
                                    </div>
                                </div>
                            </div>
                            {/* Alert 2 */}
                            <div className={`p-4 rounded-2xl border-l-4 border-indigo-500 ${isDarkMode?'bg-slate-800':'bg-indigo-50'}`}>
                                <div className="flex items-start gap-3">
                                    <Info size={20} className="text-indigo-500 mt-0.5 shrink-0"/>
                                    <div>
                                        <p className={`text-sm font-bold ${isDarkMode?'text-white':'text-gray-800'}`}>Bảo trì máy Scan AI</p>
                                        <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ update vào lúc 12:00 PM.</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* TEAM AVAILABILITY */}
                    <div className={card3DStyle(isDarkMode)}>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className={`font-bold text-lg ${isDarkMode?'text-white':'text-gray-800'}`}>Nhân sự Trực</h3>
                            <Filter size={16} className="text-gray-400"/>
                         </div>
                         <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://ui-avatars.com/api/?name=Dr+${i}&background=random`} className="w-10 h-10 rounded-2xl shadow-sm group-hover:scale-110 transition-transform" alt=""/>
                                        <div>
                                            <p className={`text-sm font-bold ${isDarkMode?'text-white':'text-gray-800'}`}>Dr. Alex</p>
                                            <p className="text-[10px] text-gray-400">Chuyên khoa mắt</p>
                                        </div>
                                    </div>
                                    <button className="bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-blue-600"><Phone size={14}/></button>
                                </div>
                            ))}
                         </div>
                    </div>

                </div>
            </div>

            {/* === MODAL EDIT PROFILE === */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold dark:text-white">Cập nhật thông tin</h2>
                            <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="dark:text-white"/></button>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Tên hiển thị</label>
                                <input 
                                    type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 ring-blue-500 dark:text-white font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Chức vụ</label>
                                <input 
                                    type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 ring-blue-500 dark:text-white"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-500 mb-1">Email</label>
                                <input 
                                    type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 ring-blue-500 dark:text-white"
                                />
                            </div>
                            
                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
                                Lưu Thay Đổi
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;