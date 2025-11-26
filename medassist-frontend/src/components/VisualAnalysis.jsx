// FILE: VisualAnalysis.jsx

import React, { useState } from 'react';
import { Eye, MousePointer, Pencil, Undo2, Aperture, Palette, Brush, Trash2, LassoSelect } from 'lucide-react'; 
import EyeModel3D from './EyeModel3D'; 

// --- 1. IMPORT MÔ HÌNH TỪ THƯ MỤC SRC ---
import modelSimplePath from '../models/eye_model.glb';
import modelDetailedPath from '../models/eye_model_detailed.glb';

// --- 2. CẤU HÌNH ---
const MODELS_CONFIG = {
  model1: { 
    name: "Mô hình Đơn giản (Low-poly)", 
    path: modelSimplePath, 
    isSimpleModel: true, 
    mainMeshNames: ['eyee_low_Mesh'], 
    glassMeshNames: ['glass_low_Mesh001'], 
    wireframeColors: { main: 0xFF00FF, glass: 0x00FFFF, fill: 0xAA00AA }
  },
  model2: { 
    name: "Mô hình Chi tiết (Y khoa)", 
    path: modelDetailedPath, 
    isSimpleModel: false, 
    retinaNames: ['Eye_CSReitna'], 
    choroidNames: ['Eye_CSChoroid_CS'], 
    scleraNames: ['Eye_CSScelra'], 
    glassNames: ['Eye_CSCornea_CS', 'Eye_CSLens', 'Eye_CSSuspensory_ligaments', 'Eye_CSuspensory_ligaments_L'], 
    otherNames: ['Eye_CSLateral_rectus', 'Eye_CSSuperior_inferior_rectus', 'Muscle_', 'Artery_', 'Vein_', 'Cylinder', 'Cube'], 
    wireframeColors: { retina: 0xFF0000, choroid: 0xFF8C00, sclera: 0xFFFFFF, glass: 0x00FFFF, other: 0x808080, fill: 0xFFFFE0 }
  }
};

const DRAW_COLORS = [
    { name: 'Problem', hex: '#E53E3E' }, { name: 'Annotation', hex: '#3B82F6' },
    { name: 'Highlight', hex: '#F59E0B' }, { name: 'Healthy', hex: '#10B981' },
    { name: 'Reference', hex: '#000000' }
];

const VisualAnalysis = ({ diagnosisData, isExpanded }) => {
    // --- SỬA LỖI TẠI ĐÂY ---
    // Tạo biến safeData để tránh lỗi khi diagnosisData bị null
    const safeData = diagnosisData || { label: "Chưa có dữ liệu", lesionData: [] };

    const [showCornea, setShowCornea] = useState(true); 
    // Lấy dữ liệu tổn thương từ safeData thay vì diagnosisData
    const lesionData = safeData.lesionData || []; 

    const [toolMode, setToolMode] = useState('navigate'); 
    const [drawColor, setDrawColor] = useState(DRAW_COLORS[0].hex);
    const [lineWidth, setLineWidth] = useState(3); 
    const [lines, setLines] = useState([]);
    const [activeModelKey, setActiveModelKey] = useState('model2');
    
    const currentModelConfig = MODELS_CONFIG[activeModelKey];

    const getToolButtonClass = (mode) => (
        `p-2 rounded-lg flex items-center gap-2 transition-colors ${
            toolMode === mode 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`
    );
    const handleUndo = () => { setLines(prevLines => prevLines.slice(0, -1)); };
    const handleClearAll = () => { if (window.confirm("Xóa tất cả các ghi chú đã vẽ?")) { setLines([]); }};

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                <Eye size={24} className="text-blue-500"/> Phân Tích Trực Quan (3D)
            </h2>
            
            {/* Thanh công cụ */}
            <div className="mb-4 p-3 bg-gray-100 rounded-xl flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-600 text-sm">Công cụ:</span>
                    <button className={getToolButtonClass('navigate')} onClick={() => setToolMode('navigate')} title="Di chuyển / Xoay / Thu phóng">
                        <MousePointer size={18} />
                    </button>
                    <button className={getToolButtonClass('draw')} onClick={() => setToolMode('draw')} title="Vẽ nét tự do">
                        <Pencil size={18} />
                    </button>
                    <button className={getToolButtonClass('region')} onClick={() => setToolMode('region')} title="Khoanh vùng (tự động nối điểm)">
                        <LassoSelect size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <Palette size={18} className="text-gray-600" title="Bảng màu"/>
                    {DRAW_COLORS.map(color => (
                        <button key={color.hex} onClick={() => setDrawColor(color.hex)}
                            className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${drawColor === color.hex ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                            style={{ backgroundColor: color.hex }} title={color.name} />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Brush size={18} className="text-gray-600"/>
                    <input type="range" min="1" max="10" step="0.5" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))}
                        className="w-24 cursor-pointer"
                        disabled={toolMode === 'navigate'} />
                    <span className="text-sm text-gray-600 w-8 text-center">{lineWidth.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleUndo} disabled={lines.length === 0} className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50" title="Hoàn tác">
                        <Undo2 size={18} />
                    </button>
                    <button onClick={handleClearAll} disabled={lines.length === 0} className="p-2 rounded-lg bg-red-100 text-red-600 hover:red-200 disabled:opacity-50" title="Xóa tất cả">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            
            {/* Component 3D */}
            <EyeModel3D 
                key={activeModelKey} 
                config={currentModelConfig} 
                showCornea={showCornea} 
                diagnosisLesionData={lesionData} 
                toolMode={toolMode} 
                lines={lines}
                setLines={setLines} 
                drawColor={drawColor} 
                lineWidth={lineWidth}
            />

            {/* Điều khiển bên dưới */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Aperture size={18} className="text-blue-500" />
                        <select value={activeModelKey} onChange={(e) => setActiveModelKey(e.target.value)} className="p-2 border border-gray-300 rounded-lg bg-white">
                            <option value="model1">{MODELS_CONFIG.model1.name}</option>
                            <option value="model2">{MODELS_CONFIG.model2.name}</option>
                        </select>
                    </div>
                    <div className="border-l h-8 border-gray-300"></div>
                    <label className="inline-flex items-center cursor-pointer text-sm text-gray-700">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" checked={showCornea} onChange={() => setShowCornea(!showCornea)}/>
                        <span className="ml-2">Hiện Giác mạc / Kính</span>
                    </label>
                </div>
                
                {/* --- SỬA LỖI HIỂN THỊ Ở ĐÂY --- */}
                {/* Kiểm tra safeData.label thay vì diagnosisData */}
                {safeData.label !== "Chưa có dữ liệu" && (
                    <div className="text-sm p-2 bg-blue-50 text-blue-800 rounded-lg font-semibold">
                        Chẩn đoán: {safeData.label}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualAnalysis;