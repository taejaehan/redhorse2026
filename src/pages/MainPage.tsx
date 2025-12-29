import { useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as THREE from 'three';
import MainScene from '../components/main/MainScene';
import LoadingScreen from '../components/LoadingScreen';
import { ZodiacSign } from '../types/fortune';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../data/translations';

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
  const { lang, basePath, isEnglish } = useLanguage();
  const { t } = useTranslation(lang);

  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<THREE.Vector3 | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleSelect = useCallback((sign: ZodiacSign, worldPosition: THREE.Vector3) => {
    setSelectedSign(sign);
    setSelectedPosition(worldPosition);
    setShowBubble(false);
    // GA 이벤트: 띠 선택
    gtag('event', 'select_zodiac', {
      zodiac_sign: sign,
      language: lang,
    });
  }, [lang]);

  const handleHorseClick = useCallback(() => {
    setShowBubble((prev) => !prev);
  }, []);

  const handleMissed = useCallback(() => {
    setShowBubble(false);
  }, []);

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  const mobile = useMemo(() => isMobile(), []);

  const handleTransitionComplete = useCallback(() => {
    if (selectedSign) {
      onSelectZodiac(selectedSign);
    }
  }, [selectedSign, onSelectZodiac]);

  // 공유 URL (영어 버전이면 /share/en/)
  const shareUrl = isEnglish
    ? `${BASE_URL}/share/en/index.html`
    : `${BASE_URL}/share/index.html`;

  return (
    <div className="main-page">
      <Helmet>
        <title>{t('siteTitle')}</title>
        <meta name="description" content={t('siteDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('siteTitle')} />
        <meta property="og:description" content={t('siteDescription')} />
        <meta property="og:image" content={`${BASE_URL}/redhorse.png`} />
        <meta property="og:url" content={isEnglish ? `${BASE_URL}/en` : BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('siteTitle')} />
        <meta name="twitter:description" content={t('siteDescription')} />
        <meta name="twitter:image" content={`${BASE_URL}/redhorse.png`} />
      </Helmet>
      <LoadingScreen />

      {/* 좌측 상단 info 버튼 */}
      <button
        onClick={() => setShowInfo(true)}
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
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: 'bold', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>i</span>
      </button>

      {/* 좌측 상단 ? 버튼 (info 아래) */}
      <button
        onClick={() => navigate(`${basePath}/zodiac-info`)}
        style={{
          position: 'fixed',
          top: '65px',
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
        }}
      >
        <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>?</span>
      </button>

      {/* 언어 전환 버튼 */}
      <div
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <button
          onClick={() => {
            if (!isEnglish) {
              gtag('event', 'switch_language', { from: 'ko', to: 'en' });
            }
            navigate('/en');
          }}
          style={{
            background: isEnglish ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            borderRadius: '16px',
            padding: '4px 10px',
            color: isEnglish ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: isEnglish ? 'bold' : 'normal',
            transition: 'all 0.2s',
          }}
        >
          EN
        </button>
        <button
          onClick={() => {
            if (isEnglish) {
              gtag('event', 'switch_language', { from: 'en', to: 'ko' });
            }
            navigate('/');
          }}
          style={{
            background: !isEnglish ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            borderRadius: '16px',
            padding: '4px 10px',
            color: !isEnglish ? 'white' : 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: !isEnglish ? 'bold' : 'normal',
            transition: 'all 0.2s',
          }}
        >
          한국어
        </button>
      </div>

      {/* 우측 상단 공유 버튼 */}
      <button
        onClick={async () => {
          const isMobileDevice = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || ('ontouchstart' in window);

          // GA 이벤트: 공유 클릭
          gtag('event', 'share', {
            method: isMobileDevice ? 'mobile_share' : 'clipboard',
            content_type: 'main_page',
            language: lang,
          });

          // 모바일: 시스템 공유만 (alert 없음)
          if (isMobileDevice && navigator.share && window.isSecureContext) {
            try {
              await navigator.share({
                title: t('shareTitle'),
                text: t('shareText'),
                url: shareUrl,
              });
            } catch (err) { /* 취소해도 무시 */ }
            return;
          }

          // 데스크탑: 클립보드 복사 + alert
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
          position: 'fixed',
          top: '55px',
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
        <h1>{t('mainTitle')}</h1>
        <p>{t('mainSubtitle')}</p>
        <button className="group-photo-link" onClick={() => navigate(`${basePath}/group-photo`)}>
          {t('groupPhotoLink')}
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
          hideLabels={showInfo}
        />
      </Canvas>

      {/* 말풍선 */}
      {showBubble && (
        <div className="horse-bubble">
          <p>{t('horseBubble1')}</p>
          <p className="sub" dangerouslySetInnerHTML={{ __html: t('horseBubble2') }} />
          <div className="bubble-tail" />
        </div>
      )}

      {/* Info 다이얼로그 */}
      {showInfo && (
        <div
          className="info-dialog-overlay"
          onClick={() => setShowInfo(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000008',
            zIndex: 1000,
          }}
        >
          <div
            className="info-dialog"
            onClick={() => setShowInfo(false)}
            style={{
              background: '#000008',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowInfo(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '-100px' }}>
              <img src="/info/channels4_profile (1).jpg" alt="profile" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '-25px' }} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://www.youtube.com/@creative-coding-world', '_blank', 'noopener,noreferrer');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>코딩의세계</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, textDecoration: 'underline' }}>youtube.com/@creative-coding-world</span>
              </button>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.8 }}>with</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://3d.varco.ai/', '_blank', 'noopener,noreferrer');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <img src="/info/vacro.png" alt="Vacro" style={{ height: '40px', objectFit: 'contain', marginBottom: '-8px' }} />
                <span style={{ fontSize: '0.7rem', opacity: 0.6, color: 'white', textDecoration: 'underline' }}>3d.varco.ai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main-footer">
        <p>{selectedSign ? t('pleaseWait') : t('selectZodiac')}</p>
        {!selectedSign && (
          <p className="control-hint">
            {mobile ? t('controlHintMobile') : t('controlHintDesktop')}
          </p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
