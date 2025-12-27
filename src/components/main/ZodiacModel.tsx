import { useRef, useMemo, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { ThreeEvent } from '@react-three/fiber';
import { ZodiacSign, ZODIAC_INFO } from '../../types/fortune';
import { useLanguage } from '../../contexts/LanguageContext';

const MODEL_MAP: Record<ZodiacSign, string> = {
  rat: '/models/mouse.glb',
  ox: '/models/cow.glb',
  tiger: '/models/tiger.glb',
  rabbit: '/models/rabbit.glb',
  dragon: '/models/dragon.glb',
  snake: '/models/snake.glb',
  horse: '/models/horse.glb',
  sheep: '/models/sheep.glb',
  monkey: '/models/monkey.glb',
  rooster: '/models/chicken.glb',
  dog: '/models/dog.glb',
  pig: '/models/pig.glb',
};

interface ZodiacModelProps {
  sign: ZodiacSign;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  onClick: (sign: ZodiacSign, worldPosition: THREE.Vector3) => void;
  disabled?: boolean;
  hideLabel?: boolean;
}

function ZodiacModel({
  sign,
  position,
  rotation,
  scale = 0.8,
  onClick,
  disabled = false,
  hideLabel = false,
}: ZodiacModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { isEnglish } = useLanguage();

  const modelUrl = MODEL_MAP[sign];
  const { scene } = useGLTF(modelUrl);

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.depthWrite = true;
            mat.depthTest = true;
            mat.transparent = false;
          });
        }
      }
    });
    return clone;
  }, [scene]);

  const info = ZODIAC_INFO[sign];
  const displayScale = hovered ? scale * 1.1 : scale;
  const labelText = isEnglish ? info.nameEn : `${info.nameKo}띠`;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!disabled && groupRef.current) {
      // 클릭한 모델의 실제 월드 좌표 계산
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      onClick(sign, worldPos);
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!disabled) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={displayScale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />
      {!hideLabel && (
        <Html
          position={[0, -0.5, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              color: hovered ? '#ff6b6b' : '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
          >
            {labelText}
          </div>
        </Html>
      )}
    </group>
  );
}

export default ZodiacModel;

// 모델 프리로드
Object.values(MODEL_MAP).forEach((url) => {
  useGLTF.preload(url);
});
