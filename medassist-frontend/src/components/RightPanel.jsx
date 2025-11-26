// FILE: src/components/RightPanel.jsx
import React from 'react';
import { Calendar, MoreHorizontal, Clock } from 'lucide-react';

const RightPanel = ({ user }) => {
    const schedule = [
        { time: '09:00 AM', title: 'Họp Khoa Mắt', tag: 'Họp', color: 'bg-purple-100 text-purple-600' },
        { time: '10:30 AM', title: 'Tái khám: Nguyễn Văn A', tag: 'Khám', color: 'bg-blue-100 text-blue-600' },
        { time: '02:00 PM', title: 'Phẫu thuật Lasik', tag: 'Phẫu thuật', color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div className="w-80 bg-white h-full border-l border-gray-100 hidden xl:flex flex-col fixed right-0 top-0 shadow-xl z-40">
            
            {/* Header Profile Card */}
            <div className="p-8 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Hồ sơ</h3>
                    <button className="text-gray-400 hover:text-indigo-600"><MoreHorizontal size={20}/></button>
                </div>

                <div className="bg-[#f8f9fc] p-6 rounded-[2rem] text-center border border-gray-100">
                    {/* 🟢 6. CHỖ ĐỂ ẢNH: AVATAR BÁC SĨ */}
                    <div className="relative inline-block">
                        <img 
                            src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg" 
                            alt="Doctor Avatar" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                        />
                        <div className="absolute bottom-2 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <h4 className="text-xl font-extrabold text-gray-800">{user?.name || "Dr. Alex"}</h4>
                    <p className="text-indigo-500 text-sm font-medium mb-4">Chuyên khoa Mắt</p>
                    
                    <div className="flex justify-center gap-4">
                        <div className="text-center">
                            <span className="block font-bold text-gray-800 text-lg">24</span>
                            <span className="text-xs text-gray-400 uppercase">Tuổi</span>
                        </div>
                        <div className="w-[1px] bg-gray-200 h-8"></div>
                        <div className="text-center">
                            <span className="block font-bold text-gray-800 text-lg">A+</span>
                            <span className="text-xs text-gray-400 uppercase">Máu</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="px-8 flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-indigo-500"/> Lịch trình hôm nay
                </h3>

                <div className="space-y-6">
                    {schedule.map((item, idx) => (
                        <div key={idx} className="flex gap-4 group cursor-pointer">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-indigo-500 transition-colors"></div>
                                <div className="w-[1px] bg-gray-200 h-full mt-1 group-last:hidden"></div>
                            </div>
                            <div className="pb-4 flex-1">
                                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mb-1">
                                    <Clock size={12}/> {item.time}
                                </span>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all">
                                    <h5 className="font-bold text-gray-700 text-sm mb-2">{item.title}</h5>
                                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide ${item.color}`}>
                                        {item.tag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightPanel;