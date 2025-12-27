import { useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as THREE from 'three';
import MainScene from '../components/main/MainScene';
import LoadingScreen from '../components/LoadingScreen';
import { ZodiacSign } from '../types/fortune';

const BASE_URL = 'https://fortune.137-5.com';

// 모바일 감지
const isMobile = () => {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window);
};

interface MainPageProps {
  onSelectZodiac: (sign: ZodiacSign) => void;
}

function MainPage({ onSelectZodiac }: MainPageProps) {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<THREE.Vector3 | null>(null);
  const [showBubble, setShowBubble] = useState(false);

  const handleSelect = useCallback((sign: ZodiacSign, worldPosition: THREE.Vector3) => {
    setSelectedSign(sign);
    setSelectedPosition(worldPosition);
    setShowBubble(false); // 동물 선택 시 말풍선 숨김
  }, []);

  const handleHorseClick = useCallback(() => {
    setShowBubble((prev) => !prev); // 토글
  }, []);

  // 빈 곳 클릭 시 말풍선 숨김
  const handleMissed = useCallback(() => {
    setShowBubble(false);
  }, []);

  // 말풍선 자동 숨김 (5초 후)
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  // 모바일 여부
  const mobile = useMemo(() => isMobile(), []);

  const handleTransitionComplete = useCallback(() => {
    if (selectedSign) {
      onSelectZodiac(selectedSign);
    }
  }, [selectedSign, onSelectZodiac]);

  return (
    <div className="main-page">
      <Helmet>
        <title>2026 병오년 운세 - 붉은 말의 해</title>
        <meta name="description" content="2026년 병오년 붉은 말의 해! 12간지 띠별 신년운세를 확인하세요." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="2026 병오년 운세 - 붉은 말의 해" />
        <meta property="og:description" content="2026년 병오년 붉은 말의 해! 12간지 띠별 신년운세를 확인하세요." />
        <meta property="og:image" content={`${BASE_URL}/redhorse.png`} />
        <meta property="og:url" content={BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="2026 병오년 운세 - 붉은 말의 해" />
        <meta name="twitter:description" content="2026년 병오년 붉은 말의 해! 12간지 띠별 신년운세를 확인하세요." />
        <meta name="twitter:image" content={`${BASE_URL}/redhorse.png`} />
      </Helmet>
      <LoadingScreen />

      {/* 우측 상단 공유 버튼 */}
      <button
        onClick={async () => {
          const url = window.location.href;
          const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || ('ontouchstart' in window);

          if (isMobileDevice && navigator.share && window.isSecureContext) {
            try {
              await navigator.share({
                title: '2026 병오년 운세',
                text: '2026년 붉은 말의 해! 나의 신년운세를 확인해보세요!',
                url,
              });
              return;
            } catch (err) { /* fallback */ }
          }

          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(url);
            } else {
              const textarea = document.createElement('textarea');
              textarea.value = url;
              textarea.readOnly = true;
              textarea.style.position = 'fixed';
              textarea.style.top = '-9999px';
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
            }
            alert('링크가 복사되었습니다!');
          } catch (err) {
            alert('링크가 복사되었습니다!');
          }
        }}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
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
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>

      <div className="main-header">
        <h1>2026 병오년</h1>
        <p>붉은 말의 해</p>
        <button className="group-photo-link" onClick={() => navigate('/group-photo')}>
          축하메세지 보기
        </button>
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
        onPointerMissed={handleMissed}
      >
        <MainScene
          onSelect={handleSelect}
          selectedSign={selectedSign}
          selectedPosition={selectedPosition}
          onTransitionComplete={handleTransitionComplete}
          onHorseClick={handleHorseClick}
        />
      </Canvas>

      {/* 말풍선 */}
      {showBubble && (
        <div className="horse-bubble">
          <p>2026년은 붉은 말의 해!</p>
          <p className="sub">주변 동물을 선택하면<br />운세를 볼 수 있어요</p>
          <div className="bubble-tail" />
        </div>
      )}

      <div className="main-footer">
        <p>{selectedSign ? '잠시만 기다려주세요...' : '띠를 선택해서 신년운세를 확인하세요'}</p>
        {!selectedSign && (
          <p className="control-hint">
            {mobile
              ? '한 손가락 회전 · 두 손가락 확대/축소'
              : '좌클릭 회전 · 스크롤 확대/축소'}
          </p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
