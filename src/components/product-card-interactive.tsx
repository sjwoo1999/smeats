"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
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
  };
  isLoading?: boolean;
}

const ProductCardInteractive = React.forwardRef<HTMLDivElement, ProductCardInteractiveProps>(
  ({ product, isLoading = false, className, ...props }, ref) => {
    const router = useRouter();
    const { add } = useCart();
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

        // You can add a toast notification here
        console.log(`Added ${product.name} to cart`);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
          className
        )}
        role="article"
        aria-label={`${product.name} 상품 카드`}
        onClick={handleCardClick}
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
              <Badge
                variant="danger"
                size="sm"
                className="bg-primary text-white border-0 font-bold shadow-sm"
              >
                최저가
              </Badge>
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
        </div>
      </Card>
    );
  }
);

ProductCardInteractive.displayName = "ProductCardInteractive";

export { ProductCardInteractive };
