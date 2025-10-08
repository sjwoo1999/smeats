import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    imageAlt?: string;
    isLowestPrice?: boolean;
    badge?: string;
  };
  isLoading?: boolean;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, isLoading = false, className, ...props }, ref) => {
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
          <p
            className="text-2xl font-bold text-text tabular-nums"
            aria-label={`가격 ${formatPrice(product.price)}`}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
