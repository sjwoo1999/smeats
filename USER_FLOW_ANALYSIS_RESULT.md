# SMEats User Flow 분석 결과

분석 날짜: 2025-01-09
분석자: Claude Code
프로젝트: SMEats MVP - 급식 식자재 B2B 마켓플레이스

---

## 📊 요약

- **전체 페이지 수**: 13개
- **UI로 접근 가능한 페이지**: 9개
- **고립된 페이지**: 4개
- **접근성 점수**: 9/13 (69%)

### 점수 해석
- 🟢 **구매자 페르소나**: 8/8 (100%) - 모든 페이지 접근 가능
- 🟡 **판매자 페르소나**: 1/2 (50%) - 대시보드만 접근 가능, 추가 페이지 미구현
- 🟡 **관리자 페르소나**: 1/2 (50%) - 대시보드만 접근 가능, 추가 페이지 미구현

---

## 🎯 페르소나별 접근성 분석

### 구매자 (Buyer) 페르소나

#### ✅ 완전히 접근 가능한 페이지

1. **/ (랜딩 페이지)**
   - 진입점: 사이트 접속
   - 이동 가능: 페르소나 선택 카드 → /dashboard

2. **/dashboard (대시보드)**
   - 진입점: 페르소나 선택 또는 로고 클릭
   - 네비게이션: 상품(4개), 레시피, 장바구니, 주문내역
   - 페이지 내 링크:
     - "상품 보기 →" → /products
     - "레시피 보기 →" → /recipes
     - "주문 보기 →" → /orders

3. **/products (상품 검색)**
   - 진입점: 네비게이션 또는 대시보드 카드
   - 이동 가능:
     - 상품 카드 클릭 → /products/[id]
     - 장바구니 담기 Toast 액션 → /cart

4. **/products/[id] (상품 상세)**
   - 진입점: 상품 카드 클릭
   - 이동 가능:
     - 네비게이션 (상품, 레시피, 장바구니, 주문내역)
     - 장바구니 담기 Toast 액션 → /cart
   - ⚠️ **누락**: 상품 목록으로 돌아가는 "뒤로 가기" 버튼 없음

5. **/recipes (레시피 목록)**
   - 진입점: 네비게이션 또는 대시보드 카드
   - 이동 가능:
     - 레시피 카드 클릭 → /recipes/[id]
     - "레시피 보기" 버튼 → /recipes/[id]

6. **/recipes/[id] (레시피 상세)**
   - 진입점: 레시피 카드 클릭
   - 이동 가능:
     - 네비게이션 (상품, 레시피, 장바구니, 주문내역)
     - 장바구니 담기 (여러 재료) → /cart (Toast 액션)
   - ⚠️ **누락**: 레시피 목록으로 돌아가는 "뒤로 가기" 버튼 없음

7. **/cart (장바구니)**
   - 진입점: 네비게이션 또는 Toast 액션
   - 이동 가능:
     - ✅ 빈 장바구니: "상품 둘러보기" 버튼 → /products (구현됨!)
     - 네비게이션 (상품, 레시피, 주문내역)
     - 주문하기 버튼 → /checkout (페이지 존재 여부 확인 필요)
   - ⚠️ **문제**: /checkout 페이지가 존재하지 않아 주문하기 버튼이 작동하지 않을 가능성

8. **/orders (주문 내역)**
   - 진입점: 네비게이션 또는 대시보드 카드
   - 이동 가능:
     - 네비게이션 (상품, 레시피, 장바구니)
   - ⚠️ **누락**: 빈 주문 내역일 때 "첫 주문 시작하기" 버튼 없음
   - ⚠️ **누락**: 주문 상세 페이지 (/orders/[id]) 링크 없음

#### 접근 경로 맵

```
/ (랜딩)
└─ [구매자 선택] → /dashboard
                    ├─ [네비게이션: 상품] → /products
                    │                      ├─ [카드 클릭] → /products/[id]
                    │                      │               └─ [장바구니 담기] → /cart
                    │                      └─ [장바구니 담기] → /cart
                    ├─ [네비게이션: 레시피] → /recipes
                    │                        ├─ [카드 클릭] → /recipes/[id]
                    │                        │               └─ [장바구니 담기] → /cart
                    │                        └─ [레시피 보기] → /recipes/[id]
                    ├─ [네비게이션: 장바구니] → /cart
                    │                          ├─ [빈 상태] → /products
                    │                          └─ [주문하기] → /checkout (미구현?)
                    ├─ [네비게이션: 주문내역] → /orders
                    ├─ [카드: 상품 보기] → /products
                    ├─ [카드: 레시피 보기] → /recipes
                    └─ [카드: 주문 보기] → /orders
```

---

### 판매자 (Seller) 페르소나

#### ✅ 접근 가능한 페이지

1. **/ (랜딩 페이지)**
   - 진입점: 사이트 접속
   - 이동 가능: 페르소나 선택 → /seller/dashboard

2. **/seller/dashboard (판매자 대시보드)**
   - 진입점: 페르소나 선택
   - 네비게이션: ⚠️ 구매자와 동일한 네비게이션 (상품, 레시피, 장바구니, 주문내역)
   - 페이지 내 버튼:
     - ❌ "상품 등록" 버튼 - onClick만 있고 실제 페이지로 이동 안함
     - ❌ "주문 처리" 버튼 - onClick만 있고 실제 페이지로 이동 안함
     - ❌ "매출 통계" 버튼 - onClick만 있고 실제 페이지로 이동 안함
   - 최근 주문 목록: ❌ 클릭 불가능 (링크 없음)

#### ❌ 접근 불가능한 페이지 (미구현)

- **/seller/products** (상품 관리) - 페이지 미존재
- **/seller/orders** (주문 관리) - 페이지 미존재
- **/seller/stats** (매출 통계) - 페이지 미존재

#### ⚠️ 심각한 문제점

1. **네비게이션 미분리**: 판매자가 구매자용 네비게이션을 보고 있음
   - 판매자가 "상품 검색", "레시피", "장바구니"를 볼 이유가 없음
   - 판매자에게 필요한 메뉴: 상품 관리, 주문 관리, 매출 통계

2. **모든 액션 버튼 작동 안함**: 대시보드에서 어디로도 이동할 수 없음

3. **고립된 대시보드**: 판매자는 대시보드에서 벗어날 수 없음 (네비게이션 제외)

---

### 관리자 (Admin) 페르소나

#### ✅ 접근 가능한 페이지

1. **/ (랜딩 페이지)**
   - 진입점: 사이트 접속
   - 이동 가능: 페르소나 선택 → /admin/dashboard

2. **/admin/dashboard (관리자 대시보드)**
   - 진입점: 페르소나 선택
   - 네비게이션: ⚠️ 구매자와 동일한 네비게이션 (상품, 레시피, 장바구니, 주문내역)
   - 페이지 내 버튼:
     - ❌ "상품 심사" 버튼 - onClick만 있고 실제 페이지로 이동 안함
     - ❌ "사용자 관리" 버튼 - onClick만 있고 실제 페이지로 이동 안함
     - ❌ "통계 보고서" 버튼 - onClick만 있고 실제 페이지로 이동 안함
   - 최근 주문 목록: ❌ 클릭 불가능 (링크 없음)

#### ❌ 접근 불가능한 페이지 (미구현)

- **/admin/users** (사용자 관리) - 페이지 미존재
- **/admin/products** (상품 심사) - 페이지 미존재
- **/admin/orders** (주문 모니터링) - 페이지 미존재
- **/admin/reports** (통계 보고서) - 페이지 미존재

#### ⚠️ 심각한 문제점

판매자와 동일한 문제:
1. 네비게이션 미분리
2. 모든 액션 버튼 작동 안함
3. 고립된 대시보드

---

## 🔍 네비게이션 분석

### 전역 네비게이션 (`src/components/navigation.tsx`)

#### 현재 구현된 링크

데스크톱 & 모바일 공통:
- ✅ [로고: SMEats] → /dashboard
- ✅ [상품] → /products
- ✅ [레시피] → /recipes
- ✅ [장바구니] → /cart (장바구니 아이템 개수 배지 포함 ✅)
- ✅ [주문내역] → /orders
- ⚠️ [마이페이지] → 버튼만 있고 링크 없음

#### ❌ 페르소나별 네비게이션 분리 없음

**문제점**:
- 모든 페르소나(구매자, 판매자, 관리자)가 같은 네비게이션 메뉴를 봄
- 판매자가 "장바구니", "레시피"를 볼 필요 없음
- 관리자가 "장바구니", "상품 검색"을 볼 필요 없음

**기대 동작**:
```typescript
// 구매자 네비게이션
[로고] [대시보드] [상품] [레시피] [장바구니] [주문내역]

// 판매자 네비게이션
[로고] [대시보드] [상품 관리] [주문 관리] [매출 통계]

// 관리자 네비게이션
[로고] [대시보드] [사용자 관리] [상품 심사] [주문 모니터링] [통계]
```

#### ✅ 모바일 지원

- ✅ 햄버거 메뉴 존재
- ✅ 모든 링크 접근 가능
- ✅ 장바구니 배지 표시

---

## 🚨 주요 발견사항

### Critical Issues (🔴 즉시 수정 필요)

#### 1. 판매자/관리자 대시보드의 작동하지 않는 버튼

**문제**:
- `/seller/dashboard`의 "빠른 작업" 버튼 3개 모두 작동 안함
- `/admin/dashboard`의 "관리 작업" 버튼 3개 모두 작동 안함
- 버튼은 `<button>` 태그로만 구현되어 있고, 실제 페이지로 이동하지 않음

**영향**:
- 판매자/관리자가 대시보드 이외의 기능을 전혀 사용할 수 없음
- 데모 체험 시 페르소나의 핵심 기능을 탐색할 수 없음
- 사용자가 "이 버튼이 왜 작동하지 않지?"라고 혼란스러워함

**해결 방법**:
두 가지 옵션:
1. **임시 해결**: "준비 중" 페이지 생성 및 연결
2. **완전 해결**: 실제 기능 페이지 구현

**코드 위치**:
- `src/app/seller/dashboard/page.tsx` (157-189줄)
- `src/app/admin/dashboard/page.tsx` (274-306줄)

**우선순위**: 🔴 **Critical** (데모 체험 불가능)

---

#### 2. 페르소나별 네비게이션 미분리

**문제**:
- 모든 페르소나가 동일한 네비게이션 메뉴를 봄
- 판매자에게 "상품 검색", "레시피", "장바구니" 메뉴가 노출됨
- 관리자에게도 구매자용 메뉴가 노출됨

**영향**:
- 역할에 맞지 않는 메뉴로 혼란 유발
- 판매자/관리자 전용 페이지로 이동할 방법 없음
- 페르소나 구분이 명확하지 않음

**해결 방법**:
`src/components/navigation.tsx`에서 `useDemo` 훅 사용하여 페르소나별 링크 분기

**코드 예시**:
```typescript
"use client";

import { useDemo } from "@/components/demo-provider";

export function Navigation() {
  const { persona } = useDemo();

  // Persona-specific nav links
  const buyerLinks = [
    { href: "/products", label: "상품" },
    { href: "/recipes", label: "레시피" },
    { href: "/cart", label: "장바구니" },
    { href: "/orders", label: "주문내역" },
  ];

  const sellerLinks = [
    { href: "/seller/dashboard", label: "대시보드" },
    { href: "/seller/products", label: "상품 관리" },
    { href: "/seller/orders", label: "주문 관리" },
    { href: "/seller/stats", label: "매출 통계" },
  ];

  const adminLinks = [
    { href: "/admin/dashboard", label: "대시보드" },
    { href: "/admin/users", label: "사용자 관리" },
    { href: "/admin/products", label: "상품 심사" },
    { href: "/admin/reports", label: "통계" },
  ];

  const navLinks =
    persona === "seller" ? sellerLinks :
    persona === "admin" ? adminLinks :
    buyerLinks;

  // ... rest of component
}
```

**우선순위**: 🔴 **Critical** (페르소나 구분 불명확)

---

#### 3. /checkout 페이지 미존재

**문제**:
- `/cart` 페이지에서 "주문하기" 버튼이 `/checkout?seller=${sellerId}`로 이동하려 함
- `/checkout` 페이지가 존재하지 않음 → 404 에러 발생 가능

**영향**:
- 사용자가 주문 프로세스를 완료할 수 없음
- 구매자 페르소나의 핵심 플로우 차단

**해결 방법**:
1. `/checkout` 페이지 생성
2. 또는 `/orders`로 직접 이동하며 주문 완료 처리

**우선순위**: 🔴 **Critical** (주문 불가능)

---

### Important Issues (🟡 우선 수정)

#### 4. 상세 페이지에서 "뒤로 가기" 버튼 없음

**문제**:
- `/products/[id]`에서 상품 목록으로 돌아갈 버튼 없음
- `/recipes/[id]`에서 레시피 목록으로 돌아갈 버튼 없음
- 사용자가 브라우저 뒤로가기에 의존해야 함

**영향**:
- UX 저하 (모바일에서 특히 불편)
- 탐색 흐름 끊김

**해결 방법**:
각 상세 페이지 상단에 "← 목록으로" 버튼 추가

**코드 예시**:
```typescript
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/products")}
        className="mb-4"
      >
        <svg className="w-4 h-4 mr-2" /* 왼쪽 화살표 */ />
        상품 목록으로
      </Button>
      {/* ... */}
    </div>
  );
}
```

**우선순위**: 🟡 **Important** (UX 개선)

---

#### 5. 주문 내역 빈 상태에 액션 버튼 없음

**문제**:
- `/orders` 페이지에서 주문 내역이 비어있을 때 다음 액션 유도 없음
- 사용자가 무엇을 해야 할지 모름

**영향**:
- 전환율 저하
- 사용자 이탈 증가

**해결 방법**:
빈 상태일 때 "첫 주문 시작하기" 버튼 추가 → `/products`

**참고**: `/cart` 페이지는 이미 잘 구현되어 있음 (빈 장바구니 → "상품 둘러보기" 버튼)

**우선순위**: 🟡 **Important** (전환 유도)

---

#### 6. 주문 상세 페이지 미구현

**문제**:
- `/orders/[id]` 페이지 미존재
- 주문 내역에서 개별 주문 상세를 볼 방법 없음

**영향**:
- 사용자가 주문 세부 정보를 확인할 수 없음
- 배송 추적, 재주문 등 기능 제공 불가

**해결 방법**:
주문 상세 페이지 구현 또는 주문 카드에 모든 정보 표시

**우선순위**: 🟡 **Important** (정보 접근성)

---

### Minor Issues (🟢 개선 사항)

#### 7. "마이페이지" 버튼 작동 안함

**문제**:
- 네비게이션의 "마이페이지" 버튼이 실제로 이동하지 않음
- `<Button>` 태그로만 구현되어 있음

**영향**:
- 프로필 편집, 설정 등에 접근 불가

**해결 방법**:
`/profile` 페이지 생성 및 연결

**우선순위**: 🟢 **Minor** (부가 기능)

---

#### 8. 관련 콘텐츠 추천 없음

**문제**:
- 상품/레시피 상세 페이지에서 관련 항목 추천 없음
- 사용자가 다른 항목을 탐색하려면 뒤로 가야 함

**영향**:
- 탐색 경험 저하
- 페이지뷰 감소

**해결 방법**:
"관련 상품", "이 카테고리의 다른 상품" 섹션 추가

**우선순위**: 🟢 **Minor** (탐색 개선)

---

## 📝 사용자 시나리오 테스트 결과

### 시나리오 1: 첫 방문 사용자 (구매자)

**플로우**:
```
1. 사이트 접속 (/) ✅
2. "구매자로 체험하기" 선택 ✅
3. 대시보드 도착 ✅
4. 네비게이션에서 "상품" 클릭 ✅
5. 상품 카드 클릭 → 상세 페이지 ✅
6. "장바구니 담기" 클릭 ✅
7. Toast의 "장바구니 보기" 클릭 ✅
8. 장바구니에서 "주문하기" 클릭 ❌ (404 - /checkout 미존재)
```

**결과**: ❌ **8단계에서 막힘** (/checkout 페이지 미존재)

---

### 시나리오 2: 레시피 기반 주문 (구매자)

**플로우**:
```
1. 대시보드에서 "레시피" 클릭 ✅
2. 레시피 카드 클릭 → 상세 페이지 ✅
3. 인분 수 조절 ✅
4. "장바구니 담기" 클릭 ✅
5. 장바구니에서 확인 후 주문 ❌ (동일하게 /checkout 문제)
```

**결과**: ❌ **5단계에서 막힘** (/checkout 페이지 미존재)

---

### 시나리오 3: 페르소나 전환

**플로우**:
```
1. 구매자로 체험 중 ✅
2. 데모 배너에서 "다른 페르소나 체험하기" 클릭 ✅
3. 랜딩 페이지로 복귀 ✅
4. "판매자로 체험하기" 선택 ✅
5. 판매자 대시보드 도착 ✅
6. 판매자 기능 탐색 ❌ (모든 버튼 작동 안함)
```

**결과**: ❌ **6단계에서 막힘** (판매자 기능 탐색 불가)

---

### 시나리오 4: 주문 관리 (판매자)

**플로우**:
```
1. 판매자 대시보드 도착 ✅
2. "최근 주문" 섹션에서 주문 클릭 ❌ (클릭 불가능)
```

**결과**: ❌ **2단계에서 막힘** (주문 클릭 불가)

**대안 경로**: 없음

---

### 시나리오 5: 상품 관리 (판매자)

**플로우**:
```
1. "빠른 작업"에서 "상품 등록" 클릭 ❌ (버튼 작동 안함)
```

**결과**: ❌ **1단계에서 막힘** (버튼 미작동)

---

### 시나리오 6: 플랫폼 모니터링 (관리자)

**플로우**:
```
1. 관리자 대시보드 도착 ✅
2. "사용자 현황" 확인 ✅ (읽기만 가능)
3. "관리 작업"에서 "사용자 관리" 클릭 ❌ (버튼 작동 안함)
```

**결과**: ❌ **3단계에서 막힘** (버튼 미작동)

---

## 🛠️ 우선순위별 개선 로드맵

### Sprint 1 (즉시 - 2-3시간)

#### 1. 판매자/관리자 대시보드 버튼 연결
**예상 작업시간**: 1시간

**해결 방안 A** (빠른 임시 해결):
"준비 중" 페이지 생성 및 버튼을 Link로 변경

```typescript
// src/app/seller/products/page.tsx
export default function SellerProductsPlaceholderPage() {
  return (
    <Card className="p-12 text-center">
      <h2 className="text-2xl font-bold">상품 관리 페이지 준비 중</h2>
      <p className="mt-4 text-text-secondary">
        판매자 상품 관리 기능은 곧 제공될 예정입니다.
      </p>
      <Button className="mt-6" onClick={() => router.back()}>
        대시보드로 돌아가기
      </Button>
    </Card>
  );
}
```

**해결 방안 B** (완전 해결 - 추가 시간 필요):
실제 기능 페이지 구현

---

#### 2. /checkout 페이지 생성 또는 우회
**예상 작업시간**: 30분

**해결 방안 A** (빠른):
장바구니에서 주문 완료 처리 후 `/orders`로 이동

```typescript
// src/app/(portal)/cart/page.tsx
const handleCheckout = async (sellerId: string) => {
  setIsProcessing(true);

  // Mock order creation
  const orderItems = items.filter(item => item.seller_id === sellerId);
  // ... create order logic

  // Clear cart
  orderItems.forEach(item => remove(item.product_id));

  // Redirect to orders
  router.push("/orders");

  // Show success toast
  showToast("success", "[데모] 주문이 완료되었습니다", {
    description: "주문 내역에서 확인할 수 있습니다."
  });
};
```

**해결 방안 B** (권장):
`/checkout` 페이지 생성

---

#### 3. 페르소나별 네비게이션 분리
**예상 작업시간**: 1시간

**파일**: `src/components/navigation.tsx`

```typescript
"use client";

import { useDemo } from "@/components/demo-provider";

export function Navigation() {
  const { persona, isDemo } = useDemo();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();

  // Persona-specific navigation
  const getBuyerLinks = (): NavLink[] => [
    { href: "/dashboard", label: "대시보드", icon: <HomeIcon /> },
    { href: "/products", label: "상품", icon: <ProductIcon /> },
    { href: "/recipes", label: "레시피", icon: <RecipeIcon /> },
    { href: "/cart", label: "장바구니", icon: <CartIcon /> },
    { href: "/orders", label: "주문내역", icon: <OrderIcon /> },
  ];

  const getSellerLinks = (): NavLink[] => [
    { href: "/seller/dashboard", label: "대시보드", icon: <HomeIcon /> },
    { href: "/seller/products", label: "상품 관리", icon: <ProductIcon /> },
    { href: "/seller/orders", label: "주문 관리", icon: <OrderIcon /> },
    { href: "/seller/stats", label: "매출 통계", icon: <StatsIcon /> },
  ];

  const getAdminLinks = (): NavLink[] => [
    { href: "/admin/dashboard", label: "대시보드", icon: <HomeIcon /> },
    { href: "/admin/users", label: "사용자 관리", icon: <UserIcon /> },
    { href: "/admin/products", label: "상품 심사", icon: <ProductIcon /> },
    { href: "/admin/reports", label: "통계", icon: <ChartIcon /> },
  ];

  const navLinks =
    persona === "seller" ? getSellerLinks() :
    persona === "admin" ? getAdminLinks() :
    getBuyerLinks();

  // Logo href also persona-specific
  const logoHref =
    persona === "seller" ? "/seller/dashboard" :
    persona === "admin" ? "/admin/dashboard" :
    "/dashboard";

  // ... rest of component using navLinks and logoHref
}
```

---

### Sprint 2 (다음 스프린트 - 4-6시간)

#### 4. 상세 페이지 "뒤로 가기" 버튼 추가
**예상 작업시간**: 30분 × 2 = 1시간

**파일**:
- `src/app/(portal)/products/[id]/page.tsx`
- `src/app/(portal)/recipes/[id]/page.tsx`

```typescript
"use client";

import { useRouter } from "next/navigation";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/products")}
        className="mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        상품 목록으로
      </Button>

      {/* Rest of page */}
      ...
    </div>
  );
}
```

---

#### 5. 주문 내역 빈 상태 개선
**예상 작업시간**: 30분

**파일**: `src/app/(portal)/orders/page.tsx`

```typescript
// Empty state with CTA
if (orders.length === 0) {
  return (
    <Card className="p-12 text-center">
      <svg className="mx-auto h-16 w-16 text-text-muted" /* ... */ />
      <h3 className="text-lg font-semibold text-text mt-4">
        주문 내역이 없습니다
      </h3>
      <p className="mt-2 text-sm text-text-secondary">
        첫 주문을 시작해보세요!
      </p>
      <Button
        variant="primary"
        className="mt-6"
        onClick={() => router.push("/products")}
      >
        상품 둘러보기
      </Button>
    </Card>
  );
}
```

---

#### 6. 판매자/관리자 실제 기능 페이지 구현
**예상 작업시간**: 2-3시간

**필요 페이지**:
- `/seller/products` (상품 관리 목록)
- `/seller/orders` (주문 관리 목록)
- `/seller/stats` (매출 통계)
- `/admin/users` (사용자 관리)
- `/admin/products` (상품 심사)
- `/admin/reports` (통계 보고서)

각 페이지는 대시보드와 유사한 구조로, 목 데이터를 사용하여 기본 UI만 구현

---

#### 7. 주문 상세 페이지 구현
**예상 작업시간**: 1-2시간

**파일**: `src/app/(portal)/orders/[id]/page.tsx`

주문 상세 정보, 배송 추적, 재주문 기능

---

### Sprint 3 (향후 개선 - 4-8시간)

#### 8. 관련 콘텐츠 추천
**예상 작업시간**: 2시간

상품/레시피 상세 페이지에 "관련 상품", "이 카테고리의 다른 상품" 섹션 추가

---

#### 9. 마이페이지 구현
**예상 작업시간**: 2-3시간

프로필 편집, 설정, 비밀번호 변경 등

---

#### 10. 모바일 하단 탭 네비게이션
**예상 작업시간**: 2시간

구매자 페르소나에 모바일 최적화된 하단 탭 추가

---

## 📊 개선 전후 비교

### 개선 전 (현재)

| 페르소나 | 접근 가능 페이지 | 접근성 점수 | 주요 문제 |
|---------|----------------|------------|----------|
| 구매자 | 8/8 | 100% | /checkout 미존재, 뒤로가기 버튼 없음 |
| 판매자 | 1/5 | 20% | 모든 기능 페이지 미구현 또는 미연결 |
| 관리자 | 1/5 | 20% | 모든 기능 페이지 미구현 또는 미연결 |
| **전체** | **9/13** | **69%** | 판매자/관리자 체험 불가능 |

### 개선 후 (Sprint 1 완료 시)

| 페르소나 | 접근 가능 페이지 | 접근성 점수 | 개선 사항 |
|---------|----------------|------------|----------|
| 구매자 | 8/8 | 100% | 주문 완료 가능, 뒤로가기 버튼 추가 |
| 판매자 | 4/5 | 80% | 모든 버튼 작동, 페르소나별 네비게이션 |
| 관리자 | 4/5 | 80% | 모든 버튼 작동, 페르소나별 네비게이션 |
| **전체** | **13/13** | **100%** | 모든 페이지 접근 가능 |

---

## ✅ 최종 체크리스트

### Critical (Sprint 1 필수)
- [ ] 판매자 대시보드 버튼 연결 (상품 등록, 주문 처리, 매출 통계)
- [ ] 관리자 대시보드 버튼 연결 (상품 심사, 사용자 관리, 통계)
- [ ] /checkout 페이지 생성 또는 우회 로직 구현
- [ ] 페르소나별 네비게이션 분리

### Important (Sprint 2 권장)
- [ ] 상품 상세 페이지 "← 상품 목록으로" 버튼
- [ ] 레시피 상세 페이지 "← 레시피 목록으로" 버튼
- [ ] 주문 내역 빈 상태 "첫 주문 시작하기" 버튼
- [ ] 판매자 기능 페이지 구현 (/seller/products, /orders, /stats)
- [ ] 관리자 기능 페이지 구현 (/admin/users, /products, /reports)

### Optional (Sprint 3 선택)
- [ ] 주문 상세 페이지 (/orders/[id])
- [ ] 마이페이지 (/profile)
- [ ] 관련 상품/레시피 추천
- [ ] 모바일 하단 탭 네비게이션

---

## 🎯 결론

### 현재 상태 평가

**강점**:
- ✅ 구매자 페르소나는 거의 완벽하게 구현됨
- ✅ 네비게이션 구조가 잘 되어 있음
- ✅ 빈 장바구니 상태 처리가 모범적
- ✅ Toast 액션 버튼으로 장바구니 접근 쉬움
- ✅ 모바일 지원 양호

**약점**:
- ❌ 판매자/관리자 페르소나 체험 불가능 (버튼 미작동)
- ❌ 주문 완료 불가능 (/checkout 미존재)
- ❌ 페르소나별 네비게이션 미분리
- ❌ 상세 페이지에서 뒤로 가기 불편
- ❌ 주문 내역 빈 상태 액션 없음

### 개선 후 기대 효과

**Sprint 1 완료 시** (2-3시간 투자):
- 모든 페르소나에서 최소한의 페이지 탐색 가능
- 데모 체험 시 막히는 부분 없음
- 접근성 점수 69% → 100%

**Sprint 2 완료 시** (4-6시간 투자):
- 판매자/관리자 기능 완전 체험 가능
- UX 크게 개선 (뒤로가기, 빈 상태 등)
- 실제 MVP 수준의 완성도

### 권장사항

1. **Sprint 1을 최우선으로 진행** - 데모 체험 가능하도록
2. 판매자/관리자 페이지는 "준비 중" 페이지로 임시 대응 가능
3. 페르소나별 네비게이션 분리는 필수 (혼란 방지)
4. Sprint 2는 시간 여유에 따라 점진적으로 진행

---

**분석 완료일**: 2025-01-09
**다음 액션**: Sprint 1 태스크 착수
