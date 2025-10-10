interface BusinessHours {
  day_of_week: number;
  open_time: string;
  close_time: string;
}

interface SellerInfoProps {
  businessName: string | null;
  businessHours?: BusinessHours[];
  recentSales?: number;
  className?: string;
}

export function SellerInfo({
  businessName,
  businessHours,
  recentSales,
  className = "",
}: SellerInfoProps) {
  const getTodayHours = () => {
    const today = new Date().getDay();
    return businessHours?.find((h) => h.day_of_week === today);
  };

  const todayHours = getTodayHours();

  return (
    <div className={`space-y-2 ${className}`}>
      {businessName && (
        <div className="text-sm font-medium text-gray-800">{businessName}</div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-600">
        {todayHours && (
          <>
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>
                {todayHours.open_time.slice(0, 5)} -{" "}
                {todayHours.close_time.slice(0, 5)}
              </span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
          </>
        )}

        {recentSales !== undefined && (
          <div className="flex items-center gap-1">
            <span>📦</span>
            <span>최근 30일 {recentSales}건 판매</span>
          </div>
        )}
      </div>
    </div>
  );
}
