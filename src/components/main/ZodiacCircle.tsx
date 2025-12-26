import { ZodiacSign, ZODIAC_ORDER } from '../../types/fortune';
import ZodiacItem from './ZodiacItem';

interface ZodiacCircleProps {
  onSelect: (sign: ZodiacSign) => void;
  availableSigns: ZodiacSign[];
}

const RADIUS = 1.9;

function ZodiacCircle({ onSelect, availableSigns }: ZodiacCircleProps) {
  return (
    <group rotation={[0, 0, 0]}>
      {ZODIAC_ORDER.map((sign, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS;

        return (
          <ZodiacItem
            key={sign}
            sign={sign}
            position={[x, y, 0]}
            onClick={onSelect}
            isAvailable={availableSigns.includes(sign)}
          />
        );
      })}
    </group>
  );
}

export default ZodiacCircle;
