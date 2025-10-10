"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

type SortOption =
  | "recent"
  | "price_asc"
  | "price_desc"
  | "sales_desc"
  | "rating_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "최신순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "sales_desc", label: "판매량순" },
  { value: "rating_desc", label: "평점순" },
];

export function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentSort = (searchParams.get("sort") as SortOption) || "recent";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (sort: SortOption) => {
    updateSearchParams("sort", sort);
  };

  const handleCategoryChange = (category: string) => {
    updateSearchParams("category", category);
    setIsFilterOpen(false);
  };

  const handlePriceFilter = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    router.push(`?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    router.push("/products");
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 border-b pb-4 mb-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          🔍 필터 {isFilterOpen ? "▲" : "▼"}
        </Button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">정렬:</label>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {/* 카테고리 필터 */}
          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {["채소", "과일", "육류", "수산물", "유제품"].map((cat) => (
                <Button
                  key={cat}
                  variant={currentCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    handleCategoryChange(currentCategory === cat ? "" : cat)
                  }
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* 가격 필터 */}
          <div>
            <label className="block text-sm font-medium mb-2">가격대</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="최소 금액"
                value={currentMinPrice}
                onChange={(e) =>
                  handlePriceFilter(e.target.value, currentMaxPrice)
                }
                className="border rounded-md px-3 py-1 text-sm w-28"
              />
              <span className="text-gray-500">~</span>
              <input
                type="number"
                placeholder="최대 금액"
                value={currentMaxPrice}
                onChange={(e) =>
                  handlePriceFilter(currentMinPrice, e.target.value)
                }
                className="border rounded-md px-3 py-1 text-sm w-28"
              />
              <span className="text-sm text-gray-600">원</span>
            </div>
          </div>

          {/* 초기화 */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              초기화
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
