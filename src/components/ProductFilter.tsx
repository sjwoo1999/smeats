"use client";

import { useState } from "react";

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "sales_desc"
  | "rating_desc"
  | "recent";

interface ProductFilterProps {
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  showAdvancedFilters?: boolean;
  onFilterChange?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  freeShippingOnly?: boolean;
  fastDeliveryOnly?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "최신순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
  { value: "sales_desc", label: "판매량순" },
  { value: "rating_desc", label: "평점순" },
];

const CATEGORIES = [
  "육류",
  "해산물",
  "채소",
  "과일",
  "유제품",
  "곡물",
  "조미료",
  "기타",
];

export default function ProductFilter({
  onSortChange,
  currentSort,
  showAdvancedFilters = false,
  onFilterChange,
}: ProductFilterProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterApply = () => {
    onFilterChange?.(filters);
    setShowFilterModal(false);
  };

  const handleFilterReset = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        {/* 필터 버튼 */}
        {showAdvancedFilters && (
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* 정렬 선택 */}
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 필터 모달 */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">필터</h3>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 필터 옵션 */}
            <div className="p-4 space-y-6">
              {/* 가격대 */}
              <div>
                <label className="block text-sm font-medium mb-2">가격대</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="최소"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span>~</span>
                  <input
                    type="number"
                    placeholder="최대"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <select
                  value={filters.category || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 배송 옵션 */}
              <div>
                <label className="block text-sm font-medium mb-2">배송 옵션</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.freeShippingOnly || false}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          freeShippingOnly: e.target.checked || undefined,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">무료 배송만 보기</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fastDeliveryOnly || false}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          fastDeliveryOnly: e.target.checked || undefined,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">빠른 배송만 보기 (1일 이내)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
              <button
                type="button"
                onClick={handleFilterReset}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={handleFilterApply}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
