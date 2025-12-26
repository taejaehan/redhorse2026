import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

interface CenterHorseModelProps {
  scale?: number;
  position?: [number, number, number];
  rotationSpeed?: number;
}

function CenterHorseModel({
  scale = 1.5,
  position = [0, 0, 0],
  rotationSpeed = 0.3,
}: CenterHorseModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF('/models/horse-main.glb');

  const clonedScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.depthWrite = true;
            mat.depthTest = true;
            mat.transparent = false;
          });
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default CenterHorseModel;

useGLTF.preload('/models/horse-main.glb');
