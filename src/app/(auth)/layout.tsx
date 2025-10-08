/**
 * Auth layout - shared layout for signup/login pages
 * Centers content with minimal styling
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
