import { Suspense } from "react";
import Link from "next/link";
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
  sort?: string;
  page?: string;
}

const SORT_OPTIONS = [
  { value: "recent", label: "최신순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "sales_desc", label: "판매량순" },
  { value: "rating_desc", label: "평점순" },
] as const;

async function ProductsList({ searchParams }: { searchParams: SearchParams }) {
  const result = await searchProducts({
    q: searchParams.q,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: (searchParams.sort as "price_asc" | "price_desc" | "sales_desc" | "rating_desc" | "recent") || "recent",
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
          <Link href="/products">
            <Button variant="outline">
              검색 초기화
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info & Sort */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            총 <strong className="text-text">{products.length}개</strong> 상품
            {grouped > 0 && (
              <span className="ml-2">
                (<strong className="text-primary">{grouped}개</strong> 최저가)
              </span>
            )}
          </p>
          {searchParams.q && (
            <p className="text-xs text-text-muted">
              <span className="font-medium">&ldquo;{searchParams.q}&rdquo;</span> 검색 결과
            </p>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text">정렬:</span>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((option) => {
              const params = new URLSearchParams();
              if (searchParams.q) params.set("q", searchParams.q);
              if (searchParams.category) params.set("category", searchParams.category);
              if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
              if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
              params.set("sort", option.value);

              const isActive = (searchParams.sort || "recent") === option.value;

              return (
                <Link
                  key={option.value}
                  href={`/products?${params.toString()}`}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-white font-medium"
                      : "bg-bg-subtle text-text-secondary hover:bg-bg-subtle-hover"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
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
              stock: product.stock,
            }}
          />
        ))}
      </div>

      {/* Pagination - Simple version */}
      <div className="flex justify-center gap-2 pt-8">
        {Number(searchParams.page || 1) > 1 && (
          <Link
            href={`/products?${new URLSearchParams({
              ...(searchParams.q && { q: searchParams.q }),
              ...(searchParams.category && { category: searchParams.category }),
              ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
              ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
              page: String(Number(searchParams.page || 1) - 1),
            }).toString()}`}
          >
            <Button variant="outline">
              이전
            </Button>
          </Link>
        )}
        <Link
          href={`/products?${new URLSearchParams({
            ...(searchParams.q && { q: searchParams.q }),
            ...(searchParams.category && { category: searchParams.category }),
            ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
            ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
            page: String(Number(searchParams.page || 1) + 1),
          }).toString()}`}
        >
          <Button variant="outline">
            다음
          </Button>
        </Link>
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
            <Link href="/products">
              <Button type="button" variant="outline">
                초기화
              </Button>
            </Link>
          </div>

          {/* Active Filters */}
          {(searchParams.q || searchParams.category || searchParams.minPrice || searchParams.maxPrice) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm text-text-secondary font-medium">활성 필터:</span>
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
              {(searchParams.minPrice || searchParams.maxPrice) && (
                <Badge variant="info" size="sm">
                  가격: {searchParams.minPrice || "0"}원 ~ {searchParams.maxPrice || "∞"}원
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
