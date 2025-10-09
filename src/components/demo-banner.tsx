"use client";

import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/demo-provider";
import { getPersonaDisplayName, getPersonaIcon } from "@/lib/demo-mode";

export function DemoBanner() {
  const { isDemo, persona, clearPersona } = useDemo();

  // Only show banner when demo mode is active and persona is selected
  if (!isDemo || !persona) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getPersonaIcon(persona)}</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              데모 모드로 체험 중입니다 ({getPersonaDisplayName(persona)})
            </p>
            <p className="text-xs text-amber-800">
              실제 주문이 이루어지지 않으며, 모든 데이터는 샘플입니다.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearPersona} className="border-amber-300 text-amber-900 hover:bg-amber-100">
          다른 페르소나 체험하기
        </Button>
      </div>
    </div>
  );
}
