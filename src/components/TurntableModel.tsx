import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface TurntableModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  playAnimation?: boolean;
}

function TurntableModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  playAnimation = true,
}: TurntableModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);

  // SkeletonUtils로 클론해야 애니메이션이 제대로 동작함
  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    // 모든 메시의 material에 depthWrite, depthTest 설정
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.depthWrite = true;
            mat.depthTest = true;
            mat.transparent = false;
            mat.alphaTest = 0;
          });
        }
      }
    });
    return clone;
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, clonedScene);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = 0;
    }
  }, [url]);

  // 애니메이션 재생/정지
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    const firstAction = actions[Object.keys(actions)[0]];
    if (!firstAction) return;

    if (playAnimation) {
      firstAction.reset();
      firstAction.setLoop(THREE.LoopRepeat, Infinity);
      firstAction.play();
    } else {
      firstAction.stop();
      firstAction.reset();
    }

    return () => {
      mixer?.stopAllAction();
    };
  }, [actions, mixer, playAnimation]);

  useFrame((_, delta) => {
    // 애니메이션 mixer 업데이트
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default TurntableModel;
