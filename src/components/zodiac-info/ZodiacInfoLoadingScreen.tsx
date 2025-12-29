import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../data/translations';

function ZodiacInfoLoadingScreen() {
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
        <img src="/redhorse.png" alt="Red Horse" className="loading-image" />
        <h1 className="loading-title">{t('zodiacInfoLoadingTitle')}</h1>
        <p className="loading-subtitle">{t('zodiacInfoLoadingSubtitle')}</p>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-percent">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default ZodiacInfoLoadingScreen;
