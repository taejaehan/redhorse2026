import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { ZodiacFortune } from '../types/fortune';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../data/translations';

// 띠별 이미지 경로 매핑
const ANIMAL_IMAGE_MAP: Record<string, string> = {
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

interface FortuneLoadingScreenProps {
  zodiac: ZodiacFortune;
}

function FortuneLoadingScreen({ zodiac }: FortuneLoadingScreenProps) {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const { lang, isEnglish } = useLanguage();
  const { t } = useTranslation(lang);

  useEffect(() => {
    if (progress >= 100 && !active) {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  if (!show) return null;

  const imagePath = ANIMAL_IMAGE_MAP[zodiac.sign] || '/12animal/horse.png';
  const name = isEnglish ? zodiac.nameEn : zodiac.nameKo;

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <img src={imagePath} alt={name} className="loading-image" />
        <h1 className="loading-title">{t('loadingFortuneTitle', { name })}</h1>
        <p className="loading-subtitle">{t('loadingFortuneSubtitle')}</p>
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-percent">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default FortuneLoadingScreen;
