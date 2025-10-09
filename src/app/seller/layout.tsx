import { DemoBanner } from "@/components/demo-banner";
import { CartProvider } from "@/components/cart-provider";
import { Navigation } from "@/components/navigation";

export const dynamic = 'force-dynamic';

/**
 * Seller portal layout
 * Similar to buyer portal but for seller-specific pages
 */
export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-bg">
        <DemoBanner />
        <Navigation />
        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
    </CartProvider>
  );
}
