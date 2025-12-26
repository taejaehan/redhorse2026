import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZodiacSign, ZODIAC_ORDER } from '../../types/fortune';
import ZodiacModel from './ZodiacModel';

const RADIUS = 2.25;

interface ZodiacCircle3DProps {
  onSelect: (sign: ZodiacSign, worldPosition: THREE.Vector3) => void;
  rotationSpeed?: number;
  isTransitioning?: boolean;
}

const ZodiacCircle3D = forwardRef<THREE.Group, ZodiacCircle3DProps>(
  ({ onSelect, rotationSpeed = 0.15, isTransitioning = false }, ref) => {
    const groupRef = useRef<THREE.Group>(null);

    // 외부에서 groupRef 접근 가능하도록
    useImperativeHandle(ref, () => groupRef.current as THREE.Group);

    useFrame((_, delta) => {
      if (groupRef.current && !isTransitioning) {
        // 중앙 horse와 반대 방향으로 회전 (음수)
        // 트랜지션 중에는 회전 멈춤
        groupRef.current.rotation.y -= rotationSpeed * delta;
      }
    });

    return (
      <group ref={groupRef}>
        {ZODIAC_ORDER.map((sign, index) => {
          // XZ 평면에서 원형 배치
          const angle = (index / 12) * Math.PI * 2;
          const x = Math.cos(angle) * RADIUS;
          const z = Math.sin(angle) * RADIUS;

          // 바깥을 바라보는 회전값 (Y축 기준)
          const rotationY = -angle + Math.PI / 2;

          return (
            <ZodiacModel
              key={sign}
              sign={sign}
              position={[x, 0, z]}
              rotation={[0, rotationY, 0]}
              onClick={onSelect}
              disabled={isTransitioning}
            />
          );
        })}
      </group>
    );
  }
);

ZodiacCircle3D.displayName = 'ZodiacCircle3D';

export default ZodiacCircle3D;
