// FILE: src/App.jsx (PHIÊN BẢN HOÀN CHỈNH VỚI HIỆU ỨNG TRƯỢT)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fontsource/inter';

import { 
    Mail, Lock, Eye, EyeOff, User, Apple, Chrome, Facebook, 
    Phone, MapPin, UserCircle, Briefcase, ChevronRight,
    Home, Info, Stethoscope, MessageSquare, ArrowLeft // 🔥 Đã thêm ArrowLeft
} from 'lucide-react';

// === IMPORT NEW COMPONENTS AND DATA ===
import MainDashboard from './components/MainDashboard'; 
import ArticleCard from './components/ArticleCard'; 
import { ARTICLES, CONTACT_INFO } from './constants/ArticleData.js'; 

// === IMPORT STATIC ASSETS ===
import pageBgImage from './assets/747af4250dd56f8047edc8a9c72a0131.gif';
import loginBgImage from './assets/71e4482d08fecd57c2635d210a8b076c.gif';
//ảnh slide
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

// Import hình ảnh của bạn từ thư mục assets
import galleryImage1 from './assets/6a327caa4b5c102de396a1c3aaa20e98.gif'; 
import galleryImage2 from './assets/8852467-hd_1080_1920_30fps.gif';
import galleryImage3 from './assets/5995131-hd_1080_1920_30fps.gif'; 

// Define Backend API URL
const API_BASE_URL = 'https://medassistapi.onrender.com/api';

// ----------------------------------------------------
// === COMPONENT: APP HEADER ===
// ----------------------------------------------------
const AppHeader = () => {
    return (
        <header className="w-full max-w-7xl bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-4 mb-4">
            <nav className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Stethoscope size={28} className="text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">MedAssist</span>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    <a href="#top" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                        <Home size={16} /> Trang chủ
                    </a>
                    <a href="#gioi-thieu" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                        <Info size={16} /> Giới thiệu
                    </a>
                    <a href="#lien-he" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                        <MessageSquare size={16} /> Liên hệ
                    </a>
                </div>
            </nav>
        </header>
    );
}

// ----------------------------------------------------
// === COMPONENT: APP CHÍNH ===
// ----------------------------------------------------
export default function App() {

    const [message, setMessage] = useState({ type: '', content: '' });
    const [currentSlide, setCurrentSlide] = useState(0);

    const galleryItems = [
        { src: galleryImage1, alt: 'Mô tả ảnh 1', legend: 'Tính năng Phân tích Chi tiết' },
        { src: galleryImage2, alt: 'Mô tả ảnh 2', legend: 'Giao diện Báo cáo Thân thiện' },
        { src: galleryImage3, alt: 'Mô tả ảnh 3', legend: 'Tích hợp AI Tiên tiến' }
    ];

    // === STATE MANAGEMENT ===
    const [token, setToken] = useState(localStorage.getItem('medassist_token') || null);
    const [user, setUser] = useState(null); 
    
    // UI state
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // 🔥 STATE MỚI: Kiểm soát hiệu ứng trượt (false = hiện ảnh bìa, true = hiện form)
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, []);

    // === HANDLERS ===
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setMessage({ type: '', content: '' }); 
        setFormData({ name: '', email: '', password: '' }); 
    };

    const handleLogout = () => {
        setToken(null); setUser(null); localStorage.removeItem('medassist_token'); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setMessage({ type: '', content: '' });

        const endpoint = isLoginView ? '/auth/login' : '/auth/register';
        const url = `${API_BASE_URL}${endpoint}`;
        
        const payload = isLoginView 
            ? { email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password, name: formData.name };

        try {
            const response = await axios.post(url, payload);
            setToken(response.data.token);
            setUser(response.data.user); 
            localStorage.setItem('medassist_token', response.data.token); 
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Lỗi không xác định. Vui lòng thử lại.';
            setMessage({ type: 'error', content: errorMsg });
            setToken(null); setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // === MAIN RENDER LOGIC ===

    if (token) {
        return <MainDashboard onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen bg-cover bg-center font-sans flex flex-col p-4"
            style={{ backgroundImage: `url(${pageBgImage})` }}>
            
            <div className="flex-1 flex flex-col items-center justify-start">
                
                <AppHeader />

                {/* KHUNG LOGIN */}
                <div id="top" className="w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md bg-opacity-95 mb-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 relative h-[600px]"> 

                        {/* Cột 1: Hình ảnh trang trí bên trái (40%) - Cố định */}
                        <div 
                            className="hidden lg:flex lg:col-span-2 flex-col justify-center items-center p-4 text-white relative overflow-hidden" 
                            style={{ 
                                backgroundImage: `url(${loginBgImage})`, 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center',
                                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)', 
                                height: '100%',
                            }}
                        >
                            <div className="absolute inset-0 bg-white opacity-0 "></div> 
                            <div className="relative z-10 text-center pt-64">
                                <h1 className="text-3xl font-extrabold mb-2 mt-16">MedAssist</h1>
                                <p className="text-sm font-light">Chẩn đoán võng mạc tiểu đường bằng AI.</p>
                            </div>
                        </div>

                        {/* Cột 2: Form Đăng nhập/Đăng ký (60%) - CÓ HIỆU ỨNG TRƯỢT */}
                        <div 
                            className="lg:col-span-3 w-full relative z-10 h-full"
                            style={{
                                background: 'rgba(255, 255, 255, 0.75)',
                                clipPath: 'polygon(7% 0, 100% 0, 100% 100%, 0% 100%)', 
                            }}
                        >
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                
                                {/* ================================================== */}
                                {/* LỚP 1: FORM ĐĂNG NHẬP (NẰM DƯỚI)                   */}
                                {/* ================================================== */}
                                <div className={`
                                    absolute inset-0 flex flex-col justify-center items-center p-4 md:p-6
                                    transition-opacity duration-500 ease-in-out
                                    ${showForm ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
                                `}>
                                    <div className="w-full max-w-md text-left relative">
                                        
                                        {/* Nút Quay Lại */}
                                        <button 
                                            onClick={() => setShowForm(false)}
                                            className="mb-4 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium"
                                        >
                                            <ArrowLeft size={18} /> Quay lại
                                        </button>

                                        <h2 className="text-4xl font-Open_Sans font-bold text-blue-600 mb-2">
                                            {isLoginView ? 'Login ' : 'Tạo tài khoản mới'}
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-6">
                                            {isLoginView ? 'Bạn chưa có tài khoản?' : 'Đã có tài khoản?'}
                                            <span onClick={toggleView} className="ml-1 font-semibold text-blue-600 cursor-pointer hover:underline">
                                                {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
                                            </span>
                                        </p>

                                        {/* Form Logic Giữ Nguyên */}
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {!isLoginView && (
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                    <input name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Họ và Tên" className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                </div>
                                            )}
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="Email" autoComplete="email" className="w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} required minLength="6" placeholder="Mật khẩu" autoComplete={isLoginView ? 'current-password' : 'new-password'} className="w-full pl-10 pr-10 py-3 text-gray-900 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </div>
                                            </div>

                                            {message.content && (
                                                <div className={`p-3 text-center rounded-lg text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                                                    {message.content}
                                                </div>
                                            )}

                                            <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 shadow-md hover:shadow-lg">
                                                {isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}
                                            </button>
                                        </form>

                                        {/* Social Login */}
                                        <div className="flex items-center my-6">
                                            <hr className="flex-grow border-gray-300" />
                                            <span className="mx-4 text-sm font-medium text-gray-400">Hoặc tiếp tục với</span>
                                            <hr className="flex-grow border-gray-300" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"><Chrome size={20} /> Google</button>
                                            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"><Facebook size={20} /> Facebook</button>
                                        </div>
                                    </div>
                                </div>

                            {/* ================================================== */}
                            {/* LỚP 2: ẢNH BÌA TRƯỢT (NẰM TRÊN) - PHIÊN BẢN "CLEAN" */}
                            {/* ================================================== */}
                            <div 
                                className={`
                                    absolute inset-0 z-20 flex flex-col 
                                    transition-transform duration-700 ease-in-out
                                    ${showForm ? '-translate-y-full' : 'translate-y-0'} 
                                `}
                                style={{ 
                                    // Dùng chính ảnh pageBgImage mà bạn đã import ở đầu file
                                    backgroundImage: `url(${pageBgImage})`, 
                                    backgroundSize: 'cover', 
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Lớp phủ mờ nhẹ nếu muốn ảnh tối đi chút (tùy chọn, có thể xóa) */}
                                <div className="absolute inset-0 bg-black/10"></div>

                                {/* 🔥 NÚT KÍCH HOẠT NẰM Ở GÓC DƯỚI PHẢI */}
                                <div className="absolute bottom-8 right-8 z-30">
                                    <button 
                                        onClick={() => setShowForm(true)}
                                        className="
                                            group flex items-center gap-3 px-6 py-3 
                                            bg-white/90 backdrop-blur-sm 
                                            text-blue-900 font-bold rounded-xl 
                                            shadow-2xl hover:shadow-blue-500/50 hover:bg-white
                                            transition-all duration-300 hover:-translate-y-1
                                            border border-white/50
                                        "
                                    >
                                        <span>Đăng nhập / Đăng ký</span>
                                        <div className="bg-blue-100 p-1.5 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <ChevronRight size={20} className="text-blue-700" />
                                        </div>
                                    </button>
                                </div>

                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                
               {/* === PHẦN DƯỚI: CHỨA 2 KHUNG NỘI DUNG === */}
               <div className="flex-1 w-full max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Cột 1: Bài báo */}
                    <div className="bg-white/70 rounded-3xl shadow-2xl p-8 md:p-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">📰 Thông Tin Y Tế Mới Nhất</h3>
                        <p className="text-gray-600 mb-6">Tham khảo các thông tin uy tín về Sàng lọc Võng mạc Tiểu đường trước khi bắt đầu.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ARTICLES.map(article => (
                                <ArticleCard key={article.id} {...article} />
                            ))}
                        </div>
                        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-xl shadow-inner">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-bold text-blue-800">Sàng lọc sớm, Bảo vệ thị lực.</h4>
                                <ChevronRight size={24} className="text-blue-600"/>
                            </div>
                            <p className="text-gray-700 mt-2 text-sm">
                                MedAssist AI hỗ trợ chẩn đoán nhanh chóng dựa trên mô hình học sâu, giúp bác sĩ đưa ra quyết định kịp thời.
                            </p>
                        </div>
                    </div>

                    {/* Cột 2: Carousel */}
                    <div className="bg-white/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-center items-center text-center">
                        <div className="w-full">
                            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showStatus={false} showArrows={false} className="w-full h-100" selectedItem={currentSlide} onChange={(index) => setCurrentSlide(index)} onClickItem={() => setCurrentSlide((prev) => (prev + 1) % galleryItems.length)}>
                                {galleryItems.map((item, index) => (
                                <div key={index} className="h-full">
                                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                                    <p className="legend">{item.legend}</p>
                                </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="p-8 md:p-10 text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">✨ Khám Phá Nền Tảng MedAssist</h3>
                            <p className="text-gray-600">
                                Trải nghiệm công nghệ chẩn đoán hình ảnh y tế hiện đại, được hỗ trợ bởi trí tuệ nhân tạo để mang lại kết quả nhanh chóng và chính xác.
                            </p>
                        </div>
                    </div>
                </div> 

                {/* === GIỚI THIỆU VÀ FOOTER === */}
                <div id="gioi-thieu" className="w-full max-w-screen-xl mx-auto mt-12 bg-white rounded-3xl shadow-2xl p-8 md:p-10"> 
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">🩺 Về MedAssist AI</h3>
                    <p className="text-gray-600 mb-4">MedAssist là nền tảng tiên phong trong việc ứng dụng công nghệ học sâu (Deep Learning) vào chẩn đoán bệnh lý võng mạc tiểu đường...</p>
                    <p className="text-sm italic text-gray-500">Công nghệ AI của chúng tôi đã được đào tạo trên hàng triệu hình ảnh võng mạc...</p>
                </div>

            </div>
            
            <footer id="lien-he" className="w-full max-w-7xl mx-auto mt-6 p-4 text-sm text-gray-800 bg-white rounded-xl shadow-lg border-t-4 border-blue-500">
                <div className="text-center mb-3">
                    <h5 className="text-lg font-bold text-blue-600">LIÊN HỆ HỖ TRỢ KỸ THUẬT & CHUYÊN MÔN</h5>
                    <p className="text-gray-500">Vui lòng liên hệ với nhóm hỗ trợ khi bạn có bất kỳ thắc mắc nào về hệ thống hoặc thông tin y tế.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-x-8 gap-y-2 py-2">
                    <div className="flex items-center gap-2 font-medium text-gray-700 p-1 border border-gray-100 rounded-lg"><UserCircle size={18} className="text-blue-600 flex-shrink-0" /><span className='mr-1'>{CONTACT_INFO.creatorName}</span><span className="text-xs text-white bg-blue-500 p-1 rounded-full px-2">{CONTACT_INFO.creatorRole}</span></div>
                    <div className="flex items-center gap-2 p-1 border border-gray-100 rounded-lg"><Mail size={18} className="text-blue-600 flex-shrink-0" /><a href={`mailto:${CONTACT_INFO.supportEmail}`} className="hover:underline font-semibold text-gray-700">{CONTACT_INFO.supportEmail}</a></div>
                    <div className="flex items-center gap-2 p-1 border border-gray-100 rounded-lg"><Phone size={18} className="text-blue-600 flex-shrink-0" /><span className="font-semibold text-green-600">{CONTACT_INFO.hotline}</span></div>
                    <div className="flex items-center gap-2 p-1 border border-gray-100 rounded-lg"><MapPin size={18} className="text-blue-600 flex-shrink-0" /><span className="text-gray-600">{CONTACT_INFO.address}</span></div>
                </div>
            </footer>
        </div>
    );
}