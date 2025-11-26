// 👇 Import thêm 'useFrame'
import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react'; 
import { useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Line } from '@react-three/drei';
import * as THREE from 'three'; 

// --- COMPONENT CON: XỬ LÝ MÔ HÌNH + VẼ ---
function EyeMesh({ 
    config, 
    showCornea, 
    toolMode, lines, setLines,
    drawColor,
    lineWidth
}) {
  
  const { 
    path, isSimpleModel, wireframeColors, mainMeshNames, glassMeshNames,
    retinaNames, choroidNames, scleraNames, glassNames, otherNames
  } = config;

  const { scene } = useGLTF(path);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLinePoints, setCurrentLinePoints] = useState([]);
  const fillMeshesRef = useRef([]);
  const groupRef = useRef();
  
  // 🔥 SỬA LỖI: Tạo một Ref để lưu các bộ phận cần lắng nghe sự kiện vẽ
  const partsToListenRef = useRef([]);

  // --- LOGIC VẼ (giữ nguyên) ---
  const handlePointerDown = useCallback((e) => {
    if (toolMode !== 'draw' && toolMode !== 'region') return; 
    e.stopPropagation(); 
    setIsDrawing(true);
    setCurrentLinePoints([e.point]); 
  }, [toolMode]); 
  const handlePointerMove = useCallback((e) => {
    if (!isDrawing || (toolMode !== 'draw' && toolMode !== 'region')) return;
    e.stopPropagation();
    setCurrentLinePoints(prev => [...prev, e.point]);
  }, [isDrawing, toolMode]); 
  const handlePointerUp = useCallback((e) => {
    if (!isDrawing) return;
    e.stopPropagation(); setIsDrawing(false);
    if (currentLinePoints.length > 1) {
        const finalPoints = toolMode === 'region' ? [...currentLinePoints, currentLinePoints[0]] : currentLinePoints;
        const newLine = { points: finalPoints, color: drawColor || 'red', width: lineWidth || 3, };
        setLines(prev => [...prev, newLine]);
    }
    setCurrentLinePoints([]);
  }, [isDrawing, toolMode, currentLinePoints, drawColor, lineWidth, setLines]); 
  

  // 🔥 SỬA LỖI: TÁCH HOOK
  
  // --- HOOK 1: Chỉ xử lý TÔ MÀU và TẠO FILL (Chạy 1 lần) ---
  useEffect(() => {
    if (!scene) return; 

    const colors = wireframeColors;
    const localPartsToListen = []; // Mảng tạm
    
    fillMeshesRef.current.forEach(mesh => mesh.parent?.remove(mesh));
    fillMeshesRef.current = [];

    const createWireframeMaterial = (color) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.3 });
    const fillMaterial = new THREE.MeshBasicMaterial({ color: colors.fill, transparent: true, opacity: 0.05, wireframe: false, depthWrite: false, });

    if (isSimpleModel) {
        const eyeMaterial = createWireframeMaterial(colors.main);
        const glassMaterial = createWireframeMaterial(colors.glass);
        const mainEye = scene.getObjectByName(mainMeshNames[0]);
        const glassPart = scene.getObjectByName(glassMeshNames[0]);
        if (mainEye) { mainEye.material = eyeMaterial; const fillMesh = mainEye.clone(); fillMesh.material = fillMaterial; mainEye.parent.add(fillMesh); fillMeshesRef.current.push(fillMesh); localPartsToListen.push(mainEye, fillMesh); }
        if (glassPart) { glassPart.material = glassMaterial; glassPart.visible = showCornea; localPartsToListen.push(glassPart); }
    } else {
        const retinaMat = createWireframeMaterial(colors.retina);
        const choroidMat = createWireframeMaterial(colors.choroid);
        const scleraMat = createWireframeMaterial(colors.sclera);
        const glassMat = createWireframeMaterial(colors.glass);
        const otherMat = createWireframeMaterial(colors.other);
        scene.traverse((child) => {
            if (child.isMesh) {
                let isAssigned = false;
                const checkName = (namesArray) => namesArray.some(name => child.name.startsWith(name));
                if (checkName(retinaNames)) { child.material = retinaMat; const fillMesh = child.clone(); fillMesh.material = fillMaterial; child.parent.add(fillMesh); fillMeshesRef.current.push(fillMesh); localPartsToListen.push(child, fillMesh); isAssigned = true; } 
                else if (checkName(choroidNames)) { child.material = choroidMat; localPartsToListen.push(child); isAssigned = true; } 
                else if (checkName(scleraNames)) { child.material = scleraMat; localPartsToListen.push(child); isAssigned = true; } 
                else if (checkName(glassNames)) { child.material = glassMat; child.visible = showCornea; localPartsToListen.push(child); isAssigned = true; } 
                else if (checkName(otherNames)) { child.material = otherMat; localPartsToListen.push(child); isAssigned = true; } 
                if (!isAssigned) { child.material = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.1 }); localPartsToListen.push(child); }
            }
        });
    }

    // Lưu các bộ phận vào Ref để Hook 2 sử dụng
    partsToListenRef.current = localPartsToListen;
    
    // Cleanup cho Hook 1
    return () => {
        fillMeshesRef.current.forEach(mesh => mesh.parent?.remove(mesh));
        // (Không cần cleanup event listener ở đây nữa)
    }
    
  // Chỉ chạy lại khi scene, config, hoặc showCornea thay đổi
  }, [scene, showCornea, config]); 


  // --- HOOK 2: Chỉ xử lý GÁN SỰ KIỆN VẼ ---
  useEffect(() => {
    if (!scene) return;

    // --- CHÈN ĐOẠN NÀY VÀO ĐỂ DEBUG ---
    console.log("=== DANH SÁCH TÊN MESH TRONG FILE 3D ===");
    scene.traverse((child) => {
        if (child.isMesh) {
            console.log("Tên Mesh:", child.name); // <--- Xem tên này ở F12 Console
        }
    });
    console.log("========================================");
    const parts = partsToListenRef.current; // Lấy danh sách bộ phận từ Ref
    if (!parts || parts.length === 0) return;

    // Gán các hàm event listener (đã được memoize)
    parts.forEach(part => {
        part.onPointerDown = handlePointerDown;
        part.onPointerMove = handlePointerMove;
        part.onPointerUp = handlePointerUp;
        part.onPointerLeave = handlePointerUp;
    });
    
    // Cleanup cho Hook 2
    return () => {
        parts.forEach(part => {
            if (part) {
                part.onPointerDown = null; part.onPointerMove = null; part.onPointerUp = null; part.onPointerLeave = null;
            }
        });
    }
    
  // Chỉ chạy lại khi các hàm handler thay đổi
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);


  // --- Hook để tự xoay (giữ nguyên) ---
  useFrame(() => {
    if (groupRef.current && toolMode === 'navigate') { // Chỉ xoay khi ở chế độ navigate
      groupRef.current.rotation.y += 0.010;
    }
  });


  // --- Tính toán vị trí (giữ nguyên) ---
  const modelPosition = isSimpleModel ? [0, -4, 0] : [0, 0, 0];


  // --- PHẦN RENDER (giữ nguyên) ---
  return (
    <>
      <group ref={groupRef} position={modelPosition}>
          <primitive object={scene} />
      </group>
      
      {lines.map((lineData, index) => (
        <Line 
            key={index} points={lineData.points} color={lineData.color} lineWidth={lineData.width}
            polygonOffset={true} polygonOffsetFactor={-10} 
        />
      ))}
      {currentLinePoints.length > 1 && (
        <Line 
            points={currentLinePoints} color={drawColor || 'red'} lineWidth={lineWidth || 3} 
            dashed dashSize={0.1} gapSize={0.05} 
            polygonOffset={true} polygonOffsetFactor={-10}
        />
      )}
    </>
  );
}


// --- COMPONENT CHA (giữ nguyên) ---
const EyeModel3D = (props) => {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg shadow-inner">
      <Canvas camera={{ position: [0, 0, 15], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <EyeMesh {...props} /> 
          <OrbitControls
            enabled={props.toolMode === 'navigate'} 
            enablePan={false} 
            enableZoom={props.toolMode === 'navigate'}
            enableRotate={props.toolMode === 'navigate'}
            minDistance={5}       
            maxDistance={20}      
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EyeModel3D;