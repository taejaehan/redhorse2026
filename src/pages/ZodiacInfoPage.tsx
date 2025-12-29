import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ZodiacSign } from '../types/fortune';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../data/translations';
import { fortuneData } from '../data/fortuneData';
import ZodiacInfoLoadingScreen from '../components/zodiac-info/ZodiacInfoLoadingScreen';
import ZodiacInfoScene from '../components/zodiac-info/ZodiacInfoScene';

const BASE_URL = 'https://fortune.137-5.com';

// 띠별 출생년도 포맷
function formatYears(years: number[]): string {
  return years.join(', ');
}

// 띠별 설명 메시지 생성
function getZodiacMessage(sign: ZodiacSign, lang: 'ko' | 'en'): string {
  const zodiac = fortuneData.zodiacs.find((z) => z.sign === sign);
  if (!zodiac) return '';

  const name = lang === 'ko' ? zodiac.nameKo : zodiac.nameEn;
  const years = formatYears(zodiac.years);

  if (lang === 'ko') {
    return `${name}띠: ${years}년생`;
  }
  return `${name}: Born in ${years}`;
}

interface BubbleState {
  sign: ZodiacSign | 'redHorse';
  worldPos: [number, number, number];
  screenPos: { x: number; y: number };
  message: string;
}

function ZodiacInfoPage() {
  const navigate = useNavigate();
  const { lang, basePath } = useLanguage();
  const { t } = useTranslation(lang);

  const [activeBubble, setActiveBubble] = useState<BubbleState | null>(null);

  // 동물 클릭 핸들러
  const handleAnimalClick = useCallback(
    (sign: ZodiacSign | 'redHorse', worldPos: [number, number, number]) => {
      let message: string;

      if (sign === 'redHorse') {
        // 붉은말 클릭 - 띠별 운세 설명
        message = t('zodiacFortuneExplain');
      } else {
        // 12간지 동물 클릭 - 해당 띠 설명
        message = getZodiacMessage(sign, lang);
      }

      setActiveBubble({
        sign,
        worldPos,
        screenPos: { x: 0, y: 0 },
        message,
      });
    },
    [lang, t]
  );

  // 말풍선 스크린 위치 업데이트
  const handleBubbleUpdate = useCallback((screenPos: { x: number; y: number }) => {
    setActiveBubble((prev) => (prev ? { ...prev, screenPos } : null));
  }, []);

  // 빈 곳 클릭 시 말풍선 숨김
  const handleMissed = useCallback(() => {
    setActiveBubble(null);
  }, []);

  return (
    <div
      className="zodiac-info-page"
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <Helmet>
        <title>{t('zodiacInfoTitle')}</title>
        <meta name="description" content={t('zodiacInfoDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('zodiacInfoTitle')} />
        <meta property="og:description" content={t('zodiacInfoDescription')} />
        <meta property="og:image" content={`${BASE_URL}/redhorse.png`} />
        <meta property="og:url" content={`${BASE_URL}${basePath}/zodiac-info`} />
      </Helmet>

      <ZodiacInfoLoadingScreen />

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
          fontSize: '24px',
        }}
      >
        &#8249;
      </button>

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
          paddingTop: '15px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #ff6b6b, #ffc107)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('zodiacInfoTitle')}
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {t('zodiacInfoHint')}
        </p>
      </div>

      <Canvas
        camera={{
          position: [0, 2, 4],
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
        <ZodiacInfoScene
          onAnimalClick={handleAnimalClick}
          activeBubble={activeBubble ? { sign: activeBubble.sign, worldPos: activeBubble.worldPos } : null}
          onBubbleUpdate={handleBubbleUpdate}
        />
      </Canvas>

      {/* 말풍선 (클릭된 동물 위에 표시) */}
      {activeBubble && (
        <div
          style={{
            position: 'fixed',
            left: activeBubble.screenPos.x,
            top: activeBubble.screenPos.y,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#1a1a2e',
            padding: '12px 16px',
            borderRadius: '12px',
            textAlign: 'center',
            zIndex: 150,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'bubblePop 0.3s ease-out',
            fontSize: '14px',
            fontWeight: 500,
            maxWidth: '280px',
            lineHeight: 1.5,
            pointerEvents: 'none',
          }}
        >
          {activeBubble.message}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid rgba(255, 255, 255, 0.95)',
            }}
          />
        </div>
      )}

      {/* 하단 안내 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {t('zodiacRedHorseHint')}
        </p>
      </div>
    </div>
  );
}

export default ZodiacInfoPage;
