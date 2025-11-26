// FILE: src/components/AddPatientModal.jsx
import React, { useState } from 'react';
import { User, Calendar, Phone, Mail, X, Upload } from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        phone: '', // Mới
        email: '', // Mới
        gender: 'Nam'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.dob) {
            setError('Họ tên và ngày sinh là bắt buộc.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        // Gửi toàn bộ formData lên component cha
        await onPatientAdded(formData); 
        setIsLoading(false);
        // Reset form (tuỳ chọn)
        setFormData({ name: '', dob: '', phone: '', email: '', gender: 'Nam' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden">
                {/* Header */}
                <div className="bg-[#4361ee] p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">Thêm Hồ Sơ Mới</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Ảnh đại diện (Giả lập UI) */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-blue-50 overflow-hidden flex items-center justify-center text-gray-400">
                                <User size={40} />
                            </div>
                            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Họ tên */}
                        <div className="relative col-span-2">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Họ và Tên bệnh nhân" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        {/* Ngày sinh */}
                        <div className="relative">
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        {/* Giới tính */}
                        <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        {/* Phone (Zalo) */}
                        <div className="relative col-span-2">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại (Zalo)" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        {/* Email */}
                        <div className="relative col-span-2">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email liên hệ" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors">Hủy bỏ</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl text-white bg-[#4361ee] hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/30 transition-all transform active:scale-95">
                            {isLoading ? "Đang xử lý..." : "Lưu Hồ Sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;