
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingOverlay } from "@/components/onboarding-overlay";

// Mock Data
const MOCK_DATA = {
    revenue: 850000,
    revenueGrowth: 12.5,
    stockAlerts: [
        { id: 1, name: "양파", status: "critical", message: "내일 점심 장사 위험" },
        { id: 2, name: "대파", status: "warning", message: "재고 20% 미만" },
    ],
    recommendations: [
        { id: 1, name: "청정원 순창 고추장", quantity: "2개", price: 45000 },
        { id: 2, name: "CJ 쇠고기 다시다", quantity: "1개", price: 12000 },
        { id: 3, name: "백설 식용유", quantity: "3개", price: 28000 },
    ]
};

export default function BetaDashboardPage() {
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleDismissOnboarding = () => {
        setShowOnboarding(false);
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 3000);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Onboarding Overlay */}
            {showOnboarding && <OnboardingOverlay onDismiss={handleDismissOnboarding} />}

            {/* Demo Mode Banner */}
            <div className="bg-slate-900 text-white px-4 py-3 text-center text-sm font-medium">
                🚧 현재 데모 모드 체험 중입니다. 실제 데이터가 아닙니다.
            </div>

            <main className="container mx-auto px-4 py-6 max-w-md md:max-w-2xl lg:max-w-4xl space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            안녕하세요, 사장님! 👋
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            오늘의 장사 현황을 브리핑해드릴게요.
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                        {/* User Avatar Placeholder */}
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                            👤
                        </div>
                    </div>
                </header>

                {/* Revenue Card */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 font-medium">오늘 예상 매출</span>
                            <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                {/* TrendingUp Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                                +{MOCK_DATA.revenueGrowth}%
                            </Badge>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">
                            {formatPrice(MOCK_DATA.revenue)}
                        </div>
                        <p className="text-xs text-slate-400">
                            어제 동시간 대비 125,000원 증가
                        </p>
                    </CardContent>
                </Card>

                {/* Stock Alert Card */}
                <Card className="border-l-4 border-l-orange-500 shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                            {/* AlertTriangle Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                            재고 부족 알림
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {MOCK_DATA.stockAlerts.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800">{item.name}</span>
                                        <span className="text-xs text-orange-600 font-medium px-2 py-0.5 bg-white rounded-full border border-orange-200">
                                            {item.message}
                                        </span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-100">
                                        주문
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Recommendation Card */}
                <Card className="shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-500" />
                            AI 스마트 발주 추천
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">
                                지난 주 판매 데이터를 분석하여 필요한 식자재를 담았습니다.
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                {MOCK_DATA.recommendations.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                        <div>
                                            <p className="font-medium text-slate-800">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.quantity} • {formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-2 flex items-center justify-between font-bold text-slate-900">
                                    <span>총 예상 금액</span>
                                    <span>{formatPrice(85000)}</span>
                                </div>
                            </div>

                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg shadow-lg shadow-slate-200">
                                {/* ShoppingCart Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                                    <circle cx="8" cy="21" r="1" />
                                    <circle cx="19" cy="21" r="1" />
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                </svg>
                                한 번에 주문하기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Floating Action Button (Camera) */}
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    className="group relative flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full shadow-xl hover:bg-orange-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
                    onClick={() => {
                        setIsAnalyzing(true);
                        setTimeout(() => setIsAnalyzing(false), 3000);
                    }}
                >
                    {isAnalyzing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
                        </div>
                    ) : (
                        /* Camera Icon */
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                        </svg>
                    )}

                    {/* Label for accessibility/clarity */}
                    <span className="sr-only">영수증 촬영</span>
                </button>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-500 whitespace-nowrap">
                    영수증 촬영
                </div>
            </div>

            {/* Toast Simulation (Simple fixed overlay for demo) */}
            {isAnalyzing && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-top-5 fade-in flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>영수증을 분석하고 있습니다...</span>
                </div>
            )}
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 5h4" />
            <path d="M19 21v-4" />
            <path d="M15 19h4" />
        </svg>
    );
}
