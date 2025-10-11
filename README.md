# 🍖 SMEats - 급식 식자재 B2B 마켓플레이스

**최저가 보장, 레시피 기반 자동 발주로 급식 운영을 혁신합니다**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-green?logo=supabase)](https://supabase.com/)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [핵심 기능](#-핵심-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 사용자 플로우](#-주요-사용자-플로우)
- [배포 가이드](#-배포-가이드)

---

## 🎯 프로젝트 소개

**SMEats**는 급식 운영자와 식자재 판매자를 연결하는 B2B 마켓플레이스입니다.

### 문제 정의

기존 급식 식자재 조달 과정의 문제점:
- 📞 **비효율적인 발주**: 전화/팩스 기반 수동 발주
- 💰 **가격 비교 어려움**: 여러 업체 가격 일일이 확인
- 📋 **복잡한 재료 계산**: 인분수 계산 시 수작업 오류 발생
- 🚚 **배송 권역 불명확**: 배송 가능 여부 사전 확인 어려움

### 솔루션

1. **🔍 스마트 검색**: 배송 권역 내 상품만 자동 필터링
2. **💵 최저가 보장**: 동일 상품 최저가 실시간 표시
3. **📊 레시피 기반 발주**: 인분수 입력만으로 필요 재료 자동 계산
4. **📦 원클릭 주문**: 장바구니에서 한 번에 주문 완료
5. **📱 실시간 추적**: 주문 상태 실시간 확인

---

## ✨ 핵심 기능

### 고객 (급식 운영자)

#### 🛒 상품 검색 & 비교
- 전체 텍스트 검색, 카테고리/가격 필터
- **최저가 자동 표시**: 동일 상품 중 최저가 배지
- 배송 권역 필터 (주소 기준)

#### 🍲 레시피 기반 발주
- **1~200인분 자동 계산**: 슬라이더로 인분수 선택
- **재료 자동 매칭**: 레시피 → 실제 상품 매칭
- 실시간 가격 계산 및 원클릭 장바구니 담기

#### 🛍️ 스마트 장바구니
- 판매자별 자동 그룹핑
- 실시간 수량 조절 및 금액 계산
- 로컬스토리지 자동 저장

#### 📦 주문 관리
- 주문 상태 추적 (접수 → 준비 → 배송 → 완료)
- 상세 내역 확인 및 취소 기능

### 판매자 (마트/도매상)

- 상품 등록 (이미지, 가격, 재고 관리)
- 주문 관리 및 상태 변경
- 배송 권역 설정 (반경/행정구역)

### 시스템

- **이메일 인증**: Supabase Auth
- **권한 관리**: Customer / Seller / Admin
- **성능 최적화**: Next.js SSR, Edge Functions
- **보안**: Row Level Security, Atomic Transaction

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | Next.js 15.5, React 19, TypeScript 5, Tailwind CSS 4 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage), Deno Edge Functions |
| **Validation** | Zod 4 |
| **Hosting** | Vercel (추천) / Netlify |

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.17+
- npm 9.0+
- Supabase 계정

### Quick Start

```bash
# 1. 클론 및 설치
git clone https://github.com/your-username/smeats.git
cd smeats
npm install

# 2. 환경 변수 설정
cp .env.local.example .env.local
# .env.local에 Supabase 정보 입력

# 3. 데이터베이스 설정
# Supabase SQL Editor에서 실행:
# - db/040_storage_policies.sql
# - db/050_rpc_functions.sql
# - db/060_buyer_seller_enhancements.sql  # 구매자/판매자 기능 확장

# 4. Edge Function 배포
npm install -g supabase
supabase login
supabase link --project-ref your-project-id
supabase functions deploy place-order

# 5. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 📂 프로젝트 구조

```
smeats/
├── src/
│   ├── app/
│   │   ├── (auth)/           # 로그인/회원가입
│   │   └── (portal)/          # 고객/판매자 페이지
│   │       ├── products/      # 상품 검색
│   │       ├── recipes/       # 레시피 계산기
│   │       ├── cart/          # 장바구니
│   │       └── orders/        # 주문 내역
│   ├── components/            # UI 컴포넌트
│   ├── server/actions/        # API (Server Actions)
│   └── lib/                   # 유틸리티
├── supabase/functions/        # Edge Functions
├── db/                        # SQL 마이그레이션
└── DEPLOYMENT_SUMMARY.md      # 배포 가이드
```

---

## 🎬 주요 사용자 플로우

### 상품 주문 플로우
```
회원가입 → 이메일 인증 → 상품 검색 → 장바구니 → 주문 → 추적
```

### 레시피 발주 플로우
```
레시피 선택 → 인분 수 입력 → 재료 자동 계산 → 장바구니 → 주문
```

**핵심 알고리즘**:
- **최저가 그룹핑**: (상품명, 단위) 기준 자동 그룹핑 → 최저가 표시
- **레시피 계산**: `재료 × 인분수 = 필요량` → 실제 상품 자동 매칭
- **재고 관리**: Edge Function에서 Atomic Transaction으로 검증 & 차감

---

## 🌐 배포 가이드

### Vercel 배포

```bash
# 1. Vercel 배포
npm i -g vercel
vercel login
vercel

# 2. 환경 변수 설정
# Vercel Dashboard → Settings → Environment Variables
# .env.local.example의 모든 변수 추가

# 3. 도메인 연결 (선택)
# Vercel Dashboard → Domains
```

### 환경 변수

```bash
# 필수
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 선택 (개발용)
NEXT_PUBLIC_BYPASS_DELIVERY_FILTER=false
NEXT_PUBLIC_FEATURE_DISTRICT=false
```

자세한 배포 가이드: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

## 🧪 테스트 체크리스트

1. ✅ 회원가입 (customer role)
2. ✅ 이메일 인증
3. ✅ 상품 검색 및 최저가 확인
4. ✅ 레시피 선택 및 인분 계산
5. ✅ 장바구니 담기
6. ✅ 주문하기 (재고 차감 확인)
7. ✅ 주문 내역 확인

---

## 🤝 기여하기

1. Fork this repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request

**커밋 컨벤션**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

---

## 🗺️ 로드맵

### v1.0 (MVP) ✅
- [x] 고객 상품 검색 & 주문
- [x] 레시피 기반 발주
- [x] 장바구니 & 주문 관리
- [x] 이메일 인증
- [x] 최저가 표시

### v1.1 (예정)
- [ ] 판매자 대시보드
- [ ] 주문 알림 (이메일/SMS)
- [ ] 배송 추적
- [ ] GMV 통계

### v2.0 (장기)
- [ ] PostGIS 반경 필터
- [ ] AI 추천 시스템
- [ ] 모바일 앱
- [ ] 다국어 지원

---

## 📝 라이선스

MIT License - 자유롭게 사용하세요

---

## 📞 문의

- **GitHub Issues**: [이슈 등록](https://github.com/your-username/smeats/issues)
- **Email**: support@smeats.com

---

<p align="center">
  Made with ❤️ by SMEats Team
</p>
