import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import TurntableModel from '../components/TurntableModel';
import FortuneOverlay from '../components/fortune/FortuneOverlay';
import FortuneLoadingScreen from '../components/FortuneLoadingScreen';
import { ZodiacFortune, ZodiacSign } from '../types/fortune';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../data/translations';
import * as THREE from 'three';

const BASE_URL = 'https://fortune.137-5.com';

// 띠별 이미지 매핑
const IMAGE_MAP: Record<ZodiacSign, string> = {
  rat: '/12animal/mouse.png',
  ox: '/12animal/cow.png',
  tiger: '/12animal/tiger.png',
  rabbit: '/12animal/rabbit.png',
  dragon: '/12animal/dragon.png',
  snake: '/12animal/snake.png',
  horse: '/12animal/horse.png',
  sheep: '/12animal/sheep.png',
  monkey: '/12animal/monkey.png',
  rooster: '/12animal/chicken.png',
  dog: '/12animal/dog.png',
  pig: '/12animal/pig.png',
};

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
  const { lang, isEnglish } = useLanguage();
  const { t } = useTranslation(lang);

  // 모델 경로 결정 (없으면 기본값)
  const modelUrl = MODEL_MAP[zodiac.sign] || '/models/cow-ani.glb';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D' || e.key === 'ㅇ') {
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

  const ogImage = IMAGE_MAP[zodiac.sign] || '/redhorse.png';
  const name = isEnglish ? zodiac.nameEn : zodiac.nameKo;
  const quote = isEnglish ? zodiac.quoteEn : zodiac.quote;

  const pageTitle = t('fortuneTitle', { name });
  const pageDescription = t('fortuneDescription', {
    emoji: zodiac.emoji,
    name,
    quote: `${quote[0]} ${quote[1]}`,
  });

  return (
    <div className="fortune-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${BASE_URL}${ogImage}`} />
        <meta property="og:url" content={`${BASE_URL}${isEnglish ? '/en' : ''}/fortune/${zodiac.sign}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${BASE_URL}${ogImage}`} />
      </Helmet>
      <FortuneLoadingScreen zodiac={zodiac} />
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
