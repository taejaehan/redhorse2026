import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

function LoadingScreen() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (progress >= 100 && !active) {
      // 로딩 완료 후 잠시 대기 후 페이드아웃
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <img src="/redhorse.png" alt="붉은 말" className="loading-image" />
        <h1 className="loading-title">2026 병오년</h1>
        <p className="loading-subtitle">붉은 말의 해, 당신의 운세는?</p>
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

export default LoadingScreen;
