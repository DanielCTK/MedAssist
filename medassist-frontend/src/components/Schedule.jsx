// FILE: src/components/Schedule.jsx
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, MoreHorizontal } from 'lucide-react';

// Dữ liệu giả lập bệnh nhân & tác vụ
const doctors = [
    { id: 1, name: "Nguyễn Văn An", specialty: "Tái khám Mắt", img: "https://ui-avatars.com/api/?name=N+A&bg=e0f2fe&color=0ea5e9" },
    { id: 2, name: "Trần Thị B", specialty: "Tiểu đường", img: "https://ui-avatars.com/api/?name=T+B&bg=fdf2f8&color=db2777" },
    { id: 3, name: "Lê Cường", specialty: "Phẫu thuật", img: "https://ui-avatars.com/api/?name=L+C&bg=f0fdf4&color=16a34a" },
    { id: 4, name: "Phạm Dũng", specialty: "Hội chẩn", img: "https://ui-avatars.com/api/?name=P+D&bg=fff7ed&color=ea580c" },
];

const tasks = [
    { docId: 1, title: "Scan Võng Mạc", start: 9, duration: 2, type: "blue" },
    { docId: 1, title: "Tư vấn KQ", start: 13, duration: 1, type: "purple" },
    { docId: 2, title: "XN Máu", start: 8.5, duration: 1.5, type: "orange" },
    { docId: 2, title: "Soi Đáy Mắt", start: 11, duration: 2, type: "indigo" },
    { docId: 3, title: "Phẫu thuật", start: 10, duration: 3, type: "blue" }, // Blue đậm = Surgery
    { docId: 4, title: "Hội chẩn khoa", start: 14, duration: 1.5, type: "gray" },
];

const TYPE_COLORS = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
};

const Schedule = () => {
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in">
            
            {/* Header Controls */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Lịch trình Bệnh nhân</h1>
                    <p className="text-slate-500 text-sm">Quản lý khung giờ khám & điều trị hôm nay.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ChevronLeft size={18}/></button>
                        <span className="px-4 font-bold text-sm text-slate-700">03 Tháng 04, 2025</span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><ChevronRight size={18}/></button>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                        <Plus size={18}/> Thêm lịch
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Phẫu thuật</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Soi đáy mắt</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Tư vấn</div>
                <button className="ml-auto text-slate-400 hover:text-slate-600"><Filter size={18}/></button>
            </div>

            {/* GANTT CHART / TIMELINE */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                
                {/* Timeline Header (Giờ) */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <div className="w-64 p-4 font-bold text-xs text-slate-400 uppercase tracking-wide">Bệnh nhân</div>
                    <div className="flex-1 grid grid-cols-9">
                        {hours.map(h => (
                            <div key={h} className="p-4 border-l border-dashed border-gray-200 text-xs font-bold text-slate-400 text-center">
                                {h}:00
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Rows */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {doctors.map((patient) => (
                        <div key={patient.id} className="flex border-b border-gray-50 group hover:bg-blue-50/30 transition-colors h-20 relative">
                            
                            {/* Patient Info Col */}
                            <div className="w-64 p-4 flex items-center gap-3 border-r border-dashed border-gray-200 bg-white z-10 sticky left-0 group-hover:bg-blue-50/10">
                                <img src={patient.img} className="w-10 h-10 rounded-full shadow-sm" alt=""/>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">{patient.name}</h4>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase">{patient.specialty}</p>
                                </div>
                                <button className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition"><MoreHorizontal size={16}/></button>
                            </div>

                            {/* Timeline Bar Area */}
                            <div className="flex-1 relative">
                                {/* Grid Lines Background */}
                                <div className="absolute inset-0 grid grid-cols-9 pointer-events-none">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="border-l border-dashed border-gray-100 h-full"></div>
                                    ))}
                                </div>

                                {/* Render Tasks */}
                                {tasks.filter(t => t.docId === patient.id).map((task, idx) => {
                                    // Tính toán vị trí và độ rộng (8h = 0%)
                                    const startPercent = ((task.start - 8) / 9) * 100;
                                    const widthPercent = (task.duration / 9) * 100;
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-xl border-l-4 shadow-sm px-3 flex items-center cursor-pointer hover:scale-[1.02] transition-transform z-20 text-xs font-bold whitespace-nowrap overflow-hidden ${TYPE_COLORS[task.type] || TYPE_COLORS.gray}`}
                                            style={{ 
                                                left: `${startPercent}%`, 
                                                width: `${widthPercent}%`,
                                                marginLeft: '4px', // gap
                                                marginRight: '4px'
                                            }}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    
                    {/* Current Time Indicator Line (Optional - Just for visuals) */}
                    <div className="absolute top-12 bottom-0 w-0.5 bg-red-400 left-[40%] z-30 pointer-events-none opacity-50">
                        <div className="absolute -top-1 -left-[3px] w-2 h-2 bg-red-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;