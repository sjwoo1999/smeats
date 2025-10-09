import { DemoBanner } from "@/components/demo-banner";
import { CartProvider } from "@/components/cart-provider";
import { Navigation } from "@/components/navigation";

export const dynamic = 'force-dynamic';

/**
 * Admin portal layout
 * Similar to other portals but for admin-specific pages
 */
export default function AdminLayout({
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
