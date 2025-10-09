"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDemo } from "@/components/demo-provider";
import { getPersonaIcon, getPersonaDisplayName, getPersonaDescription, type PersonaType } from "@/lib/demo-mode";

export default function Home() {
  const { isDemo, setPersona } = useDemo();

  const personas: PersonaType[] = ["buyer", "seller", "admin"];

  const handlePersonaSelect = (persona: PersonaType) => {
    setPersona(persona);
  };

  // Show persona selection for demo mode
  if (isDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-bg flex items-center justify-center px-6">
        <div className="w-full max-w-6xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-text">
              🍽️ SMEats 데모 체험하기
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              급식 식자재 B2B 마켓플레이스를 체험해보세요
            </p>
            <p className="text-sm text-text-muted">
              역할을 선택하면 해당 페르소나의 전용 화면을 체험할 수 있습니다
            </p>
          </div>

          {/* Persona Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {personas.map((persona) => (
              <Card
                key={persona}
                variant="elevated"
                className="group cursor-pointer transition-all hover:shadow-2xl hover:scale-105"
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  {/* Icon */}
                  <div className="text-6xl mx-auto w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {getPersonaIcon(persona)}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-text">
                      {persona === "buyer" && "구매자로"}
                      {persona === "seller" && "판매자로"}
                      {persona === "admin" && "관리자로"}
                      <br />
                      체험하기
                    </h3>
                    <p className="text-sm font-medium text-text-secondary">
                      {getPersonaDisplayName(persona)}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-text-muted text-sm">
                    {getPersonaDescription(persona)}
                  </p>

                  {/* Button */}
                  <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                    선택하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl flex-shrink-0">⚠️</div>
              <div className="space-y-2">
                <p className="font-semibold text-amber-900">
                  이것은 데모 환경입니다
                </p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>실제 주문이 이루어지지 않습니다</li>
                  <li>모든 데이터는 샘플이며 실제 데이터가 아닙니다</li>
                  <li>결제 기능은 작동하지 않습니다</li>
                  <li>언제든지 다른 페르소나로 전환하여 체험할 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center text-sm text-text-muted space-y-2">
            <p>
              실제 서비스는 준비 중입니다
            </p>
            <p className="text-xs">
              &copy; 2025 SMEats. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Production landing page (when demo mode is off)
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-bg border-b border-border">
        <div className="container mx-auto px-6 py-24 max-w-7xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-text">
              급식 식자재 B2B 마켓플레이스
              <span className="block text-primary mt-2">SMEats</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              배송 가능한 마트의 상품을 검색하고 최저가를 비교하세요.
              <br />
              레시피 기반 발주로 더욱 편리하게.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="primary">
                서비스 준비 중
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Message */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-text">곧 만나요!</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              SMEats는 현재 개발 중입니다. 급식 식자재 구매를 더 쉽고 저렴하게 만들 예정입니다.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
