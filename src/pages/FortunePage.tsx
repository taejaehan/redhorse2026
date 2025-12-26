import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import TurntableModel from '../components/TurntableModel';
import FortuneOverlay from '../components/fortune/FortuneOverlay';
import { ZodiacFortune } from '../types/fortune';
import * as THREE from 'three';

// 카메라가 오브젝트 주위를 회전 (Z-up)
function CameraRig({ target, radius, enabled }: { target: [number, number, number]; radius: number; enabled: boolean }) {
  const angleRef = useRef(Math.PI); // -Y에서 시작
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!enabled) return;

    // 현재 각도 (0 ~ 2π)
    const normalizedAngle = angleRef.current % (Math.PI * 2);

    // 90~270도 (π/2 ~ 3π/2): 앞면 (1.5배속) - 카메라가 -Y쪽에서 볼 때
    // 0~90도, 270~360도: 뒷면 (6배속)
    const isFrontFacing = normalizedAngle > Math.PI / 2 && normalizedAngle < Math.PI * 1.5;
    const speed = isFrontFacing ? 0.3 * 1.5 : 0.3 * 6;

    angleRef.current += speed * delta;

    // 카메라 위치 계산 (Z-up: XY 평면에서 회전)
    const x = target[0] + Math.sin(angleRef.current) * radius;
    const y = target[1] + Math.cos(angleRef.current) * radius;

    camera.position.set(x, y, target[2]);
    camera.up.set(0, 0, 1);
    camera.lookAt(new THREE.Vector3(...target));
  });

  return null;
}

interface FortunePageProps {
  zodiac: ZodiacFortune;
  onBack?: () => void;
}

// 띠별 모델 경로 매핑
const MODEL_MAP: Record<string, string> = {
  rat: '/models/mouse-ani.glb',
  ox: '/models/cow-ani.glb',
  tiger: '/models/tiger-ani.glb',
  rabbit: '/models/rabbit-ani.glb',
  dragon: '/models/dragon-ani.glb',
  snake: '/models/snake-ani.glb',
  horse: '/models/horse-ani.glb',
  sheep: '/models/sheep-ani.glb',
  monkey: '/models/monkey-ani.glb',
  rooster: '/models/chicken-ani.glb',
  dog: '/models/dog-ani.glb',
  pig: '/models/pig-ani.glb',
};

function FortunePage({ zodiac, onBack }: FortunePageProps) {
  const [debugMode, setDebugMode] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);

  // 모델 경로 결정 (없으면 기본값)
  const modelUrl = MODEL_MAP[zodiac.sign] || '/models/cow-ani.glb';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'ㄱ') {
        setDebugMode((prev) => !prev);
      }
      if (e.key === '1') {
        setPlayAnimation(false);
      }
      if (e.key === '2') {
        setPlayAnimation(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fortune-page">
      {debugMode && <div className="debug-indicator">DEBUG MODE</div>}
      <Canvas
        camera={{ position: [0, 5, 3.5], fov: 50, up: [0, 0, 1], near: 0.01, far: 1000 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
        }}
      >
        <color attach="background" args={['#0a0a12']} />
        <ambientLight intensity={2.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, -3, 3]} intensity={0.3} color="#ff6b6b" />

        {/* 카메라 회전 (디버그 모드가 아닐 때만) */}
        <CameraRig target={[0, 0, 1]} radius={5} enabled={!debugMode} />

        {/* 디버그 모드 헬퍼 */}
        {debugMode && (
          <>
            <axesHelper args={[5]} />
            <gridHelper args={[20, 20, '#444', '#222']} rotation={[Math.PI / 2, 0, 0]} />
            <OrbitControls />
          </>
        )}

        <Suspense fallback={null}>
          <TurntableModel
            url={modelUrl}
            scale={2.2}
            position={
              zodiac.sign === 'monkey' ? [-5, 2.5, -1.5] :
                zodiac.sign === 'tiger' ? [0, 0.5, -1.5] :
                  [0, 2.5, -1.5]
            }
            playAnimation={playAnimation}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      <FortuneOverlay zodiac={zodiac} onBack={onBack} />
    </div>
  );
}

export default FortunePage;
