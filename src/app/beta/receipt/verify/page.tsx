"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReceiptVerifyPage() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        // Simulate AI analysis time
        const timer = setTimeout(() => {
            setIsScanning(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleConfirm = () => {
        // Navigate back to dashboard with success flag
        // In a real app, we would save data here
        router.push("/beta/dashboard?verified=true");
    };

    if (isScanning) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Receipt Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 17V7" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">AI가 영수증을 분석 중입니다</h2>
                    <p className="text-slate-400 text-sm">잠시만 기다려주세요... (약 2초)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="text-slate-600">
                        {/* ChevronLeft */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">영수증 분석 결과</h1>
                </div>
                <Badge variant="success" className="bg-green-100 text-green-700 border-none">
                    AI 신뢰도 98%
                </Badge>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-md">
                <div className="space-y-6">
                    {/* Receipt Image Preview (Mock) */}
                    <div className="aspect-[3/4] bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/10" />
                        <span className="text-slate-500 text-sm">영수증 원본 이미지</span>

                        {/* Scan Overlay Effect */}
                        <div className="absolute inset-x-0 h-1 bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                    </div>

                    {/* Extracted Data */}
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3">품목명</th>
                                        <th className="px-4 py-3 text-center">수량</th>
                                        <th className="px-4 py-3 text-right">금액</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-3 font-medium">양파 (대)</td>
                                        <td className="px-4 py-3 text-center">1</td>
                                        <td className="px-4 py-3 text-right">3,500원</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">대파 (단)</td>
                                        <td className="px-4 py-3 text-center">2</td>
                                        <td className="px-4 py-3 text-right">4,000원</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">깐마늘 1kg</td>
                                        <td className="px-4 py-3 text-center">1</td>
                                        <td className="px-4 py-3 text-right">8,900원</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">청양고추</td>
                                        <td className="px-4 py-3 text-center">1</td>
                                        <td className="px-4 py-3 text-right">2,500원</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-slate-50 font-bold text-slate-900">
                                    <tr>
                                        <td className="px-4 py-3" colSpan={2}>합계</td>
                                        <td className="px-4 py-3 text-right text-orange-600">18,900원</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-700">
                        {/* Info Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <p>
                            AI가 분석한 내용이 정확한지 확인해주세요. 잘못된 내용은 직접 수정할 수 있습니다.
                        </p>
                    </div>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-bottom">
                <div className="container mx-auto max-w-md flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                        다시 촬영
                    </Button>
                    <Button className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white" onClick={handleConfirm}>
                        장부 등록하기
                    </Button>
                </div>
            </div>
        </div>
    );
}
