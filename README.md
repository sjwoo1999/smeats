# 🍖 SMEats - 급식 식자재 B2B 마켓플레이스

**최저가 보장, 레시피 기반 자동 발주로 급식 운영을 혁신합니다**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [핵심 기능](#-핵심-기능)
- [데모 모드](#-데모-모드)
- [기술 스택](#️-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [아키텍처](#-아키텍처)
- [주요 사용자 플로우](#-주요-사용자-플로우)
- [배포 가이드](#-배포-가이드)
- [문서](#-문서)

---

## 🎯 프로젝트 소개

**SMEats**는 급식 운영자(구매자)와 식자재 판매자를 연결하는 B2B 마켓플레이스입니다. 소상공인 급식 운영의 디지털 전환을 통해 효율적인 식자재 조달을 지원합니다.

### 문제 정의

기존 급식 식자재 조달 과정의 문제점:
- 📞 **비효율적인 발주**: 전화/팩스 기반 수동 발주로 시간 낭비
- 💰 **가격 비교 어려움**: 여러 업체 가격을 일일이 확인해야 하는 번거로움
- 📋 **복잡한 재료 계산**: 인분수 계산 시 수작업으로 인한 오류 발생
- 🚚 **배송 권역 불명확**: 배송 가능 여부를 사전에 확인하기 어려움
- 📊 **주문 관리 부재**: 주문 내역 및 배송 상태 추적 시스템 부재

### 솔루션

1. **🔍 스마트 검색**: 배송 권역 내 상품만 자동 필터링
2. **💵 최저가 보장**: 동일 상품 최저가 실시간 표시
3. **📊 레시피 기반 발주**: 인분수 입력만으로 필요 재료 자동 계산
4. **📦 원클릭 주문**: 장바구니에서 한 번에 주문 완료
5. **📱 실시간 추적**: 주문 상태 실시간 확인
6. **👥 멀티 페르소나**: 구매자/판매자/관리자 맞춤 대시보드

---

## ✨ 핵심 기능

### 🛒 고객 (급식 운영자 - Buyer)

#### 상품 검색 & 비교
- **전체 텍스트 검색**: 상품명, 카테고리, 설명 통합 검색
- **최저가 자동 표시**: 동일 상품군 중 최저가 배지로 표시
- **배송 권역 필터**: 주소 기반 배송 가능 상품만 노출
- **다양한 필터**: 카테고리, 가격대, 판매자별 필터

#### 레시피 기반 발주
- **1~200인분 자동 계산**: 슬라이더로 간편한 인분수 선택
- **재료 자동 매칭**: 레시피 재료 → 실제 상품 자동 매칭
- **실시간 가격 계산**: 인분수별 총 금액 즉시 계산
- **원클릭 장바구니**: 필요한 모든 재료를 한 번에 장바구니 담기

#### 스마트 장바구니
- **판매자별 자동 그룹핑**: 동일 판매자 상품 자동 묶음
- **실시간 수량 조절**: 수량 변경 시 금액 즉시 반영
- **로컬스토리지 저장**: 브라우저 종료 후에도 장바구니 유지
- **배송비 자동 계산**: 판매자별 배송비 정책 자동 적용

#### 주문 관리
- **주문 상태 추적**: 접수 → 준비중 → 배송중 → 완료 단계별 추적
- **주문 상세 내역**: 주문일시, 상품목록, 금액, 배송정보 확인
- **주문 취소**: 접수 단계에서 주문 취소 가능

#### 프로필 관리
- **개인정보 수정**: 상호명, 연락처, 주소 관리
- **주소 검색**: Juso API 연동 정확한 주소 입력
- **지역 설정**: 배송 권역 필터를 위한 지역 설정

### 🏪 판매자 (마트/도매상 - Seller)

#### 상품 관리
- **상품 등록/수정**: 이미지, 가격, 재고, 카테고리 관리
- **가격 책정**: 판매가격 및 할인 설정
- **재고 관리**: 실시간 재고 수량 추적
- **대량 업로드**: CSV를 통한 다량 상품 일괄 등록

#### 주문 관리
- **주문 접수**: 신규 주문 실시간 알림
- **주문 상태 변경**: 준비중 → 배송중 → 완료 처리
- **주문 내역 조회**: 날짜별, 상태별 주문 조회
- **매출 통계**: 일/주/월별 매출 현황

#### 배송 설정
- **배송 권역 설정**: 반경 또는 행정구역 기반 배송 지역 설정
- **배송비 정책**: 기본 배송비 및 무료 배송 기준 설정

#### 판매자 대시보드
- **실시간 통계**: 주문건수, 매출액, 인기상품
- **주문 요약**: 오늘의 주문, 처리 대기 현황
- **재고 알림**: 품절 임박 상품 알림

### ⚙️ 관리자 (플랫폼 운영 - Admin)

#### 사용자 관리
- **회원 조회**: 전체 사용자 목록 및 상세정보
- **권한 관리**: 역할(buyer/seller/admin) 변경
- **계정 상태**: 활성/비활성 관리

#### 상품 관리
- **전체 상품 조회**: 판매자별 상품 목록
- **상품 승인**: 신규 상품 등록 승인 프로세스
- **상품 정보 수정**: 부적절한 내용 관리

#### 플랫폼 통계
- **GMV 분석**: 총 거래액, 주문건수, 평균 주문액
- **사용자 통계**: 신규 가입, 활성 사용자
- **리포트 생성**: 기간별 비즈니스 리포트

---

## 🎭 데모 모드

SMEats는 **Demo Mode**를 지원하여 Supabase 설정 없이도 전체 기능을 체험할 수 있습니다.

### Demo Mode 활성화 조건

1. **자동 활성화**: Supabase 환경변수가 설정되지 않은 경우
2. **수동 활성화**: `.env.local`에 `NEXT_PUBLIC_DEMO_MODE=true` 설정

### 페르소나 선택

Demo Mode에서는 3가지 페르소나로 시스템을 탐색할 수 있습니다:

#### 👩‍🍳 구매자 (Buyer)
- **접근 경로**: 홈페이지에서 "구매자로 체험하기" 선택
- **체험 기능**:
  - 상품 검색 및 필터링
  - 레시피 기반 발주 계산
  - 장바구니 담기 및 주문
  - 주문 내역 조회
  - 프로필 관리

#### 🏪 판매자 (Seller)
- **접근 경로**: 홈페이지에서 "판매자로 체험하기" 선택
- **체험 기능**:
  - 판매자 대시보드
  - 상품 등록 및 관리
  - 주문 접수 및 처리
  - 가격 책정
  - 매출 통계

#### ⚙️ 관리자 (Admin)
- **접근 경로**: 홈페이지에서 "관리자로 체험하기" 선택
- **체험 기능**:
  - 관리자 대시보드
  - 전체 사용자 관리
  - 전체 상품 관리
  - 플랫폼 통계 및 리포트

### 데모 데이터

Demo Mode에서는 다음과 같은 Mock 데이터를 제공합니다:
- **상품**: 40+ 다양한 식자재 상품 (채소, 과일, 육류, 수산물 등)
- **레시피**: 10+ 인기 급식 레시피
- **주문**: 각 페르소나별 샘플 주문 내역
- **사용자**: 각 역할별 샘플 프로필

자세한 내용은 [DEMO_GUIDE.md](./DEMO_GUIDE.md)를 참고하세요.

---

## 🛠️ 기술 스택

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.5 | React 프레임워크 (App Router, Server Actions) |
| **React** | 19.1 | UI 라이브러리 |
| **TypeScript** | 5.x | 타입 안정성 |
| **Tailwind CSS** | 4.x | 유틸리티 퍼스트 CSS 프레임워크 |
| **Zod** | 4.1 | 런타임 타입 검증 |
| **clsx** | 2.1 | 조건부 클래스명 관리 |

### Backend & Infrastructure

| 기술 | 용도 |
|------|------|
| **Supabase** | PostgreSQL 데이터베이스, 인증, 스토리지 |
| **Supabase Auth** | 이메일 인증, 역할 기반 접근 제어 (RBAC) |
| **Supabase Storage** | 상품 이���지 저장 |
| **Row Level Security** | 데이터베이스 보안 정책 |
| **Edge Functions** | 서버리스 함수 (주문 처리) |

### External APIs

| API | 용도 |
|-----|------|
| **Juso API** | 도로명 주소 검색 및 행정구역 코드 조회 |

### Development Tools

| 도구 | 용도 |
|------|------|
| **ESLint** | 코드 품질 검사 |
| **Turbopack** | 빌드 최적화 (Next.js 15) |
| **Git** | 버전 관리 |

---

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: 18.17 이상
- **npm**: 9.0 이상
- **Supabase 계정** (프로덕션 환경)
- **Juso API 키** (주소 검색 기능 사용 시)

### Quick Start

#### 1. 프로젝트 클론 및 설치

```bash
git clone https://github.com/your-username/smeats.git
cd smeats
npm install
```

#### 2. 환경 변수 설정

```bash
# 환경 변수 파일 생성
touch .env.local
```

**.env.local 최소 설정 (Demo Mode)**
```bash
# Demo Mode (Supabase 없이 체험)
NEXT_PUBLIC_DEMO_MODE=true
```

**.env.local 전체 설정 (프로덕션)**
```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Juso API (주소 검색)
NEXT_PUBLIC_JUSO_API_KEY=your-juso-api-key

# 선택 사항
NEXT_PUBLIC_BYPASS_DELIVERY_FILTER=false  # 배송 필터 우회 (개발용)
NEXT_PUBLIC_FEATURE_DISTRICT=false        # 행정구역 필터 활성화
```

#### 3. 데이터베이스 설정 (Supabase 사용 시)

Supabase SQL Editor에서 다음 SQL 파일을 순서대로 실행:

```bash
# 1. 기본 스키마 및 테이블
db/010_schema.sql

# 2. RLS 정책
db/020_rls_policies.sql

# 3. 인덱스
db/030_indexes.sql

# 4. 스토리지 정책
db/040_storage_policies.sql

# 5. RPC 함수
db/050_rpc_functions.sql

# 6. 구매자/판매자 기능 확장
db/060_buyer_seller_enhancements.sql
```

#### 4. Edge Functions 배포 (Supabase 사용 시)

```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref your-project-id

# Edge Function 배포
supabase functions deploy place-order
```

#### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

#### 6. 프로덕션 빌드

```bash
# 빌드
npm run build

# 빌드 결과 실행
npm start
```

---

## 📂 프로젝트 구조

```
smeats/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # 인증 관련 페이지
│   │   │   ├── login/                 # 로그인
│   │   │   └── signup/                # 회원가입
│   │   ├── (portal)/                  # 고객 포털 (구매자)
│   │   │   ├── products/              # 상품 검색
│   │   │   │   ├── [id]/             # 상품 상세
│   │   │   │   └── page.tsx           # 상품 목록
│   │   │   ├── recipes/               # 레시피 계산기
│   │   │   │   ├── [id]/             # 레시피 상세
│   │   │   │   └── page.tsx           # 레시피 목록
│   │   │   ├── cart/                  # 장바구니
│   │   │   ├── orders/                # 주문 내역
│   │   │   ├── mypage/                # 구매자 마이페이지
│   │   │   ├── profile/               # 프로필 관리
│   │   │   └── dashboard/             # 구매자 대시보드
│   │   ├── seller/                    # 판매자 포털
│   │   │   ├── dashboard/             # 판매자 대시보드
│   │   │   ├── products/              # 상품 관리
│   │   │   │   ├── [id]/pricing/     # 개별 가격 설정
│   │   │   │   ├── bulk-upload/      # 대량 등록
│   │   │   │   └── page.tsx           # 상품 목록
│   │   │   ├── orders/                # 주문 관리
│   │   │   ├── pricing/               # 가격 관리
│   │   │   ├── stats/                 # 통계
│   │   │   └── mypage/                # 판매자 마이페이지
│   │   ├── admin/                     # 관리자 포털
│   │   │   ├── dashboard/             # 관리자 대시보드
│   │   │   ├── users/                 # 사용자 관리
│   │   │   ├── products/              # 상품 관리
│   │   │   ├── reports/               # 리포트
│   │   │   └── mypage/                # 관리자 마이페이지
│   │   ├── api/                       # API Routes
│   │   │   ├── profile/               # 프로필 API
│   │   │   └── seller/                # 판매자 API
│   │   ├── layout.tsx                 # Root Layout
│   │   ├── page.tsx                   # 홈페이지
│   │   ├── error.tsx                  # 에러 페이지
│   │   ├── not-found.tsx              # 404 페이지
│   │   └── globals.css                # 전역 스타일
│   ├── components/                    # React 컴포넌트
│   │   ├── ui/                        # UI 컴포넌트
│   │   │   ├── button.tsx             # 버튼
│   │   │   ├── input.tsx              # 입력 필드
│   │   │   ├── card.tsx               # 카드
│   │   │   ├── badge.tsx              # 배지
│   │   │   ├── spinner.tsx            # 로딩 스피너
│   │   │   ├── pagination.tsx         # 페이지네이션
│   │   │   └── quantity-input.tsx     # 수량 입력
│   │   ├── forms/                     # 폼 컴포넌트
│   │   ├── product-card.tsx           # 상품 카드
│   │   ├── product-card-interactive.tsx # 인터랙티브 상품 카드
│   │   ├── product-filter.tsx         # 상품 필터
│   │   ├── cart-provider.tsx          # 장바구니 Context
│   │   ├── demo-provider.tsx          # Demo Mode Context
│   │   ├── demo-banner.tsx            # Demo 배너
│   │   ├── navigation.tsx             # 네비게이션
│   │   ├── toast.tsx                  # 토스트 알림
│   │   ├── delivery-info.tsx          # 배송 정보
│   │   ├── seller-info.tsx            # 판매자 정보
│   │   └── skeletons.tsx              # 스켈레톤 로더
│   ├── server/                        # 서버 코드
│   │   └── actions/                   # Server Actions
│   │       ├── auth.ts                # 인증 액션
│   │       ├── products.ts            # 상품 액션
│   │       ├── orders.ts              # 주문 액션
│   │       └── recipes.ts             # 레시피 액션
│   └── lib/                           # 유틸리티 & 타입
│       ├── types.ts                   # TypeScript 타입 정의
│       ├── database.types.ts          # Supabase 생성 타입
│       ├── supabase.ts                # Supabase 클라이언트
│       ├── demo-mode.ts               # Demo Mode 유틸리티
│       ├── mock-data.ts               # Mock 데이터
│       ├── cn.ts                      # 클래스명 유틸리티
│       ├── juso.ts                    # Juso API 클라이언트
│       └── geo.ts                     # 지리 정보 유틸리티
├── supabase/                          # Supabase 설정
│   └── functions/                     # Edge Functions
│       └── place-order/               # 주문 처리 함수
├── db/                                # 데이터베이스 마이그레이션
│   ├���─ 010_schema.sql                 # 기본 스키마
│   ├── 020_rls_policies.sql           # RLS 정책
│   ├── 030_indexes.sql                # 인덱스
│   ├── 040_storage_policies.sql       # 스토리지 정책
│   ├── 050_rpc_functions.sql          # RPC 함수
│   └── 060_buyer_seller_enhancements.sql # 기능 확장
├── public/                            # 정적 파일
├── .env.local                         # 환경 변수 (git 제외)
├── .gitignore                         # Git 제외 파일
├── package.json                       # 의존성 관리
├── tsconfig.json                      # TypeScript 설정
├── tailwind.config.ts                 # Tailwind 설정
├── next.config.mjs                    # Next.js 설정
├── postcss.config.mjs                 # PostCSS 설정
└── README.md                          # 프로젝트 문서
```

---

## 🏗️ 아키텍처

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  App Router │  │ Server Actions│  │   Client Components  │  │
│  │  (RSC)      │  │               │  │   (Interactive UI)   │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Supabase)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Auth       │  │  PostgreSQL  │  │   Edge Functions     │  │
│  │  (JWT)      │  │  (RLS)       │  │   (Deno Runtime)     │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Storage (Product Images)                      │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      External APIs                              │
│  ┌─────────────┐                                                │
│  │  Juso API   │  (주소 검색)                                   │
│  └─────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 데이터 모델

```
users (Supabase Auth)
  ├── profiles (1:1)
  │   ├── role: customer | seller | admin
  │   ├── business_name
  │   ├── address
  │   └── region
  │
  ├── products (1:N) - seller만
  │   ├── name
  │   ├── price
  │   ├── stock
  │   ├── category
  │   └── image_url
  │
  ├── orders (1:N) - customer만
  │   ├── status: pending | preparing | shipping | completed
  │   ├── total_amount
  │   ├── delivery_address
  │   │
  │   └── order_items (1:N)
  │       ├── product_id
  │       ├── quantity
  │       └── price_at_order
  │
  └── recipes (N:N via recipe_ingredients)
      ├── name
      ├── base_servings
      │
      └── recipe_ingredients (1:N)
          ├── ingredient_name
          ├── quantity
          └── unit
```

### 주요 기술 패턴

#### 1. Server Actions (Next.js 15)
```typescript
// src/server/actions/products.ts
"use server";

export async function getProducts() {
  // 서버에서만 실행되는 로직
  const supabase = createServerClient();
  const { data } = await supabase
    .from('products')
    .select('*');
  return data;
}
```

#### 2. Row Level Security (RLS)
```sql
-- 사용자는 자신의 주문만 조회
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- 판매자는 자신의 상품만 수정
CREATE POLICY "Sellers can update their own products"
ON products FOR UPDATE
USING (auth.uid() = seller_id);
```

#### 3. Type-Safe API with Zod
```typescript
// src/lib/types.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
});

export type Product = z.infer<typeof ProductSchema>;
```

#### 4. Demo Mode Pattern
```typescript
// src/lib/demo-mode.ts
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
         !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// Server Action에서 사용
if (isDemoMode()) {
  return mockData;
}
return await supabaseQuery();
```

---

## 🎬 주요 사용자 플로우

### 1. 상품 주문 플로우

```
회원가입 → 이메일 인증 → 프로필 설정(주소) → 상품 검색 →
장바구니 담기 → 주문하기 → 주문 확인 → 배송 추적
```

**상세 단계**:
1. **회원가입**: 이메일/비밀번호, 역할(customer) 선택
2. **이메일 인증**: Supabase Auth 인증 메일 확인
3. **프로필 설정**: 상호명, 연락처, 주소 입력 (Juso API 연동)
4. **상품 검색**: 키워드 검색, 카테고리/가격 필터, 최저가 확인
5. **장바구니**: 수량 조절, 판매자별 그룹핑 확인
6. **주문**: 배송지 확인, 주문 완료
7. **추적**: 주문 내역에서 상태 확인

### 2. 레시피 발주 플로우

```
레시피 목록 → 레시피 선택 → 인분수 입력 → 재료 자동 계산 →
가격 확인 → 장바구니 담기 → 주문하기
```

**핵심 알고리즘**:
```typescript
// 레시피 계산 로직
function calculateIngredients(recipe, servings) {
  const ratio = servings / recipe.base_servings;

  return recipe.ingredients.map(ingredient => ({
    name: ingredient.name,
    quantity: ingredient.quantity * ratio,
    unit: ingredient.unit,
    matchedProduct: findMatchingProduct(ingredient),
  }));
}

// 최저가 상품 매칭
function findMatchingProduct(ingredient) {
  const products = searchProducts(ingredient.name);
  return products.sort((a, b) =>
    a.price_per_unit - b.price_per_unit
  )[0];
}
```

### 3. 판매자 상품 등록 플로우

```
판매자 회원가입 → 상품 등록 → 이미지 업로드 → 가격/재고 설정 →
배송 권역 설정 → 주문 접수 → 주문 처리
```

**상세 단계**:
1. **회원가입**: 역할을 seller로 선택
2. **상품 등록**: 상품명, 카테고리, 설명, 단위 입력
3. **이미지 업로드**: Supabase Storage에 이미지 업로드
4. **가격 설정**: 판매가격, 할인율 설정
5. **재고 관리**: 초기 재고 입력
6. **배송 설정**: 배송 가능 지역 설정 (반경 또는 행정구역)
7. **주문 관리**: 신규 주문 접수 및 상태 변경

### 4. 최저가 표시 알고리즘

```typescript
// 동일 상품군 그룹핑 및 최저가 판단
function markLowestPrice(products: Product[]) {
  // 1. 상품명과 단위로 그룹핑
  const groups = groupBy(products, p => `${p.name}:${p.unit}`);

  // 2. 각 그룹에서 최저가 상품 찾기
  Object.values(groups).forEach(group => {
    const minPrice = Math.min(...group.map(p => p.price));

    group.forEach(product => {
      product.is_lowest_price = (product.price === minPrice);
    });
  });

  return products;
}
```

---

## 🌐 배포 가이드

### Vercel 배포 (권장)

#### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel
```

#### 2. 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables에서 설정:

```bash
# 프로덕션 환경
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_JUSO_API_KEY=your-juso-api-key

# Demo Mode (선택)
NEXT_PUBLIC_DEMO_MODE=false
```

#### 3. 도메인 연결 (선택)

Vercel Dashboard → Domains에서 커스텀 도메인 설정

#### 4. 배포 확인

```bash
# 프로덕션 배포
vercel --prod

# 배포 URL 확인
# https://your-project.vercel.app
```

### Netlify 배포

#### 1. 프로젝트 연결

```bash
# Netlify CLI 설치
npm i -g netlify-cli

# 로그인
netlify login

# 프로젝트 초기화
netlify init
```

#### 2. Build 설정

netlify.toml 생성:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 3. 환경 변수 설정

Netlify Dashboard → Site settings → Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_JUSO_API_KEY=your-juso-api-key
```

#### 4. 배포

```bash
netlify deploy --prod
```

### 환경별 설정

#### Development
```bash
npm run dev
# http://localhost:3000
```

#### Production
```bash
npm run build
npm start
# or deploy to Vercel/Netlify
```

#### Edge Functions

Supabase Edge Functions는 별도 배포 필요:

```bash
# place-order 함수 배포
supabase functions deploy place-order

# 함수 로그 확인
supabase functions logs place-order
```

자세한 배포 가이드: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

---

## 📚 문서

프로젝트의 상세 문서는 다음 파일들을 참고하세요:

| 문서 | 설명 |
|------|------|
| [DEMO_GUIDE.md](./DEMO_GUIDE.md) | Demo Mode 사용 가이드 |
| [DEMO_MODE_IMPLEMENTATION.md](./DEMO_MODE_IMPLEMENTATION.md) | Demo Mode 구현 상세 |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | 배포 가이드 |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | 디자인 시스템 문서 |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | 기능 구현 가이드 |
| [UX_UI_ANALYSIS.md](./UX_UI_ANALYSIS.md) | UX/UI 분석 문서 |
| [USER_SCENARIOS.md](./USER_SCENARIOS.md) | 사용자 시나리오 |
| [USER_FLOW_ANALYSIS_RESULT.md](./USER_FLOW_ANALYSIS_RESULT.md) | 사용자 플로우 분석 |
| [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) | 디버깅 가이드 |

---

## 🧪 테스트 체크리스트

### 구매자 플로우
- [ ] 회원가입 (customer role)
- [ ] 이메일 인증
- [ ] 프로필 설정 (주소 입력)
- [ ] 상품 검색 (키워드, 카테고리, 가격 필터)
- [ ] 최저가 상품 확인
- [ ] 레시피 선택 및 인분 계산
- [ ] 장바구니 담기 (단일 상품 + 레시피)
- [ ] 장바구니 수량 조절
- [ ] 주문하기
- [ ] 주문 내역 확인
- [ ] 주문 상태 추적

### 판매자 플로우
- [ ] 회원가입 (seller role)
- [ ] 상품 등록
- [ ] 이미지 업로드
- [ ] 가격 설정
- [ ] 재고 관리
- [ ] 배송 권역 설정
- [ ] 주문 접수
- [ ] 주문 상태 변경
- [ ] 매출 통계 확인

### 관리자 플로우
- [ ] 관리자 계정 생성
- [ ] 전체 사용자 조회
- [ ] 역할 변경
- [ ] 전체 상품 조회
- [ ] 상품 승인/거부
- [ ] GMV 통계 확인

### Demo Mode
- [ ] Demo Mode 자동 활성화 확인 (Supabase 미설정)
- [ ] 페르소나 선택 (buyer/seller/admin)
- [ ] Mock 데이터 로딩
- [ ] 각 페르소나별 기능 테스트
- [ ] 페르소나 전환

---

## 🤝 기여하기

SMEats 프로젝트에 기여하고 싶으시다면 다음 절차를 따라주세요:

### 기여 절차

1. **Fork this repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Create Pull Request**

### 커밋 컨벤션

다음 커밋 컨벤션을 따라주세요:

- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `docs:` - 문서 변경
- `style:` - 코드 포맷팅 (기능 변경 없음)
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 추가/수정
- `chore:` - 빌드, 설정 변경

**예시**:
```bash
git commit -m "feat: add recipe filtering by category"
git commit -m "fix: resolve cart quantity update issue"
git commit -m "docs: update deployment guide"
```

### 코드 스타일

- **TypeScript**: strict mode 활성화
- **ESLint**: 코드 품질 검사 통과 필수
- **Formatting**: Prettier 설정 준수
- **Naming**: camelCase (변수/함수), PascalCase (컴포넌트/타입)

### 이슈 제출

버그 리포트나 기능 제안은 [GitHub Issues](https://github.com/your-username/smeats/issues)에 등록해주세요.

---

## 🗺️ 로드맵

### v1.0 (MVP) ✅ 완료

- [x] 구매자: 상품 검색 & 주문
- [x] 구매자: 레시피 기반 발주
- [x] 구매자: 장바구니 & 주문 관리
- [x] 판매자: 상품 등록 & 관리
- [x] 판매자: 주문 관리
- [x] 이메일 인증
- [x] 최저가 표시
- [x] Demo Mode 구현
- [x] 멀티 페르소나 (buyer/seller/admin)

### v1.1 (진행 중)

- [ ] 판매자 대시보드 개선
  - [ ] 실시간 주문 알림
  - [ ] 상세 매출 분석
  - [ ] 인기 상품 추천
- [ ] 주문 알림 시스템
  - [ ] 이메일 알림
  - [ ] SMS 알림 (선택)
  - [ ] 푸시 알림 (PWA)
- [ ] 배송 추적 개선
  - [ ] 배송사 API 연동
  - [ ] 실시간 배송 상태 업데이트
- [ ] 관리자 기능 강화
  - [ ] 정산 관리
  - [ ] 수수료 설정
  - [ ] 분쟁 관리

### v1.2 (예정)

- [ ] 고급 검색 기능
  - [ ] 검색 필터 저장
  - [ ] 검색 히스토리
  - [ ] 추천 검색어
- [ ] 찜하기 & 재구매
  - [ ] 찜 목록 관리
  - [ ] 재구매 원클릭
  - [ ] 정기 배송 설정
- [ ] 리뷰 & 평점
  - [ ] 상품 리뷰 작성
  - [ ] 평점 시스템
  - [ ] 리뷰 이미지 업로드
- [ ] 쿠폰 & 프로모션
  - [ ] 할인 쿠폰 발행
  - [ ] 프로모션 관리
  - [ ] 첫 구매 혜택

### v2.0 (장기 비전)

- [ ] 고급 배송 기능
  - [ ] PostGIS 반경 필터
  - [ ] 실시간 배송 지도
  - [ ] 배송비 자동 계산 개선
- [ ] AI/ML 기능
  - [ ] AI 추천 시스템
  - [ ] 수요 예측
  - [ ] 가격 최적화
  - [ ] 재고 자동 관리
- [ ] 모바일 앱
  - [ ] React Native 앱 개발
  - [ ] 푸시 알림
  - [ ] 오프라인 모드
- [ ] 글로벌 확장
  - [ ] 다국어 지원 (i18n)
  - [ ] 다중 통화
  - [ ] 해외 배송
- [ ] B2B 고급 기능
  - [ ] 대량 구매 견적
  - [ ] 계약 관리
  - [ ] 정기 구매 자동화
  - [ ] 수발주 시스템 연동

---

## ⚡ 성능 최적화

### 구현된 최적화

- **Image Optimization**: Next.js Image 컴포넌트 사용
- **Code Splitting**: Dynamic Import로 번들 크기 감소
- **Server Components**: RSC로 초기 로딩 속도 개선
- **Edge Runtime**: Vercel Edge Functions로 응답 속도 향상
- **Database Indexing**: 주요 쿼리에 인덱스 설정
- **RLS Optimization**: 효율적인 Row Level Security 정책

### 측정 지표

- **Lighthouse Score**: 90+ (목표)
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **TTI**: < 3.5s

---

## 🔒 보안

### 구현된 보안 기능

- **Authentication**: Supabase Auth (JWT)
- **Authorization**: Row Level Security (RLS)
- **Input Validation**: Zod 스키마 검증
- **SQL Injection Prevention**: Parameterized Queries
- **XSS Protection**: React 기본 보호 + CSP
- **CSRF Protection**: SameSite Cookie 설정
- **Environment Variables**: 민감 정보 환경변수 관리
- **Image Upload Security**: 파일 타입/크기 검증

### 보안 체크리스트

- [x] 모든 API 엔드포인트 인증 필요
- [x] RLS 정책으로 데이터 접근 제어
- [x] 환경변수로 시크릿 관리
- [x] HTTPS 강제 (프로덕션)
- [x] 이메일 인증 필수
- [x] 비밀번호 강도 검증
- [x] SQL Injection 방지
- [x] XSS 방지

---

## 🐛 알려진 이슈

현재 알려진 이슈는 [GitHub Issues](https://github.com/your-username/smeats/issues)에서 확인할 수 있습니다.

---

## 💡 FAQ

### Q: Demo Mode와 프로덕션의 차이는?

**A**: Demo Mode는 Supabase 없이 Mock 데이터로 모든 기능을 체험할 수 있습니다. 프로덕션은 실제 데이터베이스와 인증 시스템을 사용합니다.

### Q: 이메일 인증이 필수인가요?

**A**: 주문 기능을 사용하려면 이메일 인증이 필요합니다. 상품 검색 등 기본 기능은 인증 없이 사용 가능합니다.

### Q: 최저가는 어떻게 판단하나요?

**A**: 동일한 상품명과 단위를 가진 상품들을 그룹핑하여 가장 낮은 가격을 최저가로 표시합니다.

### Q: 배송 권역은 어떻게 설정하나요?

**A**: 판매자는 배송 가능 지역을 행정구역(시/구) 또는 반경(km)으로 설정할 수 있습니다.

### Q: 레시피 재료는 자동으로 매칭되나요?

**A**: 네, 레시피 재료명과 상품명을 매칭하여 자동으로 가장 저렴한 상품을 선택합니다.

### Q: 주문 취소는 언제까지 가능한가요?

**A**: 주문 상태가 "접수" 단계일 때만 취소 가능합니다. "준비중" 이후에는 판매자에게 문의해야 합니다.

### Q: 상품 이미지는 어디에 저장되나요?

**A**: Supabase Storage에 저장되며, CDN을 통해 빠르게 전송됩니다.

---

## 📝 라이선스

MIT License

```
MIT License

Copyright (c) 2024 SMEats Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 문의 및 지원

### 버그 리포트 & 기능 제안
- **GitHub Issues**: [이슈 등록](https://github.com/your-username/smeats/issues)

### 커뮤니티
- **Discussions**: [토론 참여](https://github.com/your-username/smeats/discussions)

### 비즈니스 문의
- **Email**: support@smeats.com

### 소셜 미디어
- **Twitter**: [@smeats_official](https://twitter.com/smeats_official)
- **LinkedIn**: [SMEats](https://linkedin.com/company/smeats)

---

## 👥 팀

SMEats는 소상공인 급식업의 디지털 전환을 위해 노력하는 팀입니다.

### 핵심 기여자
- **Project Lead**: [Your Name]
- **Frontend**: [Developer Name]
- **Backend**: [Developer Name]
- **Design**: [Designer Name]

---

## 🙏 감사의 말

SMEats 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Zod](https://zod.dev/) - 타입 검증
- [TypeScript](https://www.typescriptlang.org/) - 타입 안정성

---

## 📊 프로젝트 통계

![GitHub stars](https://img.shields.io/github/stars/your-username/smeats?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/smeats?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/smeats)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/smeats)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/smeats)
![License](https://img.shields.io/github/license/your-username/smeats)

---

<p align="center">
  <b>Made with ❤️ by SMEats Team</b><br>
  소상공인의 성공을 위한 디지털 파트너
</p>

<p align="center">
  <a href="#-목차">⬆ 맨 위로</a>
</p>
