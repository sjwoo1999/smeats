"use client";

interface DeliveryInfoProps {
  fee: number;
  freeThreshold?: number;
  avgDays: number;
  schedule?: { start: string; end: string };
}

export function DeliveryInfo({
  fee,
  freeThreshold,
  avgDays,
  schedule,
}: DeliveryInfoProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">🚚 배송비:</span>
        <span className="font-medium">
          {fee === 0 ? "무료" : `${fee.toLocaleString("ko-KR")}원`}
        </span>
        {freeThreshold && freeThreshold > 0 && (
          <span className="text-xs text-gray-500">
            ({freeThreshold.toLocaleString("ko-KR")}원 이상 무료)
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">⏱️ 평균 배송:</span>
        <span className="font-medium">{avgDays}일</span>
      </div>
      {schedule && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">🕐 배송 시간:</span>
          <span className="font-medium">
            {schedule.start} ~ {schedule.end}
          </span>
        </div>
      )}
    </div>
  );
}

interface SellerInfoProps {
  businessName?: string;
  contactPhone?: string;
  recentSales?: number;
  rating?: number;
  businessHours?: Array<{
    day_of_week: number;
    open_time: string;
    close_time: string;
  }>;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export function SellerInfo({
  businessName,
  contactPhone,
  recentSales,
  rating,
  businessHours,
}: SellerInfoProps) {
  const getTodayHours = () => {
    if (!businessHours || businessHours.length === 0) return null;
    const today = new Date().getDay();
    return businessHours.find((h) => h.day_of_week === today);
  };

  const todayHours = getTodayHours();

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{businessName || "판매자"}</h4>
          {contactPhone && (
            <p className="text-sm text-gray-600">{contactPhone}</p>
          )}
        </div>
        {rating && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        {todayHours && (
          <div>
            <span className="text-gray-600">영업시간:</span>{" "}
            <span className="font-medium">
              {todayHours.open_time.slice(0, 5)} ~{" "}
              {todayHours.close_time.slice(0, 5)}
            </span>
          </div>
        )}
        {recentSales !== undefined && (
          <div>
            <span className="text-gray-600">최근 30일 판매:</span>{" "}
            <span className="font-medium">{recentSales}건</span>
          </div>
        )}
      </div>

      {businessHours && businessHours.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            전체 영업시간 보기
          </summary>
          <div className="mt-2 space-y-1 pl-2">
            {businessHours.map((h) => (
              <div key={h.day_of_week} className="flex justify-between">
                <span className="text-gray-600">
                  {DAY_NAMES[h.day_of_week]}요일
                </span>
                <span>
                  {h.open_time.slice(0, 5)} ~ {h.close_time.slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
