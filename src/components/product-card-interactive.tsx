"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast";
import { useDemo } from "@/components/demo-provider";
import { cn } from "@/lib/cn";

export interface ProductCardInteractiveProps extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    id: string;
    seller_id: string;
    name: string;
    description?: string;
    price: number;
    unit: string;
    imageUrl?: string;
    imageAlt?: string;
    isLowestPrice?: boolean;
    badge?: string;
    stock?: number;
    minOrder?: number;
  };
  isLoading?: boolean;
}

const ProductCardInteractive = React.forwardRef<HTMLDivElement, ProductCardInteractiveProps>(
  ({ product, isLoading = false, className, ...props }, ref) => {
    const router = useRouter();
    const { add } = useCart();
    const { showToast } = useToast();
    const { isDemo } = useDemo();
    const [isAdding, setIsAdding] = React.useState(false);

    if (isLoading) {
      return (
        <Card
          ref={ref}
          variant="elevated"
          className={cn("overflow-hidden", className)}
          {...props}
        >
          <div className="aspect-square w-full animate-pulse bg-neutral-200" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 animate-pulse bg-neutral-200 rounded" />
            <div className="h-4 w-1/2 animate-pulse bg-neutral-200 rounded" />
            <div className="h-6 w-1/3 animate-pulse bg-neutral-200 rounded" />
          </div>
        </Card>
      );
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);
    };

    const handleCardClick = () => {
      router.push(`/products/${product.id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setIsAdding(true);

      try {
        add({
          product_id: product.id,
          seller_id: product.seller_id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: 1,
          image_path: product.imageUrl || null,
        });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Show success toast with action button (with demo hint if in demo mode)
        showToast("success", isDemo ? "[데모] 장바구니에 추가되었습니다" : "장바구니에 추가되었습니다", {
          description: `${product.name} 1${product.unit}`,
          action: {
            label: "장바구니 보기",
            onClick: () => router.push("/cart"),
          },
        });
      } catch (error) {
        console.error("Failed to add to cart:", error);
        showToast("error", isDemo ? "[데모] 장바구니 추가 실패" : "장바구니 추가 실패", {
          description: "다시 시도해주세요",
        });
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          className
        )}
        role="article"
        aria-label={`${product.name} 상품 카드`}
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
              <svg
                className="h-16 w-16 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.isLowestPrice && (
              <div className="group/tooltip relative z-20">
                <Badge
                  variant="danger"
                  size="sm"
                  className="bg-primary text-white border-0 font-bold shadow-sm cursor-help"
                >
                  최저가
                </Badge>
                <div className="absolute left-0 top-full mt-2 hidden group-hover/tooltip:block w-48 p-2 bg-gray-900/90 text-white text-xs rounded shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                  동일 상품군 중 가장 저렴한 상품입니다.
                </div>
              </div>
            )}
            {product.badge && (
              <Badge variant="default" size="sm" className="shadow-sm">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Quick Add Button - Shows on hover */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="primary"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="shadow-lg"
            >
              {isAdding ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-text line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-text-secondary line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <p
              className="text-2xl font-bold text-text tabular-nums"
              aria-label={`가격 ${formatPrice(product.price)}`}
            >
              {formatPrice(product.price)}
            </p>
            <span className="text-sm text-text-secondary">/ {product.unit}</span>
          </div>

          {/* Stock and Min Order Info */}
          <div className="flex items-center gap-2 text-xs text-text-secondary pt-1">
            {product.stock !== undefined && (
              <div className="flex items-center gap-1">
                {product.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span>재고 {product.stock}{product.unit}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <span className="text-danger font-medium">품절</span>
                  </>
                )}
              </div>
            )}
            {product.minOrder !== undefined && product.minOrder > 1 && (
              <span className="text-text-muted">
                • 최소 {product.minOrder}{product.unit}
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  }
);

ProductCardInteractive.displayName = "ProductCardInteractive";

export { ProductCardInteractive };
