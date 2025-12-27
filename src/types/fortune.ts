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
  elementRelation: string;   // 상생/상극 (한국어)
  elementRelationEn: string; // 상생/상극 (영어)
  elementDescription: string; // 오행 설명 (한국어)
  elementDescriptionEn: string; // 오행 설명 (영어)
  // 행운 속성
  luckyColors: { name: string; nameEn: string; hex: string }[];
  luckyNumbers: number[];
  luckyDirection: string;
  luckyDirectionEn: string;
  // 궁합
  goodMatch: { sign: ZodiacSign; emoji: string; name: string; nameEn: string }[];
  badMatch: { sign: ZodiacSign; emoji: string; name: string; nameEn: string }[];
  // 조언
  adviceDont: string;
  adviceDontEn: string;
  adviceDo: string;
  adviceDoEn: string;
  quote: string[];  // 2줄 (한국어)
  quoteEn: string[];  // 2줄 (영어)
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

export const ZODIAC_INFO: Record<ZodiacSign, { nameKo: string; nameEn: string; emoji: string }> = {
  rat: { nameKo: '쥐', nameEn: 'Rat', emoji: '🐭' },
  ox: { nameKo: '소', nameEn: 'Ox', emoji: '🐮' },
  tiger: { nameKo: '호랑이', nameEn: 'Tiger', emoji: '🐯' },
  rabbit: { nameKo: '토끼', nameEn: 'Rabbit', emoji: '🐰' },
  dragon: { nameKo: '용', nameEn: 'Dragon', emoji: '🐲' },
  snake: { nameKo: '뱀', nameEn: 'Snake', emoji: '🐍' },
  horse: { nameKo: '말', nameEn: 'Horse', emoji: '🐴' },
  sheep: { nameKo: '양', nameEn: 'Sheep', emoji: '🐑' },
  monkey: { nameKo: '원숭이', nameEn: 'Monkey', emoji: '🐵' },
  rooster: { nameKo: '닭', nameEn: 'Rooster', emoji: '🐔' },
  dog: { nameKo: '개', nameEn: 'Dog', emoji: '🐶' },
  pig: { nameKo: '돼지', nameEn: 'Pig', emoji: '🐷' },
};
