# Production Error Debugging Guide

## 🔍 문제 상황
Vercel 프로덕션에서 `/products`, `/recipes`, `/orders` 페이지 접근 시 다음 에러 발생:
```
Error: An error occurred in the Server Components render.
The specific message is omitted in production builds to avoid leaking sensitive details.
```

## 🎯 주요 원인 및 해결 방법

### 1. **Server Component에서 Browser API 사용**
❌ **문제**: Server Component에서 `window`, `document` 등 브라우저 전용 API 사용
```tsx
// ❌ 잘못된 예
<Button onClick={() => window.location.href = "/products"}>
```

✅ **해결**: Next.js Link 컴포넌트 사용
```tsx
// ✅ 올바른 예
import Link from "next/link";

<Link href="/products">
  <Button>상품 보기</Button>
</Link>
```

**적용 파일**:
- ✅ `src/app/(portal)/products/page.tsx` - Fixed (commit: 9483c23)
- ✅ `src/app/(portal)/recipes/page.tsx` - Fixed (commit: 9483c23)
- ✅ `src/app/(portal)/orders/page.tsx` - Fixed (commit: 9483c23)

---

### 2. **환경 변수 누락**
❌ **문제**: Vercel에 환경 변수가 설정되지 않아 Mock 데이터 로직 실행 중 에러 발생

**확인 방법**:
```bash
# .env.local.example 참고
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**서버 액션에서 Mock 모드 판단**:
```typescript
// src/server/actions/products.ts:13
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

✅ **해결 단계**:

#### Vercel Dashboard에서 환경 변수 설정
1. Vercel Project → Settings → Environment Variables
2. 다음 변수들을 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY (optional)
   ```
3. **Environment**: Production, Preview, Development 모두 선택
4. **Redeploy** 트리거

#### 또는 Mock 모드로 배포하려면
환경 변수를 설정하지 않으면 자동으로 Mock 데이터 사용 (USE_MOCK_DATA = true)

---

### 3. **Mock 데이터 타입 불일치**
❌ **문제**: Mock 데이터 구조와 타입 정의 불일치

**주의사항**:
```typescript
// Mock 데이터에서 image_url 사용
export const mockProducts = [{
  image_url: "https://...",  // ❌ 타입에는 image_path
}];

// 하지만 ProductWithSeller 타입은
type Product = {
  image_path?: string;  // ⚠️ 속성명 불일치
}
```

✅ **해결**:
- Mock 데이터와 타입 정의의 속성명 통일 필요
- `src/lib/mock-data.ts`와 `src/lib/types.ts` 비교 검증

---

### 4. **Server Action에서 발생하는 에러**
❌ **문제**:
- Supabase 연결 실패
- 데이터 스키마 불일치
- 권한 문제

✅ **디버깅 방법**:

#### 로컬에서 상세 에러 메시지 확인
```bash
npm run dev
# 브라우저 콘솔에서 상세 에러 확인
```

#### 프로덕션 에러 로깅 추가
```typescript
// src/app/(portal)/products/page.tsx
async function ProductsList({ searchParams }: { searchParams: SearchParams }) {
  const result = await searchProducts(searchParams);

  if (!result.success) {
    console.error('[ProductsList Error]', result.error);  // 추가
    return <ErrorDisplay message={result.error} />;
  }
}
```

#### Vercel 로그 확인
```bash
# Vercel CLI 사용
vercel logs [deployment-url]

# 또는 Vercel Dashboard
# Project → Deployments → [선택] → Functions → Runtime Logs
```

---

### 5. **Async Component Rendering 이슈**
❌ **문제**: Server Component에서 비동기 데이터 페칭 실패

**체크리스트**:
- [ ] Server Action이 올바른 ApiResponse 형식 반환하는지 확인
- [ ] try-catch로 에러 핸들링 되어있는지 확인
- [ ] Suspense boundary가 적절히 설정되어있는지 확인

```tsx
// ✅ 올바른 패턴
<Suspense fallback={<SkeletonGrid count={8} />}>
  <ProductsList searchParams={searchParams} />
</Suspense>
```

---

## 🛠️ 디버깅 프로세스

### Step 1: 로컬 빌드 테스트
```bash
npm run build
npm run start  # 프로덕션 모드 로컬 실행

# 또는
vercel build  # Vercel과 동일한 환경
vercel dev    # 로컬에서 Vercel 환경 시뮬레이션
```

### Step 2: 에러 격리
각 페이지에 임시 에러 바운더리 추가:
```tsx
// src/app/(portal)/products/page.tsx
export default function ProductsPage() {
  return (
    <ErrorBoundary fallback={<div>에러 발생</div>}>
      {/* 기존 코드 */}
    </ErrorBoundary>
  );
}
```

### Step 3: Mock vs Real 데이터 테스트
```typescript
// 강제로 Mock 모드 활성화
const USE_MOCK_DATA = true;  // 임시로 true 고정

// 데이터 반환 전 로깅
console.log('[searchProducts] Mock mode:', USE_MOCK_DATA);
console.log('[searchProducts] Result:', result);
```

### Step 4: 점진적 배포
```bash
# Preview 배포로 먼저 테스트
git push origin feature-branch

# Vercel에서 자동 Preview 생성됨
# Preview 환경에서 테스트 후 main 머지
```

---

## 📋 현재 상태 체크리스트

### 완료된 수정 ✅
- [x] Server Component에서 `window.location.href` 제거
- [x] Next.js Link 컴포넌트로 마이그레이션
- [x] 빌드 성공 확인 (로컬)

### 추가 확인 필요 🔍
- [ ] Vercel 환경 변수 설정 확인
- [ ] Mock 데이터 타입 일관성 검증
- [ ] Vercel Runtime Logs 확인
- [ ] Server Action 에러 핸들링 강화
- [ ] 프로덕션 에러 로깅 추가

---

## 🚀 Next Steps

### 즉시 실행
1. **Vercel 환경 변수 확인**
   - Dashboard에서 `NEXT_PUBLIC_SUPABASE_URL` 존재 여부 확인
   - 없으면 Mock 모드로 정상 작동해야 함

2. **Vercel Logs 확인**
   ```bash
   vercel logs --follow
   ```

3. **상세 에러 메시지 활성화** (디버깅용)
   ```typescript
   // next.config.ts
   const nextConfig = {
     productionBrowserSourceMaps: true,  // 임시 활성화
   };
   ```

### 중기 개선
1. **에러 바운더리 추가**
   - 각 주요 페이지에 에러 핸들링 개선

2. **타입 안전성 강화**
   - Mock 데이터와 타입 정의 통일
   - Zod 스키마로 런타임 검증 추가

3. **모니터링 도구 도입**
   - Sentry 또는 Vercel Analytics 연동
   - 프로덕션 에러 자동 수집

---

## 📞 추가 지원

### Vercel 관련
- [Vercel Logs 문서](https://vercel.com/docs/observability/runtime-logs)
- [Environment Variables 설정](https://vercel.com/docs/projects/environment-variables)

### Next.js 관련
- [Server Components 가이드](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

### Supabase 관련
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Environment Variables](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs#environment-variables)

---

**마지막 업데이트**: 2025-10-10
**작성자**: Claude Code Assistant
