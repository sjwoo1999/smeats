interface DeliveryInfoProps {
  fee: number;
  freeThreshold?: number | null;
  avgDeliveryDays: number;
  className?: string;
}

export function DeliveryInfo({
  fee,
  freeThreshold,
  avgDeliveryDays,
  className = "",
}: DeliveryInfoProps) {
  return (
    <div className={`flex items-center gap-3 text-sm text-gray-600 ${className}`}>
      <div className="flex items-center gap-1">
        <span>🚚</span>
        <span>평균 {avgDeliveryDays}일</span>
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div>
        {fee === 0 ? (
          <span className="text-green-600 font-medium">무료배송</span>
        ) : (
          <span>
            배송비 ₩{fee.toLocaleString()}
            {freeThreshold && (
              <span className="text-xs ml-1">
                (₩{freeThreshold.toLocaleString()} 이상 무료)
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
