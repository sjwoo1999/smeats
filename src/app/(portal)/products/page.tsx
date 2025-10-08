import { Suspense } from "react";
import { searchProducts } from "@/server/actions/products";
import { ProductCardInteractive } from "@/components/product-card-interactive";
import { SkeletonGrid } from "@/components/skeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

async function ProductsList({ searchParams }: { searchParams: SearchParams }) {
  const result = await searchProducts({
    q: searchParams.q,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: 20,
  });

  if (!result.success) {
    return (
      <Card className="p-8 text-center">
        <p className="text-danger">{result.error}</p>
      </Card>
    );
  }

  const { products, grouped } = result.data;

  if (products.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <svg
            className="mx-auto h-16 w-16 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-text">상품을 찾을 수 없습니다</h3>
            <p className="mt-2 text-sm text-text-secondary">
              검색 조건을 변경하거나 다른 카테고리를 선택해보세요.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = "/products"}>
            검색 초기화
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          총 <strong className="text-text">{products.length}개</strong> 상품
          {grouped > 0 && (
            <span className="ml-2">
              (<strong className="text-primary">{grouped}개</strong> 최저가)
            </span>
          )}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCardInteractive
            key={product.id}
            product={{
              id: product.id,
              seller_id: product.seller_id,
              name: product.name,
              description: `${product.seller.business_name || "판매자"} | ${product.origin || "원산지 미확인"}`,
              price: product.price,
              unit: product.unit,
              imageUrl: product.image_path || undefined,
              imageAlt: product.name,
              isLowestPrice: product.is_lowest_price,
              badge: product.category,
            }}
          />
        ))}
      </div>

      {/* Pagination - Simple version */}
      <div className="flex justify-center gap-2 pt-8">
        {Number(searchParams.page || 1) > 1 && (
          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(Number(searchParams.page || 1) - 1));
              window.location.href = `/products?${params.toString()}`;
            }}
          >
            이전
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(Number(searchParams.page || 1) + 1));
            window.location.href = `/products?${params.toString()}`;
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const categories = ["육류", "채소", "해산물", "과일", "유제품", "조미료"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">상품 검색</h1>
        <p className="mt-2 text-text-secondary">
          배송 가능한 마트의 상품을 검색하고 최저가를 비교하세요.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="p-6">
        <form method="get" action="/products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                name="q"
                type="search"
                placeholder="상품명 검색..."
                defaultValue={searchParams.q}
                label="검색어"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                카테고리
              </label>
              <select
                name="category"
                defaultValue={searchParams.category}
                className="flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-4 py-2 text-base text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <option value="">전체</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                가격 범위
              </label>
              <div className="flex gap-2">
                <input
                  name="minPrice"
                  type="number"
                  placeholder="최소"
                  defaultValue={searchParams.minPrice}
                  className="flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-sm"
                />
                <span className="flex items-center">~</span>
                <input
                  name="maxPrice"
                  type="number"
                  placeholder="최대"
                  defaultValue={searchParams.maxPrice}
                  className="flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              검색
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => (window.location.href = "/products")}
            >
              초기화
            </Button>
          </div>

          {/* Active Filters */}
          {(searchParams.q || searchParams.category) && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-text-secondary">활성 필터:</span>
              {searchParams.q && (
                <Badge variant="info" size="sm">
                  검색어: {searchParams.q}
                </Badge>
              )}
              {searchParams.category && (
                <Badge variant="info" size="sm">
                  카테고리: {searchParams.category}
                </Badge>
              )}
            </div>
          )}
        </form>
      </Card>

      {/* Products List */}
      <Suspense fallback={<SkeletonGrid count={8} />}>
        <ProductsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
