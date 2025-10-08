import { getEmailVerificationStatus } from "@/server/actions/auth";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { CartProvider } from "@/components/cart-provider";

/**
 * Protected portal layout
 * Shows email verification banner if needed
 * Wraps children with CartProvider for client-side cart state
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emailStatus = await getEmailVerificationStatus();
  const showBanner = emailStatus && !emailStatus.verified;

  return (
    <CartProvider>
      <div className="min-h-screen bg-bg">
        {showBanner && <EmailVerificationBanner />}

        {/* Main Navigation */}
        <nav className="border-b border-border bg-bg-subtle">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="/dashboard" className="text-xl font-bold text-primary">
                SMEats
              </a>

              <div className="flex items-center gap-6">
                <a
                  href="/products"
                  className="text-sm text-text hover:text-primary transition-colors"
                >
                  상품
                </a>
                <a
                  href="/recipes"
                  className="text-sm text-text hover:text-primary transition-colors"
                >
                  레시피
                </a>
                <a
                  href="/cart"
                  className="text-sm text-text hover:text-primary transition-colors"
                >
                  장바구니
                </a>
                <a
                  href="/orders"
                  className="text-sm text-text hover:text-primary transition-colors"
                >
                  주문내역
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
    </CartProvider>
  );
}
