// FILE: src/components/ChatbotWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Xin chào Bs. Nicholls! Tôi là trợ lý AI MedAssist. Tôi có thể hỗ trợ gì cho việc chẩn đoán hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // GIẢ LẬP GỌI API AI (Sau này nối với n8n/Gemini ở đây)
        setTimeout(() => {
            const botReply = { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: 'Dựa trên hướng dẫn lâm sàng mới nhất, với trường hợp DR Cấp độ 2, khuyến nghị kiểm soát đường huyết chặt chẽ và tái khám sau 3 tháng. Bạn có muốn tôi lên lịch nhắc nhở không?' 
            };
            setMessages(prev => [...prev, botReply]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
            {/* CỬA SỔ CHAT */}
            <div className={`
                bg-white rounded-2xl shadow-2xl mb-4 w-80 sm:w-96 overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right
                ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}
            `}>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#4361ee] to-[#3a0ca3] p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-full"><Bot size={20} /></div>
                        <div>
                            <h4 className="font-bold text-sm">MedAssist AI Assistant</h4>
                            <p className="text-[10px] text-blue-200 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition"><X size={18}/></button>
                </div>

                {/* Body Messages */}
                <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                                ${msg.type === 'user' 
                                    ? 'bg-[#4361ee] text-white rounded-tr-none shadow-md' 
                                    : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none shadow-sm'}
                            `}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full text-xs rounded-tl-none">Đang nhập...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                            placeholder="Hỏi bất cứ điều gì..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="text-[#4361ee] hover:scale-110 transition-transform"><Send size={18}/></button>
                    </div>
                </div>
            </div>

            {/* NÚT BẬT/TẮT */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-[#4361ee] text-white rounded-full shadow-lg hover:bg-[#3a0ca3] transition-all duration-300 hover:scale-110 flex justify-center items-center group"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} className="animate-bounce-slow"/>}
                
                {/* Tooltip khi chưa mở */}
                {!isOpen && (
                    <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded-xl text-xs font-bold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Hỏi AI ngay!
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;