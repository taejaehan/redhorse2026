import { Language } from '../contexts/LanguageContext';

type TranslationKey =
  // Loading screens
  | 'loadingMainTitle'
  | 'loadingMainSubtitle'
  | 'loadingFortuneTitle'
  | 'loadingFortuneSubtitle'
  // Main page
  | 'siteTitle'
  | 'siteDescription'
  | 'mainTitle'
  | 'mainSubtitle'
  | 'groupPhotoLink'
  | 'horseBubble1'
  | 'horseBubble2'
  | 'selectZodiac'
  | 'pleaseWait'
  | 'controlHintMobile'
  | 'controlHintDesktop'
  | 'shareTitle'
  | 'shareText'
  | 'linkCopied'
  // Fortune page
  | 'fortuneTitle'
  | 'fortuneDescription'
  | 'zodiacSuffix'
  | 'yearFire'
  | 'elementEarth'
  | 'elementWater'
  | 'elementWood'
  | 'elementMetal'
  | 'elementFire'
  | 'luckyColor'
  | 'luckyNumber'
  | 'goodMatch'
  | 'badMatch'
  | 'adviceDont'
  | 'adviceDo'
  | 'otherZodiac'
  // Group photo page
  | 'groupPhotoTitle'
  | 'groupPhotoDescription'
  | 'loadingTitle'
  | 'loadingSubtitle'
  | 'headerYear'
  | 'headerRedHorse'
  | 'footerNewYear'
  | 'footerBlessing'
  | 'footerWishes';

type Translations = Record<TranslationKey, string>;

const translations: Record<Language, Translations> = {
  ko: {
    // Loading screens
    loadingMainTitle: '2026 병오년',
    loadingMainSubtitle: '붉은 말의 해, 당신의 운세는?',
    loadingFortuneTitle: '{name}띠',
    loadingFortuneSubtitle: '2026년 운세를 불러오는 중...',
    // Main page
    siteTitle: '2026 병오년 운세 - 붉은 말의 해',
    siteDescription: '2026년 병오년 붉은 말의 해! 12간지 띠별 신년운세를 확인하세요.',
    mainTitle: '2026년 운세',
    mainSubtitle: '丙午年(붉은 말의해)',
    groupPhotoLink: '축하메세지 보기',
    horseBubble1: '2026년은 붉은 말의 해!',
    horseBubble2: '주변 동물을 선택하면<br />운세를 볼 수 있어요',
    selectZodiac: '띠를 선택해서 신년운세를 확인하세요',
    pleaseWait: '잠시만 기다려주세요...',
    controlHintMobile: '한 손가락 회전 · 두 손가락 확대/축소',
    controlHintDesktop: '좌클릭 회전 · 스크롤 확대/축소',
    shareTitle: '2026 병오년 운세',
    shareText: '2026년 붉은 말의 해! 나의 신년운세를 확인해보세요!',
    linkCopied: '링크가 복사되었습니다!',
    // Fortune page
    fortuneTitle: '2026 병오년 {name}띠 운세',
    fortuneDescription: '{emoji} {name}띠 2026년 신년운세 - {quote}',
    zodiacSuffix: '띠',
    yearFire: '火(불)',
    elementEarth: '흙',
    elementWater: '물',
    elementWood: '나무',
    elementMetal: '쇠',
    elementFire: '불',
    luckyColor: '행운색',
    luckyNumber: '행운숫자',
    goodMatch: '좋은궁합',
    badMatch: '주의',
    adviceDont: '조심할것:',
    adviceDo: '해야할것:',
    otherZodiac: '다른띠보기',
    // Group photo page
    groupPhotoTitle: '2026 병오년 새해 인사 - 12간지 축하 메시지',
    groupPhotoDescription: '2026년 병오년 붉은 말의 해! 12간지 동물들이 전하는 새해 축하 메시지를 확인하세요.',
    loadingTitle: '새해 인사',
    loadingSubtitle: '모두 새해 福 많이 받으세요!',
    headerYear: '丙午年',
    headerRedHorse: '2026 붉은 말의 해',
    footerNewYear: '모두 새해',
    footerBlessing: '福',
    footerWishes: '많이 받으세요',
  },
  en: {
    // Loading screens
    loadingMainTitle: '2026 Bingwu Year',
    loadingMainSubtitle: 'Year of the Red Horse,<br />what\'s your fortune?',
    loadingFortuneTitle: '{name}',
    loadingFortuneSubtitle: 'Loading your 2026 fortune...',
    // Main page
    siteTitle: '2026 Year of the Red Horse - Fortune',
    siteDescription: '2026 is the Year of the Red Fire Horse! Check your Chinese zodiac fortune.',
    mainTitle: '2026 Fortune',
    mainSubtitle: 'Year of the Red Horse',
    groupPhotoLink: 'View Greetings',
    horseBubble1: '2026 is the Year of the Red Horse!',
    horseBubble2: 'Select an animal to<br />see your fortune',
    selectZodiac: 'Select your zodiac sign to see your fortune',
    pleaseWait: 'Please wait...',
    controlHintMobile: 'One finger to rotate · Two fingers to zoom',
    controlHintDesktop: 'Left click to rotate · Scroll to zoom',
    shareTitle: '2026 Year of the Horse Fortune',
    shareText: '2026 is the Year of the Red Horse! Check your New Year fortune!',
    linkCopied: 'Link copied!',
    // Fortune page
    fortuneTitle: '2026 {name} Fortune',
    fortuneDescription: '{emoji} {name} 2026 Fortune - {quote}',
    zodiacSuffix: '',
    yearFire: 'Fire',
    elementEarth: 'Earth',
    elementWater: 'Water',
    elementWood: 'Wood',
    elementMetal: 'Metal',
    elementFire: 'Fire',
    luckyColor: 'Lucky Color',
    luckyNumber: 'Lucky Number',
    goodMatch: 'Good Match',
    badMatch: 'Caution',
    adviceDont: 'Avoid:',
    adviceDo: 'Focus:',
    otherZodiac: 'Other Signs',
    // Group photo page
    groupPhotoTitle: '2026 New Year Greetings - Chinese Zodiac',
    groupPhotoDescription: '2026 is the Year of the Red Horse! Check out the New Year greetings from all 12 zodiac animals.',
    loadingTitle: 'New Year Greetings',
    loadingSubtitle: 'Wishing you happiness and prosperity!',
    headerYear: '',
    headerRedHorse: '2026 Year of<br />the Red Horse',
    footerNewYear: 'Happy New Year',
    footerBlessing: 'Fortune',
    footerWishes: 'to All',
  },
};

// New Year messages for Group Photo page
export const newYearMessages: Record<Language, string[]> = {
  ko: [
    '새해 복 많이 받으세요!',
    '2026년 건강하고 행복하세요!',
    '올해는 좋은 일만 가득하길!',
    '만사형통하세요!',
    '부자 되세요!',
    '사랑 가득한 한 해 되세요!',
    '꿈꾸는 모든 것 이루세요!',
    '웃음 가득한 2026년!',
    '행운이 함께하길!',
    '늘 건강하세요!',
    '소원성취하세요!',
    '좋은 인연 가득하길!',
    '매일 행복하세요!',
    '승승장구하세요!',
    '대박나세요!',
  ],
  en: [
    'Happy New Year!',
    'Wishing you health and happiness in 2026!',
    'May good things fill your year!',
    'May all your wishes come true!',
    'Prosperity to you!',
    'A year full of love!',
    'May all your dreams come true!',
    'A joyful 2026!',
    'Good luck be with you!',
    'Stay healthy always!',
    'May your wishes come true!',
    'Great connections await!',
    'Be happy every day!',
    'Success in all you do!',
    'Jackpot year!',
  ],
};

export function useTranslation(lang: Language) {
  const t = (key: TranslationKey, replacements?: Record<string, string>) => {
    let text = translations[lang][key];
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return { t };
}

export default translations;
