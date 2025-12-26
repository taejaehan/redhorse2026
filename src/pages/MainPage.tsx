import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import MainScene from '../components/main/MainScene';
import { ZodiacSign } from '../types/fortune';

interface MainPageProps {
  onSelectZodiac: (sign: ZodiacSign) => void;
}

function MainPage({ onSelectZodiac }: MainPageProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<THREE.Vector3 | null>(null);

  const handleSelect = useCallback((sign: ZodiacSign, worldPosition: THREE.Vector3) => {
    setSelectedSign(sign);
    setSelectedPosition(worldPosition);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (selectedSign) {
      onSelectZodiac(selectedSign);
    }
  }, [selectedSign, onSelectZodiac]);

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>2026 병오년</h1>
        <p>붉은 말의 해</p>
      </div>

      <Canvas
        shadows
        camera={{
          position: [0, 8, 12],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
        }}
      >
        <MainScene
          onSelect={handleSelect}
          selectedSign={selectedSign}
          selectedPosition={selectedPosition}
          onTransitionComplete={handleTransitionComplete}
        />
      </Canvas>

      <div className="main-footer">
        <p>{selectedSign ? '잠시만 기다려주세요...' : '띠를 선택하세요'}</p>
      </div>
    </div>
  );
}

export default MainPage;
