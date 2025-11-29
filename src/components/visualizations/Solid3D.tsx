/**
 * Componente Solid3D - Visualización de sólidos de revolución con Three.js
 * TSP1 - Matemática III
 */

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Play, Pause, Eye, EyeOff } from 'lucide-react';
import * as THREE from 'three';

interface Solid3DProps {
  functionExpression?: string;
  rotationAxis?: 'x' | 'y';
  xMin?: number;
  xMax?: number;
  segments?: number;
  showVolume?: boolean;
}

// Componente del sólido rotativo
const RotatingSolid: React.FC<{
  functionExpression: string;
  rotationAxis: 'x' | 'y';
  xMin: number;
  xMax: number;
  segments: number;
  autoRotate: boolean;
  rotationSpeed: number;
  showWireframe: boolean;
}> = ({ functionExpression, rotationAxis, xMin, xMax, segments, autoRotate, rotationSpeed, showWireframe }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  // Rotación automática controlable
  useFrame(() => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (wireframeRef.current && autoRotate) {
      wireframeRef.current.rotation.y += rotationSpeed;
    }
  });

  // Generar geometría del sólido de revolución
  const generateGeometry = () => {
    const points: THREE.Vector2[] = [];

    // Evaluar función
    const evaluateFunction = (x: number): number => {
      try {
        // Función de ejemplo (1/x^(3/2) para demostración)
        if (functionExpression.includes('1/x')) {
          return 1 / Math.pow(x, 1.5);
        }
        return eval(functionExpression.replace(/x/g, String(x)));
      } catch {
        return 1;
      }
    };

    // Generar puntos de la curva
    const steps = 50;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evaluateFunction(x);

      if (rotationAxis === 'x') {
        points.push(new THREE.Vector2(Math.abs(y), x));
      } else {
        points.push(new THREE.Vector2(x, Math.abs(y)));
      }
    }

    return new THREE.LatheGeometry(points, segments);
  };

  const geometry = generateGeometry();

  return (
    <group>
      {/* Sólido principal */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#7c3aed"
          metalness={0.4}
          roughness={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={showWireframe ? 0.7 : 0.9}
        />
      </mesh>

      {/* Wireframe */}
      {showWireframe && (
        <lineSegments ref={wireframeRef} geometry={geometry}>
          <lineBasicMaterial color="#1e3a8a" linewidth={1} />
        </lineSegments>
      )}
    </group>
  );
};

export const Solid3D: React.FC<Solid3DProps> = ({
  functionExpression = '1/x^(3/2)',
  rotationAxis = 'x',
  xMin = 1,
  xMax = 5,
  segments = 32,
  showVolume = true,
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [showWireframe, setShowWireframe] = useState(false);

  // Calcular volumen aproximado usando el método de discos/arandelas
  const calculateVolume = (): number => {
    const evaluateFunction = (x: number): number => {
      try {
        if (functionExpression.includes('1/x')) {
          return 1 / Math.pow(x, 1.5);
        }
        return eval(functionExpression.replace(/x/g, String(x)));
      } catch {
        return 1;
      }
    };

    const steps = 100;
    const dx = (xMax - xMin) / steps;
    let volume = 0;

    for (let i = 0; i < steps; i++) {
      const x = xMin + i * dx;
      const y = evaluateFunction(x);
      volume += Math.PI * y * y * dx;
    }

    return volume;
  };

  const volume = calculateVolume();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Sólido de Revolución 3D</h3>
        <p className="text-xs text-gray-500">
          Rotación de y = {functionExpression} alrededor del eje {rotationAxis}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          💡 Arrastra para rotar | Rueda para zoom
        </p>
      </div>

      {/* Controles interactivos */}
      <div className="mb-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded transition-colors"
          title={autoRotate ? 'Pausar rotación' : 'Iniciar rotación'}
        >
          {autoRotate ? <Pause size={14} /> : <Play size={14} />}
          <span>{autoRotate ? 'Pausar' : 'Rotar'}</span>
        </button>

        <button
          onClick={() => setShowWireframe(!showWireframe)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          title={showWireframe ? 'Ocultar malla' : 'Mostrar malla'}
        >
          {showWireframe ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>Malla</span>
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-600">Velocidad:</label>
          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-24"
            title="Ajustar velocidad de rotación"
          />
          <span className="text-xs text-gray-500 w-8">{(rotationSpeed * 100).toFixed(1)}</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded" style={{ height: '400px' }}>
        <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
          {/* Iluminación */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />

          {/* Sólido */}
          <RotatingSolid
            functionExpression={functionExpression}
            rotationAxis={rotationAxis}
            xMin={xMin}
            xMax={xMax}
            segments={segments}
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            showWireframe={showWireframe}
          />

          {/* Ejes de referencia */}
          <axesHelper args={[5]} />

          {/* Grilla */}
          <gridHelper args={[10, 10, '#e0e0e0', '#f0f0f0']} rotation={[Math.PI / 2, 0, 0]} />

          {/* Controles de órbita */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Canvas>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Eje X</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Eje Y</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Eje Z</span>
            </div>
          </div>
          {showVolume && (
            <div className="text-xs font-medium text-violet-700">
              Volumen ≈ {volume.toFixed(4)} u³
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Solid3D;
