// FILE: src/components/Sidebar.jsx
import React from 'react';
import { Home, Users, Activity, Calendar, MessageSquare, Settings, LogOut, Stethoscope, Pill } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
    const menuItems = [
        { id: 'home', icon: <Home size={22} />, label: 'Tổng quan' },
        { id: 'patients', icon: <Users size={22} />, label: 'Danh sách Bệnh nhân' },
        { id: 'diagnosis', icon: <Activity size={22} />, label: 'Công cụ Chẩn đoán' },
        // Bạn có thể thêm các item khác nếu cần
        // { id: 'calendar', icon: <Calendar size={22} />, label: 'Lịch làm việc' },
        // { id: 'messages', icon: <MessageSquare size={22} />, label: 'Tin nhắn' },
        { id: 'pharmacy', icon: <Pill size={22} />, label: 'Kê đơn & Dược' },
        { id: 'calendar', icon: <Calendar size={22} />, label: 'Lịch trình' },
    ];

    return (
        <div 
            className="
                h-screen bg-[#4361ee] fixed left-0 top-0 z-50
                flex flex-col py-8 rounded-r-[2.5rem] shadow-2xl
                
                /* --- ANIMATION WIDTH (CỐT LÕI) --- */
                w-24 hover:w-72
                transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                group /* 'group' dùng để kích hoạt hiệu ứng con khi hover vào cha */
            "
        >
            
            {/* --- LOGO --- */}
            <div className="flex items-center px-6 mb-10 min-h-[50px] overflow-hidden whitespace-nowrap">
                <div className="min-w-[48px] h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    {/* Icon logo */}
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/3304/3304555.png" 
                        alt="Logo" 
                        className="w-7 h-7 drop-shadow-md" 
                    />
                </div>
                
                {/* Tên App (chỉ hiện khi Hover) */}
                <div className="ml-4 text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-20px] group-hover:translate-x-0 delay-75">
                    MedAssist
                </div>
            </div>

            {/* --- NAVIGATION ITEMS --- */}
            <nav className="flex-1 flex flex-col gap-3 px-4 overflow-hidden">
                {menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`
                                relative flex items-center h-14 rounded-2xl px-4
                                transition-all duration-300 whitespace-nowrap
                                ${isActive 
                                    ? 'bg-white text-[#4361ee] shadow-lg translate-x-1' 
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }
                            `}
                        >
                            {/* Icon luôn cố định vị trí */}
                            <div className="min-w-[24px] flex justify-center">
                                {item.icon}
                            </div>

                            {/* Label (Bay ra khi Hover) */}
                            <span className={`
                                ml-4 font-medium text-sm
                                opacity-0 group-hover:opacity-100
                                translate-x-[-10px] group-hover:translate-x-0
                                transition-all duration-300
                                ${isActive ? 'font-bold' : ''}
                            `}>
                                {item.label}
                            </span>

                            {/* Dấu chấm chỉ báo khi Active (chỉ hiện khi sidebar đóng để người dùng biết đang chọn cái nào) */}
                            {isActive && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#4361ee] group-hover:hidden"></div>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* --- BOTTOM ACTIONS --- */}
            <div className="mt-auto px-4 space-y-2">
                <button className="w-full flex items-center h-14 px-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap overflow-hidden">
                    <div className="min-w-[24px] flex justify-center"><Settings size={22} /></div>
                    <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cài đặt</span>
                </button>

                <button 
                    onClick={onLogout}
                    className="w-full flex items-center h-14 px-4 rounded-2xl text-red-200 bg-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-300 whitespace-nowrap overflow-hidden"
                >
                    <div className="min-w-[24px] flex justify-center"><LogOut size={22} /></div>
                    <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;