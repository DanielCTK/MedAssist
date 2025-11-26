// FILE: src/components/PrescriptionModule.jsx

import React, { useState } from 'react';
import { Search, Plus, Minus, ShoppingBag, X, Pill, Syringe, Stethoscope, HeartPulse, CheckCircle, Sparkles } from 'lucide-react';

// --- ĐƯA COMPONENT ICON LÊN ĐẦU ---
const EyeIcon = ({size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;

// --- DỮ LIỆU (Bạn sẽ tự thay link ảnh ở trường 'img') ---
// LƯU Ý: Ảnh bạn tự tìm nên là ảnh dọc (Portrait) hoặc hình vuông thì lên khung sẽ đẹp nhất
const CATEGORIES = [
    { id: 'all', name: 'Toàn bộ', icon: <Sparkles size={18}/> },
    { id: 'general', name: 'Thuốc viên', icon: <Pill size={18} /> },
    { id: 'drops', name: 'Dung dịch', icon: <HeartPulse size={18} /> },
    { id: 'device', name: 'Thiết bị', icon: <Stethoscope size={18} /> },
];

const MEDICINES = [
    // Link ảnh đang là placeholder màu xám, khi bạn thay ảnh thật vào nó sẽ tự động tràn full ô
    { id: 1, name: "Panadol Extra", type: "general", price: "150.000đ", unit: "Hộp", img: "/assets2/panadol-extra1.jpg" },
    { id: 2, name: "Insulin Pen", type: "device", price: "450.000đ", unit: "Cây", img: "/assets2/insulin_pen.jpg" },
    { id: 3, name: "V-Rohto", type: "drops", price: "50.000đ", unit: "Chai", img: "/assets2/b0ecb7841dffad152900e610a4c9f4c1.jpg_720x720q80.jpg" },
    { id: 4, name: "Oximeter", type: "device", price: "220.000đ", unit: "Máy", img: "/assets2/707fdb95-1b65-490e-97b6-1c01928a998b.761ea7007be53a51b8027a7a24a469ab.webp" },
    { id: 5, name: "Mask N95", type: "device", price: "25.000đ", unit: "Cái", img: "/assets2/71imkuWDnqL.jpg" },
    { id: 6, name: "Vitamin C", type: "general", price: "80.000đ", unit: "Lọ", img: "/assets2/vitamin-c-lo-100-vien-dai-y-bo-sung-vitamin-b-64589e2b0ceac.jpg" },
    { id: 7, name: "Băng Cá Nhân", type: "device", price: "20.000đ", unit: "Hộp", img: "/assets2/bang-ca-nhan-urgo-transparent-2x72cm-thumb-1-2-600x600.jpg" },
    { id: 8, name: "Kháng Sinh", type: "general", price: "120.000đ", unit: "Vỉ", img: "/assets2/penicillin-v-kali-6391485a6b2ec.jpg" },
];

const PrescriptionModule = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]); 
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Filter logic
    const filteredMeds = MEDICINES.filter(med => 
        (activeCategory === 'all' || med.type === activeCategory) &&
        med.name.toLowerCase().includes(search.toLowerCase())
    );

    const addToPrescription = (med) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === med.id);
            return exists ? prev.map(i => i.id === med.id ? {...i, qty: i.qty + 1} : i) : [...prev, {...med, qty: 1}];
        });
        setIsCartOpen(true);
    };

    const decreaseQty = (id) => {
        setCart(prev => prev.map(i => i.id === id ? (i.qty > 1 ? {...i, qty: i.qty - 1} : null) : i).filter(Boolean));
    };

    return (
        <div className="p-8 max-w-[1800px] mx-auto min-h-screen animate-fade-in pb-32">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                        Kho Dược <span className="text-blue-600">Thông Minh</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Kê đơn thuốc trực quan & nhanh chóng.</p>
                </div>
                <div className="flex items-center bg-white dark:bg-slate-800 shadow-lg rounded-full px-6 py-3 w-full md:w-96 border border-gray-100 dark:border-slate-700">
                    <Search className="text-gray-400 mr-3"/>
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Tìm tên thuốc..." className="bg-transparent outline-none w-full dark:text-white"/>
                </div>
            </div>

            {/* CATEGORIES */}
            <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 border-2
                            ${activeCategory === cat.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 scale-105' 
                                : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-500'}
                        `}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {/* 🔥 GRID FULL BLEED - Ô TRÀN VIỀN 🔥 */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMeds.map((med, index) => {
                    const inCart = cart.find(i => i.id === med.id);
                    return (
                        <div 
                            key={med.id} 
                            className="group relative h-[350px] rounded-[30px] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-4 border-white dark:border-slate-700 bg-gray-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* 1. ẢNH NỀN (FULL 100% CONTAINER) */}
                            <img 
                                src={med.img} 
                                alt={med.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* 2. LỚP PHỦ ĐEN MỜ (Gradient) */}
                            {/* Giúp chữ màu trắng luôn đọc được trên mọi loại ảnh */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                            {/* 3. TAG LOẠI THUỐC (Góc trên phải) */}
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {med.type}
                            </div>

                            {/* 4. NỘI DUNG CHỮ & NÚT (Góc dưới) */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl font-black text-white mb-1 leading-tight">{med.name}</h3>
                                <p className="text-gray-300 text-sm font-medium mb-4">{med.unit} • <span className="text-green-400 font-bold">{med.price}</span></p>

                                {/* Nút thêm vào giỏ */}
                                <div className={`${inCart ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                                    {inCart ? (
                                        <div className="flex items-center bg-blue-600/90 backdrop-blur rounded-xl shadow-lg w-full justify-between px-2 py-1">
                                            <button onClick={(e) => {e.stopPropagation(); decreaseQty(med.id)}} className="p-2 text-white hover:bg-white/20 rounded-lg transition"><Minus size={18}/></button>
                                            <span className="font-bold text-white text-lg">{inCart.qty}</span>
                                            <button onClick={(e) => {e.stopPropagation(); addToPrescription(med)}} className="p-2 text-white hover:bg-white/20 rounded-lg transition"><Plus size={18}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); addToPrescription(med)}}
                                            className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Plus size={20}/> Kê đơn ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* --- FLOATING CART --- */}
            {cart.length > 0 && (
                <div className={`fixed bottom-28 right-6 z-40 flex flex-col items-end pointer-events-none ${isCartOpen?'pointer-events-auto':''}`}>
                    {isCartOpen && (
                        <div className="bg-white dark:bg-slate-900 w-80 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-700 p-6 mb-4 pointer-events-auto animate-slide-up">
                            <div className="flex justify-between items-center mb-4 border-b dark:border-slate-700 pb-3">
                                <h4 className="font-bold text-lg dark:text-white flex items-center gap-2"><Pill size={18} className="text-blue-500"/> Đơn thuốc</h4>
                                <button onClick={()=>setIsCartOpen(false)}><X className="dark:text-gray-400"/></button>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-3 mb-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800 p-3 rounded-xl">
                                        <div>
                                            <p className="font-bold text-sm dark:text-gray-200">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.qty} x {item.unit}</p>
                                        </div>
                                        <div className="font-mono font-bold text-blue-600 flex flex-col items-end gap-1">
                                            <span>{item.price}</span>
                                            <div className="flex gap-1">
                                                <button onClick={()=>decreaseQty(item.id)} className="bg-white p-1 rounded shadow text-red-500"><Minus size={10}/></button>
                                                <button onClick={()=>addToPrescription(item)} className="bg-white p-1 rounded shadow text-green-500"><Plus size={10}/></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={()=>alert('Kê đơn thành công!')} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-green-500/40 transition-shadow flex justify-center gap-2">
                                <CheckCircle size={18}/> Hoàn tất & In
                            </button>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="pointer-events-auto p-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-full shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform relative group"
                    >
                        <ShoppingBag size={28} className="animate-pulse"/>
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-sm">
                            {cart.length}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PrescriptionModule;