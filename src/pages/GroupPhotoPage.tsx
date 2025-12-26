import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { ZodiacSign } from '../types/fortune';

// 모델 컴포넌트
function AnimalModel({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
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

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// 모델 매핑
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

// 가족사진 배치 (사이사이 엇갈리게)
// 1열(앞): 4개 위치 → 2열: 1열 사이사이 5개 → 3열: 2열 사이사이 4개
const PHOTO_LAYOUT: { sign: ZodiacSign; position: [number, number, number] }[] = [
  // 1열 앞줄 (3마리 + 메인말) - x: -0.85, -0.28, 0.28, 0.85
  { sign: 'rat', position: [-0.85, 0, 0.15] },
  { sign: 'ox', position: [-0.28, 0, 0.15] },
  // 메인말이 0.28 위치
  { sign: 'pig', position: [0.85, 0, 0.15] },

  // 2열 중간줄 (5마리) - 1열 사이사이: -1.05, -0.52, 0, 0.52, 1.05
  { sign: 'dragon', position: [-1.0, 0.3, -0.35] },
  { sign: 'tiger', position: [-0.5, 0.3, -0.35] },
  { sign: 'rabbit', position: [0, 0.3, -0.35] },
  { sign: 'rooster', position: [0.5, 0.3, -0.35] },
  { sign: 'dog', position: [1.0, 0.3, -0.35] },

  // 3열 뒷줄 (4마리) - 2열 사이사이: -0.75, -0.25, 0.25, 0.75
  { sign: 'snake', position: [-0.75, 0.55, -0.8] },
  { sign: 'horse', position: [-0.25, 0.55, -0.8] },
  { sign: 'sheep', position: [0.25, 0.55, -0.8] },
  { sign: 'monkey', position: [0.75, 0.55, -0.8] },
];

function GroupPhotoScene() {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      {/* 조명 */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 8, 5]} intensity={0.6} />
      <pointLight position={[0, 5, 3]} intensity={0.4} color="#fff5e6" />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -1]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* 메인 말 (1열 중앙) */}
      <Suspense fallback={null}>
        <AnimalModel
          url="/models/horse-main.glb"
          position={[0.28, 0, 0.15]}
          rotation={[0, 0, 0]}
          scale={1.1}
        />
      </Suspense>

      {/* 12간지 동물들 */}
      <Suspense fallback={null}>
        {PHOTO_LAYOUT.map(({ sign, position }) => (
          <AnimalModel
            key={sign}
            url={MODEL_MAP[sign]}
            position={position}
            rotation={[0, 0, 0]} // 정면 바라봄
            scale={0.7}
          />
        ))}
      </Suspense>

      <Environment preset="studio" />
    </>
  );
}

function GroupPhotoPage() {
  const navigate = useNavigate();

  return (
    <div className="group-photo-page" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ← 돌아가기
      </button>

      {/* 타이틀 */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>2026 병오년</h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.8 }}>가족사진</p>
      </div>

      <Canvas
        camera={{
          position: [0, 2, 8],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
        }}
      >
        <GroupPhotoScene />
      </Canvas>

      {/* 하단 안내 */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          color: 'white',
          opacity: 0.6,
          fontSize: '14px',
        }}
      >
        마우스로 회전 / 스크롤로 줌
      </div>
    </div>
  );
}

export default GroupPhotoPage;

// 모델 프리로드
useGLTF.preload('/models/horse-main.glb');
Object.values(MODEL_MAP).forEach((url) => {
  useGLTF.preload(url);
});
