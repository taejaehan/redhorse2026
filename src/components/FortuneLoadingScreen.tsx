import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { ZodiacFortune } from '../types/fortune';

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

  useEffect(() => {
    if (progress >= 100 && !active) {
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  if (!show) return null;

  const imagePath = ANIMAL_IMAGE_MAP[zodiac.sign] || '/12animal/horse.png';

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <img src={imagePath} alt={zodiac.nameKo} className="loading-image" />
        <h1 className="loading-title">{zodiac.nameKo}띠</h1>
        <p className="loading-subtitle">2026년 운세를 불러오는 중...</p>
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
