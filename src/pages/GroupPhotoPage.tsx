import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useProgress } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useGLTF } from '@react-three/drei';
import { Helmet } from 'react-helmet-async';
import * as THREE from 'three';
import { useMemo } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { ZodiacSign } from '../types/fortune';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation, newYearMessages } from '../data/translations';

const BASE_URL = 'https://fortune.137-5.com';

// 로딩 스크린 컴포넌트
function GroupPhotoLoadingScreen() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);

  useEffect(() => {
    if (progress >= 100 && !active) {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <img src="/all_animal.png" alt="12간지" className="loading-image" />
        <h1 className="loading-title">{t('loadingTitle')}</h1>
        <p className="loading-subtitle">{t('loadingSubtitle')}</p>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-percent">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// 모델 컴포넌트
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

  const handleClick = (e: any) => {
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

// 말풍선 위치 추적 컴포넌트
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
    vec.set(worldPos[0], worldPos[1] + 0.4, worldPos[2]); // 동물 바로 위
    vec.project(camera);
    const x = (vec.x * 0.5 + 0.5) * size.width;
    const y = (-(vec.y * 0.5) + 0.5) * size.height;
    onUpdate({ x, y });
  });

  return null;
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

// 모든 위치 정의
// 1열(앞): 4개, 2열: 5개, 3열: 4개 = 총 13개
const ALL_POSITIONS: [number, number, number][] = [
  // 1열 앞줄 (인덱스 0,1,2,3)
  [-0.85, 0, 0.15],   // 0
  [-0.28, 0, 0.15],   // 1 (중앙 왼쪽)
  [0.28, 0, 0.15],    // 2 (중앙 오른쪽)
  [0.85, 0, 0.15],    // 3

  // 2열 중간줄 (인덱스 4,5,6,7,8)
  [-1.0, 0.3, -0.35],  // 4
  [-0.5, 0.3, -0.35],  // 5
  [0, 0.3, -0.35],     // 6
  [0.5, 0.3, -0.35],   // 7
  [1.0, 0.3, -0.35],   // 8

  // 3열 뒷줄 (인덱스 9,10,11,12)
  [-0.75, 0.55, -0.8], // 9
  [-0.25, 0.55, -0.8], // 10
  [0.25, 0.55, -0.8],  // 11
  [0.75, 0.55, -0.8],  // 12
];

// 12간지 동물 목록
const ZODIAC_SIGNS: ZodiacSign[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'
];

// 배열 셔플 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 랜덤 배치 생성
function getRandomLayout() {
  // 메인 말: 앞줄 중앙 (인덱스 1 또는 2) 랜덤 선택
  const mainHorseIndex = Math.random() < 0.5 ? 1 : 2;

  // 나머지 위치 인덱스들
  const remainingIndices = ALL_POSITIONS
    .map((_, i) => i)
    .filter(i => i !== mainHorseIndex);

  // 셔플
  const shuffledIndices = shuffleArray(remainingIndices);

  // 12간지 동물들 셔플
  const shuffledZodiacs = shuffleArray(ZODIAC_SIGNS);

  return {
    mainHorsePosition: ALL_POSITIONS[mainHorseIndex],
    zodiacLayout: shuffledZodiacs.map((sign, i) => ({
      sign,
      position: ALL_POSITIONS[shuffledIndices[i]],
    })),
  };
}

interface GroupPhotoSceneProps {
  onAnimalClick: (worldPos: [number, number, number]) => void;
  bubbles: BubbleState[];
  onBubbleUpdate: (id: string, screenPos: { x: number; y: number }) => void;
  onControlStart: () => void;
  onControlEnd: () => void;
  layout: ReturnType<typeof getRandomLayout>;
}

function GroupPhotoScene({ onAnimalClick, bubbles, onBubbleUpdate, onControlStart, onControlEnd, layout }: GroupPhotoSceneProps) {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        onStart={onControlStart}
        onEnd={onControlEnd}
      />

      {/* 메인 말 (앞줄 중앙 랜덤) */}
      <Suspense fallback={null}>
        <AnimalModel
          url="/models/horse-main.glb"
          position={layout.mainHorsePosition}
          rotation={[0, 0, 0]}
          scale={1.1}
          onClick={onAnimalClick}
        />
      </Suspense>

      {/* 12간지 동물들 (랜덤 배치) */}
      <Suspense fallback={null}>
        {layout.zodiacLayout.map(({ sign, position }) => (
          <AnimalModel
            key={sign}
            url={MODEL_MAP[sign]}
            position={position}
            rotation={[0, 0, 0]}
            scale={0.7}
            onClick={onAnimalClick}
          />
        ))}
      </Suspense>

      <Environment preset="studio" />

      {/* 말풍선 위치 추적 (여러 개) */}
      {bubbles.map((bubble) => (
        <BubbleTracker
          key={bubble.id}
          worldPos={bubble.worldPos}
          onUpdate={(pos) => onBubbleUpdate(bubble.id, pos)}
        />
      ))}
    </>
  );
}

interface BubbleState {
  id: string;
  message: string;
  worldPos: [number, number, number];
  x: number;
  y: number;
}

function GroupPhotoPage() {
  const navigate = useNavigate();
  const { lang, basePath, isEnglish } = useLanguage();
  const { t } = useTranslation(lang);
  const messages = newYearMessages[lang];

  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const [isControlling, setIsControlling] = useState(false);
  const layout = useMemo(() => getRandomLayout(), []);

  // GA 이벤트: greeting 페이지 방문
  useEffect(() => {
    gtag('event', 'page_view', {
      page_title: 'greeting',
      language: lang,
    });
  }, [lang]);

  // 모든 동물 위치 (메인 말 + 12간지)
  const allPositions = useMemo(() => {
    return [
      layout.mainHorsePosition,
      ...layout.zodiacLayout.map(z => z.position),
    ];
  }, [layout]);

  // 동물 클릭 핸들러
  const handleAnimalClick = useCallback((worldPos: [number, number, number]) => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const newBubble: BubbleState = {
      id: `click-${Date.now()}`,
      message: randomMessage,
      worldPos,
      x: 0,
      y: 0,
    };
    setBubbles([newBubble]);
  }, [messages]);

  // 말풍선 스크린 위치 업데이트
  const handleBubbleUpdate = useCallback((id: string, screenPos: { x: number; y: number }) => {
    setBubbles(prev => prev.map(b =>
      b.id === id ? { ...b, x: screenPos.x, y: screenPos.y } : b
    ));
  }, []);

  // 빈 곳 클릭 시 말풍선 숨김
  const handleMissed = useCallback(() => {
    setBubbles([]);
  }, []);

  // 카메라 컨트롤 상태
  const handleControlStart = useCallback(() => {
    setIsControlling(true);
    setBubbles([]); // 컨트롤 시작하면 말풍선 숨김
  }, []);

  const handleControlEnd = useCallback(() => {
    setIsControlling(false);
  }, []);

  // 자동 말풍선 표시 (카메라 조작 안 할 때)
  useEffect(() => {
    if (isControlling) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const showRandomBubbles = () => {
      const count = Math.floor(Math.random() * 4) + 1; // 1~4개
      const shuffled = [...allPositions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, count);

      // 하나씩 딜레이를 두고 추가
      selected.forEach((pos, i) => {
        const timer = setTimeout(() => {
          const newBubble: BubbleState = {
            id: `auto-${Date.now()}-${i}`,
            message: messages[Math.floor(Math.random() * messages.length)],
            worldPos: pos,
            x: 0,
            y: 0,
          };
          setBubbles(prev => [...prev, newBubble]);
        }, i * 400); // 0.4초 간격으로 추가
        timers.push(timer);
      });
    };

    // 초기 표시
    const initialTimer = setTimeout(showRandomBubbles, 500);
    timers.push(initialTimer);

    // 주기적으로 표시/숨김 반복
    const interval = setInterval(() => {
      setBubbles([]); // 먼저 숨김
      setTimeout(showRandomBubbles, 300); // 잠깐 후 새로 표시
    }, 4000);

    return () => {
      timers.forEach(t => clearTimeout(t));
      clearInterval(interval);
    };
  }, [isControlling, allPositions, messages]);

  // 공유 URL
  const shareUrl = isEnglish
    ? `${BASE_URL}/share/en/group-photo/index.html`
    : `${BASE_URL}/share/group-photo/index.html`;

  return (
    <div className="group-photo-page" style={{
      width: '100%',
      height: '100dvh',
      position: 'relative',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
    }}>
      <Helmet>
        <title>{t('groupPhotoTitle')}</title>
        <meta name="description" content={t('groupPhotoDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('groupPhotoTitle')} />
        <meta property="og:description" content={t('groupPhotoDescription')} />
        <meta property="og:image" content={`${BASE_URL}/all_animal.png`} />
        <meta property="og:url" content={`${BASE_URL}${basePath}/group-photo`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('groupPhotoTitle')} />
        <meta name="twitter:description" content={t('groupPhotoDescription')} />
        <meta name="twitter:image" content={`${BASE_URL}/all_animal.png`} />
      </Helmet>
      <GroupPhotoLoadingScreen />

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(basePath || '/')}
        style={{
          position: 'fixed',
          top: '15px',
          left: '15px',
          zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          fontSize: '20px',
        }}
      >
        ‹
      </button>

      {/* 우측 상단 버튼들 */}
      <div style={{
        position: 'fixed',
        top: '15px',
        right: '15px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* 리프레시 버튼 */}
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>

        {/* 공유 버튼 */}
        <button
          onClick={async () => {
            const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
              || ('ontouchstart' in window);

            // 모바일에서만 Web Share API 사용
            if (isMobileDevice && navigator.share && window.isSecureContext) {
              try {
                await navigator.share({
                  title: t('groupPhotoTitle'),
                  text: t('loadingSubtitle'),
                  url: shareUrl,
                });
                return;
              } catch (err) { /* fallback */ }
            }

            // 클립보드 복사
            try {
              if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareUrl);
              } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                textarea.readOnly = true;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
              }
              alert(t('linkCopied'));
            } catch (err) {
              alert(t('linkCopied'));
            }
          }}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* 상단 타이틀 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
        }}
      >
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '2px',
        }}>
          {t('headerYear') && (
            <>
              <span style={{ opacity: 0.6 }}>{t('headerYear')}</span>
              <span style={{ margin: '0 12px', opacity: 0.4 }}>|</span>
            </>
          )}
          <span
            style={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ff6b6b, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            dangerouslySetInnerHTML={{ __html: t('headerRedHorse') }}
          />
        </p>
      </div>

      <Canvas
        camera={{
          position: [0, 1.8, 5],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          alpha: false,
        }}
        onPointerMissed={handleMissed}
      >
        <GroupPhotoScene
          onAnimalClick={handleAnimalClick}
          bubbles={bubbles}
          onBubbleUpdate={handleBubbleUpdate}
          onControlStart={handleControlStart}
          onControlEnd={handleControlEnd}
          layout={layout}
        />
      </Canvas>

      {/* 말풍선들 */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={{
            position: 'fixed',
            left: bubble.x,
            top: bubble.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a2e',
            padding: '10px 14px',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: 150,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'bubblePop 0.3s ease-out',
            fontSize: '14px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {bubble.message}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(255, 255, 255, 0.95)',
          }} />
        </div>
      ))}

      {/* 하단 새해 인사 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          textAlign: 'center',
          padding: '25px 20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
        }}
      >
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '3px',
        }}>
          {t('footerNewYear')}
          {isEnglish && <br />}
          <span style={{
            margin: isEnglish ? '0' : '0 10px',
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(180deg, #ffd700, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            verticalAlign: 'middle',
          }}>
            {t('footerBlessing')}
          </span>
          {isEnglish ? ` ${t('footerWishes')}` : t('footerWishes')}
        </p>
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
