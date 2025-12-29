import { Suspense, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { ZodiacSign, ZODIAC_ORDER } from '../../types/fortune';

// 12간지 동물 모델 매핑
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

// 6x2 그리드 위치 (앞줄 6개, 뒷줄 6개)
const GRID_POSITIONS: [number, number, number][] = [
  // 앞줄 (6개) - z = 0.3
  [-1.5, 0, 0.3],   // 0: rat
  [-0.9, 0, 0.3],   // 1: ox
  [-0.3, 0, 0.3],   // 2: tiger
  [0.3, 0, 0.3],    // 3: rabbit
  [0.9, 0, 0.3],    // 4: dragon
  [1.5, 0, 0.3],    // 5: snake

  // 뒷줄 (6개) - z = -0.4, y 살짝 높게
  [-1.5, 0.25, -0.4], // 6: horse
  [-0.9, 0.25, -0.4], // 7: sheep
  [-0.3, 0.25, -0.4], // 8: monkey
  [0.3, 0.25, -0.4],  // 9: rooster
  [0.9, 0.25, -0.4],  // 10: dog
  [1.5, 0.25, -0.4],  // 11: pig
];

// 붉은말 위치 (가장 뒤 중앙)
const RED_HORSE_POSITION: [number, number, number] = [0, 0.5, -1.2];

// AnimalModel 컴포넌트
function AnimalModel({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: (worldPos: [number, number, number]) => void;
}) {
  const { scene } = useGLTF(url);

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

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (onClick) {
      onClick(position);
    }
  };

  return (
    <group position={position} rotation={rotation} scale={scale} onClick={handleClick}>
      <primitive object={clonedScene} />
    </group>
  );
}

// BubbleTracker - 말풍선 스크린 위치 추적
function BubbleTracker({
  worldPos,
  onUpdate,
}: {
  worldPos: [number, number, number];
  onUpdate: (screenPos: { x: number; y: number }) => void;
}) {
  const { camera, size } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    vec.set(worldPos[0], worldPos[1] + 0.35, worldPos[2]);
    vec.project(camera);
    const x = (vec.x * 0.5 + 0.5) * size.width;
    const y = (-(vec.y * 0.5) + 0.5) * size.height;
    onUpdate({ x, y });
  });

  return null;
}

// Scene Props
interface ZodiacInfoSceneProps {
  onAnimalClick: (sign: ZodiacSign | 'redHorse', worldPos: [number, number, number]) => void;
  activeBubble: { sign: ZodiacSign | 'redHorse'; worldPos: [number, number, number] } | null;
  onBubbleUpdate: (screenPos: { x: number; y: number }) => void;
}

function ZodiacInfoScene({ onAnimalClick, activeBubble, onBubbleUpdate }: ZodiacInfoSceneProps) {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* 조명 */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} />

      {/* 붉은말 (뒤쪽 중앙) */}
      <Suspense fallback={null}>
        <AnimalModel
          url="/models/horse-main.glb"
          position={RED_HORSE_POSITION}
          rotation={[0, 0, 0]}
          scale={1.0}
          onClick={(pos) => onAnimalClick('redHorse', pos)}
        />
      </Suspense>

      {/* 12간지 동물들 (6x2 그리드) */}
      <Suspense fallback={null}>
        {ZODIAC_ORDER.map((sign, index) => (
          <AnimalModel
            key={sign}
            url={MODEL_MAP[sign]}
            position={GRID_POSITIONS[index]}
            rotation={[0, 0, 0]}
            scale={0.55}
            onClick={(pos) => onAnimalClick(sign, pos)}
          />
        ))}
      </Suspense>

      <Environment preset="studio" />

      {/* 말풍선 위치 추적 */}
      {activeBubble && (
        <BubbleTracker
          worldPos={activeBubble.worldPos}
          onUpdate={onBubbleUpdate}
        />
      )}
    </>
  );
}

export default ZodiacInfoScene;

// 모델 프리로드
useGLTF.preload('/models/horse-main.glb');
Object.values(MODEL_MAP).forEach((url) => {
  useGLTF.preload(url);
});
