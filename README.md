# 2026 병오년 운세 (Year of the Red Horse Fortune)

2026년 병오년(붉은 말의 해) 12간지 운세 사이트입니다.

**Live Site**: https://fortune.137-5.com

## Features

- **3D Interactive Experience**: Three.js 기반 12간지 3D 모델 및 인터랙션
- **12간지 운세**: 각 띠별 상세 운세 정보
  - 오행 관계 (상생/상극)
  - 행운의 색상, 숫자, 방향
  - 띠별 궁합
  - 맞춤 조언
- **가족사진 페이지**: 12간지 전체 모델 단체 사진
- **다국어 지원**: 한국어/영어 전환 가능
- **공유 기능**: SNS 공유 시 OG 메타태그 지원

## Tech Stack

- React 18 + TypeScript
- Vite
- Three.js / React Three Fiber / Drei
- React Router
- AWS S3 + CloudFront

## URLs

| 언어 | 메인 | 운세 | 단체사진 |
|------|------|------|----------|
| 한국어 | `/` | `/fortune/:sign` | `/group-photo` |
| English | `/en` | `/en/fortune/:sign` | `/en/group-photo` |

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
aws s3 sync dist/ s3://fortune.137-5.com --delete
aws cloudfront create-invalidation --distribution-id E2TBXF13XOVFW3 --paths "/*"
```

## Project Structure

```
src/
├── components/
│   ├── main/          # 메인 페이지 3D 컴포넌트
│   ├── fortune/       # 운세 페이지 컴포넌트
│   └── group/         # 단체사진 컴포넌트
├── contexts/          # LanguageContext
├── data/              # 운세 데이터 & 번역
├── pages/             # 페이지 컴포넌트
└── types/             # TypeScript 타입
public/
├── models/            # 3D GLB 모델
├── 12animal/          # 띠별 이미지
└── share/             # 공유용 정적 HTML (OG 태그)
    ├── ko/            # 한국어
    └── en/            # English
```

## Credits

- 3D Models: [VARCO 3D](https://3d.varco.ai/)
- Development: [코딩의세계](https://www.youtube.com/@creative-coding-world)
