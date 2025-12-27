import { ZodiacFortune } from '../../types/fortune';

interface FortuneOverlayProps {
  zodiac: ZodiacFortune;
  onBack?: () => void;
}

// 모바일 감지
const isMobile = () => {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window);
};

function FortuneOverlay({ zodiac, onBack }: FortuneOverlayProps) {
  const handleShare = async () => {
    const url = window.location.href;

    // 모바일에서만 Web Share API 사용
    if (isMobile() && navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: `2026 병오년 ${zodiac.nameKo}띠 운세`,
          text: `${zodiac.nameKo}띠 2026년 운세: ${zodiac.quote[0]} ${zodiac.quote[1]}`,
          url,
        });
        return;
      } catch (err) {
        // 사용자가 취소했거나 실패 - 아래 fallback으로
      }
    }

    // 클립보드 복사
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.readOnly = true;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, url.length);
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert('링크가 복사되었습니다!');
    } catch (err) {
      alert('링크가 복사되었습니다!');
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
            <span className="name">{zodiac.nameKo}띠</span>
          </div>
          <div className="element-right">
            <span className="element-year">2026</span>
            <span className="element-char fire">火<span className="element-ko">(불)</span></span>
            <span className="element-arrow">→</span>
            <span className={`element-char ${zodiac.element === '土' ? 'earth' : zodiac.element === '水' ? 'water' : zodiac.element === '木' ? 'wood' : zodiac.element === '金' ? 'metal' : 'fire'}`}>
              {zodiac.element}
              <span className="element-ko">
                ({zodiac.element === '土' ? '흙' : zodiac.element === '水' ? '물' : zodiac.element === '木' ? '나무' : zodiac.element === '金' ? '쇠' : '불'})
              </span>
            </span>
            <span className={`element-result ${zodiac.elementRelation === '상생' || zodiac.elementRelation === '동류' || zodiac.elementRelation === '극대화' ? 'good' : 'bad'}`}>
              {zodiac.elementRelation}
            </span>
          </div>
        </div>

        {/* 오행 설명 */}
        <div className="element-description">
          {zodiac.elementDescription}
        </div>

        {/* 2열 그리드: 왼쪽(색/숫자) 오른쪽(궁합) */}
        <div className="info-grid">
          <div className="info-left">
            <div className="info-item">
              <span className="info-label">행운색</span>
              <div className="color-dots">
                {zodiac.luckyColors.map((color, i) => (
                  <span key={i} className="dot" style={{ background: color.hex }}></span>
                ))}
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">행운숫자</span>
              <span className="info-value nums">{zodiac.luckyNumbers.join(' · ')}</span>
            </div>
          </div>
          <div className="info-right">
            <div className="info-item good">
              <span className="info-label">좋은궁합</span>
              <span className="info-value">
                {zodiac.goodMatch.map((m) => `${m.emoji}${m.name}`).join(' ')}
              </span>
            </div>
            <div className="info-item bad">
              <span className="info-label">주의</span>
              <span className="info-value">
                {zodiac.badMatch.map((m) => `${m.emoji}${m.name}`).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="fortune-bottom">
        <div className="share-row">
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
            <span className="icon">✕</span>
            <span className="text">{zodiac.adviceDont}</span>
          </div>
          <div className="advice-item do">
            <span className="icon">○</span>
            <span className="text">{zodiac.adviceDo}</span>
          </div>
        </div>
        <div className="main-quote">
          <p>{zodiac.quote[0]}</p>
          <p className="highlight">{zodiac.quote[1]}</p>
        </div>
      </div>
    </div>
  );
}

export default FortuneOverlay;
