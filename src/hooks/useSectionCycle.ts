import { useState, useEffect, useCallback } from 'react';
import { Section } from '../types/fortune';

interface UseSectionCycleOptions {
  sections: Section[];
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseSectionCycleReturn {
  currentIndex: number;
  currentSection: Section;
  isTransitioning: boolean;
  isComplete: boolean;
  start: () => void;
  reset: () => void;
}

export function useSectionCycle({
  sections,
  onComplete,
  autoStart = false,
}: UseSectionCycleOptions): UseSectionCycleReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    setCurrentIndex(0);
    setIsComplete(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsComplete(false);
    setIsRunning(false);
    setIsTransitioning(false);
  }, []);

  useEffect(() => {
    if (!isRunning || isComplete) return;

    const currentSection = sections[currentIndex];
    if (!currentSection) return;

    const timer = setTimeout(() => {
      if (currentIndex === sections.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsComplete(true);
          setIsRunning(false);
          setIsTransitioning(false);
          onComplete?.();
        }, 500);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsTransitioning(false);
        }, 500);
      }
    }, currentSection.duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isRunning, isComplete, sections, onComplete]);

  return {
    currentIndex,
    currentSection: sections[currentIndex],
    isTransitioning,
    isComplete,
    start,
    reset,
  };
}
