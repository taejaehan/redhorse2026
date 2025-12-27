import { useState } from 'react';
import { Text } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { ZodiacSign, ZODIAC_INFO } from '../../types/fortune';
import { useLanguage } from '../../contexts/LanguageContext';

interface ZodiacItemProps {
  sign: ZodiacSign;
  position: [number, number, number];
  onClick: (sign: ZodiacSign) => void;
  isAvailable: boolean;
}

function ZodiacItem({ sign, position, onClick, isAvailable }: ZodiacItemProps) {
  const [hovered, setHovered] = useState(false);
  const { isEnglish } = useLanguage();
  const info = ZODIAC_INFO[sign];

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isAvailable) {
      onClick(sign);
    }
  };

  const name = isEnglish ? info.nameEn : `${info.nameKo}띠`;

  return (
    <group position={position}>
      <mesh
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial
          color={hovered && isAvailable ? '#ff6b6b' : isAvailable ? '#4a4a6a' : '#2a2a3a'}
          transparent
          opacity={isAvailable ? 1 : 0.5}
        />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.5}
        color={isAvailable ? '#ffffff' : '#666666'}
        anchorX="center"
        anchorY="middle"
      >
        {info.emoji}
      </Text>
      <Text
        position={[0, -0.85, 0]}
        fontSize={0.18}
        color={isAvailable ? '#cccccc' : '#555555'}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

export default ZodiacItem;
