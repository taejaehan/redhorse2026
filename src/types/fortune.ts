export type ZodiacSign =
  | 'rat' | 'ox' | 'tiger' | 'rabbit'
  | 'dragon' | 'snake' | 'horse' | 'sheep'
  | 'monkey' | 'rooster' | 'dog' | 'pig';

export interface ZodiacFortune {
  sign: ZodiacSign;
  nameKo: string;
  nameEn: string;
  emoji: string;
  years: number[];
  // 오행 정보
  element: string;           // 기본 오행 (水, 土, 木, 火, 金)
  elementRelation: string;   // 상생/상극
  elementDescription: string; // 오행 설명
  // 행운 속성
  luckyColors: { name: string; hex: string }[];
  luckyNumbers: number[];
  luckyDirection: string;
  // 궁합
  goodMatch: { sign: ZodiacSign; emoji: string; name: string }[];
  badMatch: { sign: ZodiacSign; emoji: string; name: string }[];
  // 조언
  adviceDont: string;
  adviceDo: string;
  quote: string[];  // 2줄
}

export interface FortuneData {
  year: number;
  yearName: string;
  yearAnimal: string;
  zodiacs: ZodiacFortune[];
}

export const ZODIAC_ORDER: ZodiacSign[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'
];

export interface Section {
  id: string;
  duration: number;
}

export const ZODIAC_INFO: Record<ZodiacSign, { nameKo: string; emoji: string }> = {
  rat: { nameKo: '쥐', emoji: '🐭' },
  ox: { nameKo: '소', emoji: '🐮' },
  tiger: { nameKo: '호랑이', emoji: '🐯' },
  rabbit: { nameKo: '토끼', emoji: '🐰' },
  dragon: { nameKo: '용', emoji: '🐲' },
  snake: { nameKo: '뱀', emoji: '🐍' },
  horse: { nameKo: '말', emoji: '🐴' },
  sheep: { nameKo: '양', emoji: '🐑' },
  monkey: { nameKo: '원숭이', emoji: '🐵' },
  rooster: { nameKo: '닭', emoji: '🐔' },
  dog: { nameKo: '개', emoji: '🐶' },
  pig: { nameKo: '돼지', emoji: '🐷' },
};
