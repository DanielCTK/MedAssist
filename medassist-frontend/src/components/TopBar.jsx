// FILE: src/components/TopBar.jsx
import React from 'react';
import { Home, Users, Activity, Calendar, Pill, LogOut, Sun, Moon, Settings, Stethoscope } from 'lucide-react';

const TopBar = ({ currentView, setCurrentView, onLogout, isDarkMode, toggleDarkMode, user, avatar }) => {
    
    const menuItems = [
        { id: 'home', icon: <Home size={18} />, label: 'Tổng quan' },
        { id: 'patients', icon: <Users size={18} />, label: 'Bệnh nhân' },
        { id: 'diagnosis', icon: <Activity size={18} />, label: 'Chẩn đoán' },
        { id: 'pharmacy', icon: <Pill size={18} />, label: 'Dược phẩm' },
    ];

    return (
        <div className={`
            h-16 w-full fixed top-0 left-0 z-50 flex items-center justify-between px-6 shadow-sm transition-colors duration-300
            ${isDarkMode ? 'bg-[#1e293b] border-b border-slate-700' : 'bg-white border-b border-gray-100'}
        `}>
            {/* 1. LOGO AREA */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Stethoscope className="text-white w-5 h-5" />
                </div>
                <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Med<span className="text-blue-500">Assist</span>
                </span>
            </div>

            {/* 2. NAVIGATION MENU (CENTER) - ĐÃ SỬA MÀU */}
            <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-gray-100/50 border border-gray-200/50 dark:bg-slate-800 dark:border-slate-700 transition-all shadow-inner">
                {menuItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`
                                relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out
                                ${isActive 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-1 ring-blue-500' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            {/* Icon với hiệu ứng nhẹ */}
                            <div className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                {item.icon}
                            </div>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* 3. RIGHT ACTIONS (User & Theme) */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-orange-50 text-orange-500 hover:bg-orange-100'}`}
                >
                    {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
                </button>

                {/* User Profile (Mini) */}
                <div className="flex items-center gap-3 pl-4 border-l dark:border-slate-700">
                    <div className="hidden lg:block text-right">
                        <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user?.name || "Doctor"}</p>
                        <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{user?.role || "Specialist"}</p>
                    </div>
                    <img 
                        src={avatar || "https://ui-avatars.com/api/?background=random"} 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900" 
                        alt="User" 
                    />
                </div>

                {/* Logout Button */}
                <button 
                    onClick={onLogout}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Đăng xuất"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;