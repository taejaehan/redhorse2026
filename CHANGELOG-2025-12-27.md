# 2025-12-27 업데이트 내역

## 주요 기능 추가

### 1. 메인 페이지 개선
- 중앙 붉은 말 클릭 시 말풍선 표시 ("2026년은 붉은 말의 해!")
- 하단 조작 힌트 추가
  - 데스크탑: "좌클릭 회전 · 스크롤 확대/축소"
  - 모바일: "한 손가락 회전 · 두 손가락 확대/축소"
- "축하메세지 보기" 링크 추가 → /group-photo 이동
- 우측 상단 공유 버튼 추가
- 안내 문구 변경: "띠를 선택해서 신년운세를 확인하세요"

### 2. 축하메세지 페이지 (GroupPhotoPage) 개선
- 로딩 스크린 추가 (all_animal.png 이미지 사용)
- 동물 클릭 시 랜덤 새해 축하 메시지 말풍선 표시
- 말풍선이 카메라 이동 시에도 동물 위치 추적
- 카메라 조작 중이 아닐 때 자동으로 1~4개 말풍선 표시 (0.4초 간격 stagger)
- 빈 곳 클릭 시 말풍선 숨김
- 우측 상단 리프레시/공유 버튼 추가

### 3. 공유 기능 개선
- 모바일: Web Share API 사용 (네이티브 공유 다이얼로그)
- 데스크탑: 클립보드 복사만 수행 (시스템 공유 다이얼로그 안 뜸)
- FortuneOverlay, MainPage, GroupPhotoPage 모두 적용

### 4. 로딩 스크린 추가
- LoadingScreen.tsx: 메인 페이지용 (redhorse.png)
- FortuneLoadingScreen.tsx: 운세 페이지용 (12animal/*.png)
- GroupPhotoPage: 축하메세지 페이지용 (all_animal.png)

### 5. SEO / Open Graph 메타 태그
- index.html에 OG 메타 태그 추가
  - og:title, og:description, og:image
  - twitter:card, twitter:title, twitter:description, twitter:image
- react-helmet-async 설치 (SPA 동적 메타 태그용, 크롤러는 index.html 사용)

### 6. 파비콘 추가
- favicon.ico, favicon-16x16.png, favicon-32x32.png
- apple-touch-icon.png (iOS)
- android-chrome-192x192.png, android-chrome-512x512.png (Android)
- site.webmanifest (PWA 지원)

### 7. 기타 수정
- 디버그 모드 키 변경: 'r' → 'd/D/ㅇ'
- HTML lang 속성: "en" → "ko"
- 테마 컬러: #0a0a12 (어두운 배경색)

## 이미지 리소스 추가
- `/redhorse.png` - 메인 페이지 OG 이미지
- `/all_animal.png` - 축하메세지 페이지 이미지
- `/12animal/*.png` - 12간지별 이미지 (mouse, cow, tiger, rabbit, dragon, snake, horse, sheep, monkey, chicken, dog, pig)
- `/favicon_io/*` - 파비콘 세트

## 배포
- AWS S3 + CloudFront (fortune.137-5.com)
- 캐시 무효화 완료
