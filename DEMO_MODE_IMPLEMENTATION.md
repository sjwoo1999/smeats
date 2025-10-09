# SMEats 데모 모드 구현 프롬프트

## 🎯 구현 목표

사용자가 로그인/회원가입 없이 자동으로 데모 계정으로 로그인되어, 페르소나별로 맞춤화된 데모 환경을 체험할 수 있도록 구현합니다.

---

## 📋 요구사항 상세

### 1. 자동 데모 계정 로그인

**목표**: 사용자가 사이트 접속 시 자동으로 데모 계정으로 로그인 처리

**구현 내용**:
- 환경 변수 감지: `NEXT_PUBLIC_DEMO_MODE=true` 또는 Supabase 미설정 시 자동 활성화
- 자동 로그인 플로우:
  1. 루트 레이아웃 또는 미들웨어에서 인증 상태 확인
  2. 미인증 상태이고 데모 모드인 경우, 자동으로 데모 계정 세션 생성
  3. `/login`, `/signup` 페이지 접근 시 자동으로 `/dashboard`로 리다이렉트
- 데모 세션 관리:
  - 로컬스토리지 또는 쿠키에 `demo_user_persona` 저장
  - 페이지 새로고침 시에도 페르소나 유지

### 2. 페르소나 기반 데모 환경

**목표**: 사용자가 선택한 페르소나에 따라 다른 데이터와 UI를 경험

**페르소나 정의**:

#### A. 구매자 페르소나 (Buyer - 학교 영양사)
- **역할**: 급식 식자재를 구매하는 학교 영양사
- **주요 화면**:
  - 상품 검색/비교 (여러 판매자의 최저가 비교)
  - 레시피 기반 발주
  - 장바구니 및 주문 내역
  - 대시보드: 주문 현황, 배송 예정일
- **목 데이터**:
  - `mockUser`: 구매자 계정 (예: `{ role: "buyer", organization: "○○초등학교", name: "김영양 영양사" }`)
  - 주문 내역 2-3개 (pending, preparing, delivered 상태)
  - 장바구니에 상품 1-2개 미리 담겨있음
  - 레시피 2-3개 (김치찌개, 카레라이스, 된장찌개)

#### B. 판매자 페르소나 (Seller - 식자재 업체)
- **역할**: 식자재를 공급하는 마트/도매업체
- **주요 화면**:
  - 판매 대시보드: 주문 현황, 매출 통계
  - 상품 관리 (등록, 수정, 재고 관리)
  - 주문 관리 (접수, 준비, 배송 처리)
  - 정산 내역
- **목 데이터**:
  - `mockUser`: 판매자 계정 (예: `{ role: "seller", business_name: "신선마트", name: "이판매 대표" }`)
  - 내 상품 목록 5-6개
  - 들어온 주문 3-4개 (pending, preparing 상태)
  - 월별 매출 통계 데이터

#### C. 관리자 페르소나 (Admin - 플랫폼 운영자)
- **역할**: SMEats 플랫폼 전체를 관리하는 운영자
- **주요 화면**:
  - 전체 대시보드: 전체 주문, 매출, 사용자 통계
  - 사용자 관리 (구매자, 판매자 승인/관리)
  - 상품 심사 및 관리
  - 분쟁 해결
- **목 데이터**:
  - `mockUser`: 관리자 계정 (예: `{ role: "admin", name: "관리자" }`)
  - 전체 통계 데이터 (총 사용자 수, 총 거래액, 활성 판매자 수)
  - 심사 대기 상품 목록
  - 최근 주문 내역 전체

### 3. 페르소나 선택 UI

**랜딩 페이지 개선**:

현재 랜딩 페이지 (`src/app/page.tsx`)를 개선하여 페르소나 선택 화면으로 변경:

```
┌─────────────────────────────────────────────┐
│                                             │
│          🍽️ SMEats 데모 체험하기            │
│                                             │
│    급식 식자재 B2B 마켓플레이스를 체험해보세요   │
│                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  │   👩‍🍳        │ │   🏪        │ │   ⚙️        │
│  │  구매자로    │ │  판매자로    │ │  관리자로    │
│  │  체험하기    │ │  체험하기    │ │  체험하기    │
│  │             │ │             │ │             │
│  │  학교 영양사 │ │  식자재 업체 │ │ 플랫폼 운영자│
│  │             │ │             │ │             │
│  └─────────────┘ └─────────────┘ └─────────────┘
│                                             │
│  ⚠️ 이것은 데모 환경입니다. 실제 주문이 이루어지지 않습니다.
│                                             │
└─────────────────────────────────────────────┘
```

**구현 내용**:
- 3개의 페르소나 선택 카드
- 각 카드 클릭 시:
  1. 해당 페르소나로 데모 유저 설정
  2. 로컬스토리지에 `demo_user_persona` 저장
  3. 해당 페르소나의 대시보드로 이동
- 우측 상단에 "다른 페르소나로 체험하기" 버튼 (언제든 변경 가능)

### 4. 데모 모드 UI/UX 표시

**전역 데모 배너**:
```tsx
// 모든 인증된 페이지 상단에 표시
<div className="bg-warning-bg border-b border-warning/20 px-4 py-3">
  <div className="container mx-auto flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-lg">🎯</span>
      <div>
        <p className="text-sm font-medium text-warning">
          데모 모드로 체험 중입니다 ({personaName})
        </p>
        <p className="text-xs text-warning/80">
          실제 주문이 이루어지지 않으며, 모든 데이터는 샘플입니다.
        </p>
      </div>
    </div>
    <Button variant="outline" size="sm" onClick={changPersona}>
      다른 페르소나 체험하기
    </Button>
  </div>
</div>
```

**주요 액션에 데모 힌트 추가**:
- 장바구니 담기: "장바구니 담기 (데모)"
- 주문하기: "주문하기 (데모 - 실제 주문 안됨)"
- Toast 메시지: "🎯 [데모] 장바구니에 추가되었습니다"

### 5. 페르소나별 목 데이터 확장

**기존 `src/lib/mock-data.ts` 확장**:

```typescript
// 페르소나별 사용자 데이터
export const mockUsers = {
  buyer: {
    id: "buyer-demo-1",
    email: "demo-buyer@smeats.com",
    name: "김영양",
    role: "buyer" as const,
    organization: "서울 ○○초등학교",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    created_at: new Date().toISOString(),
  },
  seller: {
    id: "seller-demo-1",
    email: "demo-seller@smeats.com",
    name: "이판매",
    role: "seller" as const,
    business_name: "신선마트",
    business_registration: "123-45-67890",
    phone: "010-9876-5432",
    address: "서울시 송파구 송파대로 456",
    created_at: new Date().toISOString(),
  },
  admin: {
    id: "admin-demo-1",
    email: "demo-admin@smeats.com",
    name: "관리자",
    role: "admin" as const,
    created_at: new Date().toISOString(),
  },
};

// 판매자용 주문 데이터 (받은 주문)
export const mockSellerOrders = [
  {
    id: "seller-order-1",
    buyer_id: "buyer-demo-1",
    buyer_name: "김영양",
    buyer_organization: "서울 ○○초등학교",
    status: "pending" as const,
    total_amount: 150000,
    delivery_date: "2025-01-15",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      // ... 상품 목록
    ],
  },
  // ... 더 많은 주문
];

// 관리자용 통계 데이터
export const mockAdminStats = {
  totalUsers: 145,
  totalBuyers: 89,
  totalSellers: 52,
  totalAdmins: 4,
  totalOrders: 1234,
  totalRevenue: 45600000,
  monthlyRevenue: 8900000,
  pendingProducts: 12, // 심사 대기 상품
  activeProducts: 234,
  pendingOrders: 23,
};
```

### 6. 페르소나별 라우팅 및 권한 처리

**미들웨어 수정** (`src/middleware.ts`):
```typescript
// 페르소나별 접근 권한 체크
// - buyer: /products, /recipes, /cart, /orders, /dashboard
// - seller: /seller/dashboard, /seller/products, /seller/orders, /seller/stats
// - admin: /admin/dashboard, /admin/users, /admin/products, /admin/orders
```

**새로운 페이지 생성**:
- `/seller/*`: 판매자 전용 페이지
- `/admin/*`: 관리자 전용 페이지

### 7. 네비게이션 개선

**현재 네비게이션** (`src/components/navigation.tsx`) 개선:
- 페르소나에 따라 다른 메뉴 표시
- 우측 상단에 "데모: {페르소나명}" 표시
- 프로필 드롭다운에 "다른 페르소나 체험" 메뉴 추가

---

## 🔧 구현 순서

### Phase 1: 기반 작업
1. ✅ 페르소나별 목 데이터 확장 (`mock-data.ts`)
2. ✅ 데모 모드 감지 로직 (`src/lib/demo-mode.ts` 생성)
3. ✅ 페르소나 관리 Context 생성 (`src/components/demo-provider.tsx`)

### Phase 2: 랜딩 페이지 개선
4. ✅ 랜딩 페이지를 페르소나 선택 화면으로 변경
5. ✅ 페르소나 선택 시 로컬스토리지 저장 및 리다이렉트

### Phase 3: 자동 로그인 및 세션 관리
6. ✅ 미들웨어에서 데모 모드 감지 및 자동 세션 생성
7. ✅ 로그인/회원가입 페이지 접근 시 리다이렉트
8. ✅ 페르소나별 사용자 정보 제공

### Phase 4: UI/UX 개선
9. ✅ 전역 데모 배너 컴포넌트 생성
10. ✅ 네비게이션에 페르소나 표시 및 변경 기능
11. ✅ 주요 액션에 데모 힌트 추가

### Phase 5: 페르소나별 페이지 구현
12. ✅ 판매자 대시보드 및 페이지 생성
13. ✅ 관리자 대시보드 및 페이지 생성
14. ✅ 페르소나별 라우팅 권한 처리

### Phase 6: 테스트 및 최적화
15. ✅ 각 페르소나로 전체 플로우 테스트
16. ✅ 데모 힌트 및 안내 문구 최적화
17. ✅ 페르소나 전환 시 데이터 정합성 확인

---

## 📝 구현 시 고려사항

### 보안
- 데모 모드는 개발/스테이징 환경에서만 활성화
- 프로덕션에서는 `NEXT_PUBLIC_DEMO_MODE=false` 또는 환경 변수 미설정 시 비활성화
- 데모 계정은 읽기 전용으로 실제 데이터베이스에 영향 없음

### 사용자 경험
- 페르소나 전환 시 매끄러운 전환 (로딩 없이)
- 각 페르소나의 특성이 명확히 드러나는 데이터와 UI
- 데모임을 명확히 알리면서도 실제 사용감 제공

### 성능
- 페르소나별 목 데이터는 필요할 때만 로드
- 로컬스토리지 사용으로 서버 부하 최소화

### 확장성
- 추후 실제 인증 시스템 도입 시 쉽게 교체 가능하도록 추상화
- 데모 모드와 실제 모드의 분기 처리를 명확히

---

## 🎨 디자인 가이드

### 데모 배너 색상
- 배경: `bg-amber-50` (밝은 노란색 계열)
- 테두리: `border-amber-200`
- 텍스트: `text-amber-900`
- 강조: `text-amber-600 font-semibold`

### 페르소나 카드 디자인
- 카드 크기: 최소 200px × 250px
- 아이콘: 64px × 64px (이모지 또는 SVG)
- 호버 효과: `hover:shadow-lg hover:scale-105 transition-all`
- 선택 효과: `ring-2 ring-primary`

### 데모 힌트 표시
- 버튼: 기존 텍스트 + "(데모)" 접미사, 작은 글씨로 표시
- Toast: 아이콘에 🎯 추가
- 배지: `<Badge variant="warning">DEMO</Badge>`

---

## ✅ 완료 체크리스트

구현 완료 후 다음 항목들을 확인해주세요:

- [ ] 랜딩 페이지에서 3개 페르소나 선택 가능
- [ ] 각 페르소나 선택 시 자동 로그인 및 대시보드 이동
- [ ] 페르소나별로 다른 데이터 표시 (구매자: 구매 내역, 판매자: 판매 내역, 관리자: 전체 통계)
- [ ] 전역 데모 배너가 모든 인증 페이지에 표시
- [ ] 네비게이션에 현재 페르소나 표시
- [ ] "다른 페르소나 체험하기" 버튼으로 언제든 전환 가능
- [ ] 주요 액션(장바구니, 주문)에 데모 힌트 표시
- [ ] Toast 메시지에 [데모] 표시
- [ ] 판매자 전용 페이지 접근 가능 (상품 관리, 주문 관리)
- [ ] 관리자 전용 페이지 접근 가능 (전체 대시보드, 사용자 관리)
- [ ] 페르소나 전환 시 데이터 정합성 유지
- [ ] 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
- [ ] 페이지 새로고침 시에도 페르소나 유지
- [ ] 모바일 환경에서도 정상 작동

---

## 🚀 실행 프롬프트

**AI에게 전달할 프롬프트**:

```
SMEats 프로젝트에 데모 모드를 구현해주세요.

목표:
- 사용자가 로그인/회원가입 없이 자동으로 데모 계정으로 로그인
- 랜딩 페이지에서 3가지 페르소나 선택 가능 (구매자, 판매자, 관리자)
- 각 페르소나별로 맞춤화된 데모 환경 제공

구현 단계:
1. src/lib/mock-data.ts를 확장하여 페르소나별 사용자 및 데이터 추가
2. src/lib/demo-mode.ts 생성 (데모 모드 감지 유틸)
3. src/components/demo-provider.tsx 생성 (페르소나 Context)
4. src/app/page.tsx를 페르소나 선택 화면으로 변경
5. 전역 데모 배너 컴포넌트 추가
6. 네비게이션에 페르소나 표시 및 전환 기능 추가
7. 주요 액션에 "(데모)" 힌트 추가
8. 판매자/관리자 페이지 생성 (기본 구조)

디자인:
- 데모 배너: amber 계열 색상, 경고 스타일
- 페르소나 카드: 3열 그리드, 아이콘 + 설명
- 호버 효과: scale + shadow

상세 요구사항은 DEMO_MODE_IMPLEMENTATION.md 파일을 참고해주세요.
```

---

## 📚 참고 자료

- 현재 프로젝트 구조: Next.js 15.5, React 19, TypeScript
- 현재 인증: Supabase (목 데이터로 우회 가능)
- 디자인 시스템: Tailwind CSS + 커스텀 토큰
- 상태 관리: React Context (CartProvider, ToastProvider)

---

이 프롬프트를 사용하여 단계적으로 데모 모드를 구현하세요!
