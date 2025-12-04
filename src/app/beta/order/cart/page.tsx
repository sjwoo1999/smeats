"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SmartOrderCartPage() {
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleOrder = () => {
        setShowSuccess(true);
        setTimeout(() => {
            router.push("/beta/dashboard");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center gap-3">
                <button onClick={() => router.back()} className="text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="font-bold text-lg text-slate-900">AI 스마트 발주</h1>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-md space-y-6">
                {/* Value Prop Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <span className="font-bold">최저가 매칭 성공!</span>
                    </div>
                    <p className="text-orange-100 text-sm">
                        시장 평균가 대비 <span className="font-bold text-white">총 4,500원</span>을 절약했어요.
                    </p>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                    <h2 className="font-bold text-slate-900">담긴 상품 (3개)</h2>

                    {/* Item 1 */}
                    <Card>
                        <CardContent className="p-4 flex gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                                🌶️
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900">청정원 순창 고추장 14kg</h3>
                                    <button className="text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">45,000원</span>
                                    <Badge variant="danger" className="bg-red-100 text-red-600 border-none text-[10px] px-1.5 py-0">
                                        최저가
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
                                    <span className="font-medium w-4 text-center">2</span>
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Item 2 */}
                    <Card>
                        <CardContent className="p-4 flex gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                                🧂
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900">CJ 쇠고기 다시다 1kg</h3>
                                    <button className="text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">12,000원</span>
                                    <Badge className="bg-blue-100 text-blue-600 border-none text-[10px] px-1.5 py-0 hover:bg-blue-100">
                                        -500원
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
                                    <span className="font-medium w-4 text-center">1</span>
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Item 3 */}
                    <Card>
                        <CardContent className="p-4 flex gap-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                                🫒
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900">백설 콩기름 1.8L</h3>
                                    <button className="text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">28,000원</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
                                    <span className="font-medium w-4 text-center">3</span>
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto max-w-md space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">총 결제 예정 금액</span>
                        <span className="text-xl font-bold text-slate-900">85,000원</span>
                    </div>
                    <Button className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white" onClick={handleOrder}>
                        85,000원 주문하기
                    </Button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">주문이 완료되었습니다!</h2>
                        <p className="text-slate-500">
                            킹식자재마트로 주문서가 전송되었습니다.<br />
                            내일 오전 9시까지 배송됩니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
