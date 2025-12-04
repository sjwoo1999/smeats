"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center gap-3">
                <button onClick={() => router.back()} className="text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="font-bold text-lg text-slate-900">매출 상세 분석</h1>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-md space-y-6">
                {/* AI Insight Box */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-indigo-100 rounded-full blur-xl opacity-50" />
                    <div className="flex gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-indigo-900">사장님, 주목해주세요!</h3>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                                오늘 <span className="font-bold underline decoration-indigo-300">김치찌개</span> 주문이 평소보다 <span className="font-bold text-indigo-900">20%</span> 늘었어요.
                                내일도 비 소식이 있으니 김치 재고를 미리 확인해보세요.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weekly Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">최근 7일 매출 추이</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 flex items-end justify-between gap-2 pt-4">
                            {[
                                { day: "월", val: 40, label: "40만" },
                                { day: "화", val: 35, label: "35만" },
                                { day: "수", val: 55, label: "55만" },
                                { day: "목", val: 45, label: "45만" },
                                { day: "금", val: 70, label: "70만" },
                                { day: "토", val: 85, label: "85만" },
                                { day: "일", val: 60, label: "60만" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="relative w-full flex items-end justify-center h-full">
                                        <div
                                            className={`w-full max-w-[24px] rounded-t-md transition-all duration-500 group-hover:opacity-80 ${idx === 5 ? 'bg-orange-500' : 'bg-slate-200'}`}
                                            style={{ height: `${item.val}%` }}
                                        />
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                                            {item.label}
                                        </div>
                                    </div>
                                    <span className={`text-xs ${idx === 5 ? 'font-bold text-slate-900' : 'text-slate-400'}`}>
                                        {item.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Best Menu Ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">오늘의 인기 메뉴 TOP 3</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { rank: 1, name: "돼지 김치찌개", count: 45, change: "+12%" },
                            { rank: 2, name: "제육볶음", count: 38, change: "-5%" },
                            { rank: 3, name: "계란말이", count: 22, change: "+8%" },
                        ].map((item) => (
                            <div key={item.rank} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${item.rank === 1 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {item.rank}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.count}그릇 판매</p>
                                    </div>
                                </div>
                                <Badge variant={item.change.startsWith('+') ? 'success' : 'outline'} className="bg-slate-100 text-slate-600 border-none">
                                    {item.change}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
