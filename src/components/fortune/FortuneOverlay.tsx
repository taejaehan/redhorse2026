import { useNavigate } from 'react-router-dom';
import { ZodiacFortune } from '../../types/fortune';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../data/translations';

const BASE_URL = 'https://fortune.137-5.com';

interface FortuneOverlayProps {
  zodiac: ZodiacFortune;
  onBack?: () => void;
}

// 모바일 감지
const isMobile = () => {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window);
};

// 오행 영어 매핑
const ELEMENT_MAP: Record<string, { ko: string; en: string }> = {
  '土': { ko: '흙', en: 'Earth' },
  '水': { ko: '물', en: 'Water' },
  '木': { ko: '나무', en: 'Wood' },
  '金': { ko: '쇠', en: 'Metal' },
  '火': { ko: '불', en: 'Fire' },
};

function FortuneOverlay({ zodiac, onBack }: FortuneOverlayProps) {
  const navigate = useNavigate();
  const { lang, basePath, isEnglish } = useLanguage();
  const { t } = useTranslation(lang);

  // 영어/한국어에 맞는 값들
  const name = isEnglish ? zodiac.nameEn : zodiac.nameKo;
  const elementRelation = isEnglish ? zodiac.elementRelationEn : zodiac.elementRelation;
  const elementDescription = isEnglish ? zodiac.elementDescriptionEn : zodiac.elementDescription;
  const adviceDont = isEnglish ? zodiac.adviceDontEn : zodiac.adviceDont;
  const adviceDo = isEnglish ? zodiac.adviceDoEn : zodiac.adviceDo;
  const quote = isEnglish ? zodiac.quoteEn : zodiac.quote;
  const elementText = isEnglish ? ELEMENT_MAP[zodiac.element]?.en : ELEMENT_MAP[zodiac.element]?.ko;

  // 공유 URL
  const shareUrl = isEnglish
    ? `${BASE_URL}/share/en/fortune/${zodiac.sign}/index.html`
    : `${BASE_URL}/share/fortune/${zodiac.sign}/index.html`;

  const handleShare = async () => {
    if (isMobile() && navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: isEnglish ? `2026 ${zodiac.nameEn} Fortune` : `2026 병오년 ${zodiac.nameKo}띠 운세`,
          text: isEnglish ? `${zodiac.nameEn} 2026 Fortune!` : `${zodiac.nameKo}띠 2026년 운세를 확인하세요!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // 사용자가 취소했거나 실패 - 아래 fallback으로
      }
    }

    // 클립보드 복사
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.readOnly = true;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, shareUrl.length);
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert(t('linkCopied'));
    } catch (err) {
      alert(t('linkCopied'));
    }
  };

  return (
    <div className="fortune-overlay">
      {/* 상단 */}
      <div className="fortune-top">
        {/* 띠 + 오행 (같은 줄) */}
        <div className="header-row">
          <div className="zodiac-left">
            {onBack && (
              <button className="back-btn" onClick={onBack}>
                &lt;
              </button>
            )}
            <span className="emoji">{zodiac.emoji}</span>
            <span className="name">{name}{t('zodiacSuffix')}</span>
          </div>
          <div className="element-right">
            <span className="element-year">2026</span>
            <span className="element-char fire">
              {isEnglish ? 'Fire' : '火'}
              {!isEnglish && <span className="element-ko">(불)</span>}
            </span>
            <span className="element-arrow">→</span>
            <span className={`element-char ${zodiac.element === '土' ? 'earth' : zodiac.element === '水' ? 'water' : zodiac.element === '木' ? 'wood' : zodiac.element === '金' ? 'metal' : 'fire'}`}>
              {isEnglish ? ELEMENT_MAP[zodiac.element]?.en : zodiac.element}
              {!isEnglish && <span className="element-ko">({elementText})</span>}
            </span>
            <span className={`element-result ${zodiac.elementRelation === '상생' || zodiac.elementRelation === '동류' || zodiac.elementRelation === '극대화' ? 'good' : 'bad'}`}>
              {elementRelation}
            </span>
          </div>
        </div>

        {/* 오행 설명 */}
        <div className="element-description">
          {elementDescription}
        </div>

        {/* 2열 그리드: 왼쪽(색/숫자) 오른쪽(궁합) */}
        <div className="info-grid">
          <div className="info-left">
            <div className="info-item">
              <span className="info-label">{t('luckyColor')}</span>
              <div className="color-dots">
                {zodiac.luckyColors.map((color, i) => (
                  <span key={i} className="dot" style={{ background: color.hex }}></span>
                ))}
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">{t('luckyNumber')}</span>
              <span className="info-value nums">{zodiac.luckyNumbers.join(' · ')}</span>
            </div>
          </div>
          <div className="info-right">
            <div className="info-item good">
              <span className="info-label">{t('goodMatch')}</span>
              <span className="info-value">
                {zodiac.goodMatch.map((m) => `${m.emoji}${isEnglish ? m.nameEn : m.name}`).join(' ')}
              </span>
            </div>
            <div className="info-item bad">
              <span className="info-label">{t('badMatch')}</span>
              <span className="info-value">
                {zodiac.badMatch.map((m) => `${m.emoji}${isEnglish ? m.nameEn : m.name}`).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="fortune-bottom">
        <div className="share-row">
          <button className="other-zodiac-btn" onClick={() => navigate(basePath || '/')}>
            {t('otherZodiac')}
          </button>
          <button className="share-btn" onClick={handleShare}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        <div className="advice-row">
          <div className="advice-item dont">
            <span className="icon">{t('adviceDont')}</span>
            <span className="text">{adviceDont}</span>
          </div>
          <div className="advice-item do">
            <span className="icon">{t('adviceDo')}</span>
            <span className="text">{adviceDo}</span>
          </div>
        </div>
        <div className="main-quote">
          <p>{quote[0]}</p>
          <p className="highlight">{quote[1]}</p>
        </div>
      </div>
    </div>
  );
}

export default FortuneOverlay;
