import { Suspense, useRef, useEffect } from 'react';
import { Environment, OrbitControls, SpotLight } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ZodiacSign } from '../../types/fortune';
import CenterHorseModel from './CenterHorseModel';
import ZodiacCircle3D from './ZodiacCircle3D';

// 카메라 설정값
const CAMERA_DISTANCE = Math.sqrt(8 * 8 + 12 * 12); // 약 14.4
const CURRENT_POLAR = Math.acos(8 / CAMERA_DISTANCE); // 약 56도 (0.98 rad)
const ANGLE_LIMIT_UP = (10 * Math.PI) / 180; // 위로 10도
const ANGLE_LIMIT_DOWN = (35 * Math.PI) / 180; // 아래로 35도

interface MainSceneProps {
  onSelect: (sign: ZodiacSign, worldPosition: THREE.Vector3) => void;
  selectedSign: ZodiacSign | null;
  selectedPosition: THREE.Vector3 | null;
  onTransitionComplete: () => void;
}

function MainScene({ onSelect, selectedSign, selectedPosition, onTransitionComplete }: MainSceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const zodiacSpotlightRef = useRef<any>(null);
  const circleRef = useRef<THREE.Group>(null);

  // 애니메이션 상태
  const animationState = useRef({
    isAnimating: false,
    startTime: 0,
    startCameraPos: new THREE.Vector3(),
    targetCameraPos: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
  });

  // 선택 시 애니메이션 시작
  useEffect(() => {
    if (selectedSign && selectedPosition && !animationState.current.isAnimating) {
      // 클릭한 동물의 실제 월드 좌표 사용
      const targetPos = selectedPosition.clone();
      targetPos.y = 0.5; // 높이 보정

      // 카메라 목표 위치 계산 (선택된 동물 앞쪽, 상하 10도 각도)
      const cameraDistance = 4;
      const polarAngle = (10 * Math.PI) / 180;

      // 동물 방향 (중심에서 바깥쪽)
      const direction = new THREE.Vector3(targetPos.x, 0, targetPos.z).normalize();

      const cameraHeight = targetPos.y + cameraDistance * Math.sin(polarAngle);
      const horizontalDist = cameraDistance * Math.cos(polarAngle);

      const targetCameraPos = new THREE.Vector3(
        targetPos.x + direction.x * horizontalDist,
        cameraHeight,
        targetPos.z + direction.z * horizontalDist
      );

      animationState.current = {
        isAnimating: true,
        startTime: Date.now(),
        startCameraPos: camera.position.clone(),
        targetCameraPos,
        startLookAt: new THREE.Vector3(0, 0, 0),
        targetLookAt: targetPos,
        targetPosition: targetPos,
      };

      // OrbitControls 비활성화
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }, [selectedSign, selectedPosition, camera]);

  // 애니메이션 프레임
  useFrame(() => {
    if (!animationState.current.isAnimating || !selectedSign) return;

    const elapsed = Date.now() - animationState.current.startTime;
    const duration = 1200; // 1.2초
    const progress = Math.min(elapsed / duration, 1);

    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);

    // 카메라 위치 보간
    camera.position.lerpVectors(
      animationState.current.startCameraPos,
      animationState.current.targetCameraPos,
      eased
    );

    // 카메라 lookAt 보간
    const currentLookAt = new THREE.Vector3().lerpVectors(
      animationState.current.startLookAt,
      animationState.current.targetLookAt,
      eased
    );
    camera.lookAt(currentLookAt);

    // 스포트라이트 위치 및 강도 (저장된 위치 사용)
    if (zodiacSpotlightRef.current) {
      const targetPos = animationState.current.targetPosition;
      zodiacSpotlightRef.current.position.set(targetPos.x, 8, targetPos.z);
      zodiacSpotlightRef.current.target.position.set(targetPos.x, 0, targetPos.z);
      zodiacSpotlightRef.current.intensity = eased * 500;
    }

    // 애니메이션 완료
    if (progress >= 1) {
      animationState.current.isAnimating = false;
      setTimeout(() => {
        onTransitionComplete();
      }, 300); // 살짝 딜레이 후 페이지 전환
    }
  });

  return (
    <>
      {/* 배경색 */}
      <color attach="background" args={['#0a0a12']} />

      {/* 카메라 컨트롤 - 줌/회전 */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={CAMERA_DISTANCE / 3}
        maxDistance={CAMERA_DISTANCE}
        minPolarAngle={CURRENT_POLAR - ANGLE_LIMIT_UP}
        maxPolarAngle={CURRENT_POLAR + ANGLE_LIMIT_DOWN}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
      />

      {/* 기본 조명 (약하게 - 핀조명 강조) */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      <directionalLight position={[-5, 8, -5]} intensity={0.2} />

      {/* 중앙 말 핀 스포트라이트 */}
      <SpotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={0.3}
        intensity={500}
        color="#ffffff"
        castShadow
        target-position={[0, 0.2, 0]}
        distance={15}
        attenuation={5}
        anglePower={4}
      />

      {/* 선택된 동물 스포트라이트 (소 설정 적용) */}
      <SpotLight
        ref={zodiacSpotlightRef as any}
        position={[0, 8, 0]}
        angle={0.2}
        penumbra={0.3}
        intensity={0}
        color="#ffffff"
        castShadow
        distance={15}
        attenuation={5}
        anglePower={4}
      />

      {/* 바닥 원형 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* 중앙 말 모델 */}
      <Suspense fallback={null}>
        <CenterHorseModel scale={1.5} rotationSpeed={0.3} position={[0, 0.2, 0]} />
      </Suspense>

      {/* 12간지 원형 배치 */}
      <Suspense fallback={null}>
        <ZodiacCircle3D
          ref={circleRef}
          onSelect={onSelect}
          isTransitioning={!!selectedSign}
        />
      </Suspense>

      {/* 환경광 */}
      <Environment preset="night" />
    </>
  );
}

export default MainScene;
