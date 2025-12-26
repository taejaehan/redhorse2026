# 2026 병오년 운세 사이트

## 프로젝트 개요
- **목적**: 2026년 붉은 말의 해(병오년) 12간지 운세 사이트
- **용도**: 유튜브 숏폼용 녹화 (1080x1920 세로)
- **기술 스택**: React + TypeScript + Vite + React Three Fiber (R3F) + React Router

---

## 현재 구현 완료

### 1. 메인 화면 (`MainPage.tsx`)
- **3D 씬 기반** 완전 개편
- **중앙**: `horse-main.glb` (Y축 턴테이블 회전, 속도 0.3)
- **핀 스포트라이트**: 중앙 말에 위에서 아래로 비추는 스포트라이트
- **주변**: 12간지 3D 모델 원형 배치 (반지름 2.25)
  - 정지 상태, 바깥 방향 바라봄
  - 중앙 말과 반대 방향으로 원 전체 회전 (속도 0.15)
  - 각 모델 아래 한글 라벨 표시
- **카메라 컨트롤** (OrbitControls)
  - 줌: 현재 거리 ~ 3배 줌인
  - 상하 회전: 위로 10도, 아래로 35도 제한
  - 좌우 회전: 무제한
  - 모바일: 한 손가락 회전, 두 손가락 줌+회전 (DOLLY_ROTATE)

### 2. 동물 선택 트랜지션
- **스포트라이트 효과**: 선택한 동물에 핀 스포트라이트 점등
- **카메라 줌인**: 선택한 동물로 카메라 이동 (상하 10도 각도)
- **페이지 전환**: 1.2초 애니메이션 후 디테일 페이지로 이동

### 3. 운세 화면 (`FortunePage.tsx`)
- **3D 모델**: GLB 파일 로드 및 애니메이션 재생
- **카메라 회전**: 오브젝트 고정, 카메라가 주위를 회전
  - Z-up 좌표계 사용
  - 앞면 (90~270°): 1.5배속
  - 뒷면 (0~90°, 270~360°): 6배속
  - -Y 방향에서 시작
- **HTML 오버레이**: 운세 정보 표시 (FortuneOverlay)
  - 상단: 띠 이름, 오행 관계, 행운색/숫자, 궁합
  - 하단: 조언(하지말것/할것), 명언
- **뒤로가기 버튼**: `<` 버튼으로 메인 이동

### 4. 반응형 디자인 (FortunePage)
- **CSS 변수 기반 스케일링**: `--fortune-scale`
- **브레이크포인트**:
  - 1080x1920 (기준): scale 1.0
  - 모바일 (≤480px): scale 0.38, 스크롤 가능
  - 태블릿 (481~768px): scale 0.55
  - 작은 데스크탑 (769~1080px): scale 0.65
  - 가로 모드 (≥769px, 가로비율): 3D 배경 + 우측 오버레이 패널
- **iOS 대응**: viewport-fit=cover, safe-area-inset 패딩

### 5. 가족사진 페이지 (`GroupPhotoPage.tsx`)
- **경로**: `/group-photo`
- **레이아웃**: 3열 엇갈림 배치 (1열 4마리, 2열 5마리, 3열 4마리)
- **중앙 말**: 1열 중앙에 메인 말 (scale 1.1)
- **12간지**: 메인 말 주변으로 옹기종기 배치 (scale 0.7)

### 6. URL 라우팅 (React Router)
- `/` - 메인 페이지
- `/fortune/:sign` - 운세 페이지 (예: `/fortune/ox`, `/fortune/tiger`)
- `/group-photo` - 가족사진 페이지
- 공유 가능한 URL
- 브라우저 뒤로가기 지원

### 7. 디버그 모드 (키보드 `r` 또는 `ㄱ`)
- OrbitControls 활성화
- AxesHelper, GridHelper 표시
- 카메라 자동 회전 중지

### 8. 애니메이션 컨트롤 (키보드)
- `1`: 기본 포즈 (애니메이션 정지)
- `2`: 애니메이션 재생 (루프)

### 9. 12간지 데이터 (`fortuneData.ts`)
각 띠별 포함 정보:
- 기본 오행 (水, 土, 木, 火, 金) + 한글 표기 (물, 흙, 나무, 불, 쇠)
- 오행 관계 (상생/상극/동류/극대화/소모)
- 오행 설명
- 행운색 (hex 코드 포함)
- 행운숫자
- 행운방향
- 좋은궁합 / 주의궁합
- 조언 (하지말것 / 할것)
- 명언 (2줄)

---

## 파일 구조

```
src/
├── data/
│   └── fortuneData.ts          # 12띠 운세 JSON 데이터
├── types/
│   └── fortune.ts              # 타입 정의
├── components/
│   ├── TurntableModel.tsx      # 3D 모델 + 애니메이션 (디테일용)
│   ├── main/
│   │   ├── MainScene.tsx       # 메인 3D 씬 (조명, 스포트라이트, 컨트롤)
│   │   ├── CenterHorseModel.tsx # 중앙 말 모델 (Y축 회전)
│   │   ├── ZodiacCircle3D.tsx  # 12간지 원형 배치 (반대 회전)
│   │   ├── ZodiacModel.tsx     # 개별 동물 모델 + 라벨
│   │   ├── ZodiacCircle.tsx    # (미사용) 기존 2D 버전
│   │   └── ZodiacItem.tsx      # (미사용) 기존 2D 버전
│   └── fortune/
│       └── FortuneOverlay.tsx  # HTML 오버레이 (운세 표시)
├── pages/
│   ├── MainPage.tsx            # 메인 (3D 띠 선택)
│   ├── FortunePage.tsx         # 운세 화면 (3D + 오버레이)
│   └── GroupPhotoPage.tsx      # 가족사진 페이지
├── App.tsx                     # React Router 설정
└── index.css                   # 전체 스타일 + 반응형

public/
└── models/
    ├── horse-main.glb          # 메인 중앙 말
    ├── mouse.glb / mouse-ani.glb       # 쥐
    ├── cow.glb / cow-ani.glb           # 소
    ├── tiger.glb / tiger-ani.glb       # 호랑이
    ├── rabbit.glb / rabbit-ani.glb     # 토끼
    ├── dragon.glb / dragon-ani.glb     # 용
    ├── snake.glb / snake-ani.glb       # 뱀
    ├── horse.glb / horse-ani.glb       # 말
    ├── sheep.glb / sheep-ani.glb       # 양
    ├── monkey.glb / monkey-ani.glb     # 원숭이
    ├── chicken.glb / chicken-ani.glb   # 닭
    ├── dog.glb / dog-ani.glb           # 개
    └── pig.glb / pig-ani.glb           # 돼지
```

---

## 모델 매핑

### 메인 페이지 (정적 모델)
| 띠 | 파일명 |
|---|---|
| rat (쥐) | mouse.glb |
| ox (소) | cow.glb |
| tiger (호랑이) | tiger.glb |
| rabbit (토끼) | rabbit.glb |
| dragon (용) | dragon.glb |
| snake (뱀) | snake.glb |
| horse (말) | horse.glb |
| sheep (양) | sheep.glb |
| monkey (원숭이) | monkey.glb |
| rooster (닭) | chicken.glb |
| dog (개) | dog.glb |
| pig (돼지) | pig.glb |

### 디테일 페이지 (애니메이션 모델)
위와 동일하게 `-ani.glb` 사용

### 특수 위치 조정
- **원숭이**: x = -5 (애니메이션이 +x에서 시작하므로)
- **호랑이**: y = 0.5 (애니메이션이 +y에서 시작하므로)

---

## 실행 방법

```bash
# 개발 서버
npm run dev

# 네트워크 접근 (모바일 테스트)
npm run dev -- --host

# 빌드
npm run build
```

---

## 키보드 단축키

| 키 | 기능 |
|---|---|
| `r` / `ㄱ` | 디버그 모드 토글 |
| `1` | 기본 포즈 |
| `2` | 애니메이션 재생 |

---

## 주요 설정값

| 항목 | 값 | 위치 |
|---|---|---|
| 12간지 원 반지름 | 2.25 | ZodiacCircle3D.tsx |
| 12간지 원 회전속도 | 0.15 | ZodiacCircle3D.tsx |
| 중앙 말 회전속도 | 0.3 | MainScene.tsx |
| 중앙 말 위치 | [0, 0.2, 0] | MainScene.tsx |
| 메인 카메라 위치 | [0, 8, 12] | MainPage.tsx |
| 디테일 카메라 위치 | [0, 5, 3.5] | FortunePage.tsx |
| 디테일 모델 위치 | [0, 2.5, -1.5] | FortunePage.tsx |
| 카메라 회전 반지름 | 5 | FortunePage.tsx (CameraRig) |
| 앞면 속도 | 0.3 * 1.5 | FortunePage.tsx |
| 뒷면 속도 | 0.3 * 6 | FortunePage.tsx |
| 핀 스포트라이트 강도 | 500 | MainScene.tsx |

---

## AWS 배포 (S3 + CloudFront)

SPA 라우팅을 위해 CloudFront 설정 필요:

**Error Pages 설정:**
- HTTP Error Code: 403, 404
- Customize Error Response: Yes
- Response Page Path: `/index.html`
- HTTP Response Code: 200

---

## TODO (남은 작업)

### 기능
- [ ] 녹화 기능 (QuickTime 사용 예정)

### 완료
- [x] 핀 스포트라이트 (메인 중앙 말)
- [x] 동물 선택 시 스포트라이트 + 줌인 트랜지션
- [x] 가족사진 페이지
- [x] 모바일 반응형 (iOS safe-area 대응)
- [x] 모바일 터치 컨트롤 (핀치 줌 + 회전)
