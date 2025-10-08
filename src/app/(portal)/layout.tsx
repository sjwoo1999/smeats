import { getEmailVerificationStatus } from "@/server/actions/auth";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { CartProvider } from "@/components/cart-provider";
import { Navigation } from "@/components/navigation";

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
        <Navigation />
        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
    </CartProvider>
  );
}
