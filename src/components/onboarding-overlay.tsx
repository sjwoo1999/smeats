"use client";

import { useState, useEffect } from "react";

interface OnboardingOverlayProps {
    onDismiss: () => void;
}

export function OnboardingOverlay({ onDismiss }: OnboardingOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleInteraction = () => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Dimmed Background */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-[2px] transition-opacity duration-500 animate-in fade-in"
                onClick={handleInteraction}
            />

            {/* Spotlight Area (Bottom Right) */}
            <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-4 animate-in slide-in-from-bottom-10 duration-700">

                {/* 1. Speech Bubble / Tooltip */}
                <div className="relative mr-2 bg-white text-slate-900 px-6 py-4 rounded-2xl shadow-xl max-w-[280px]">
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rotate-45" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">📸 여기를 눌러보세요!</span>
                            <button
                                onClick={handleInteraction}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            영수증을 찍으면 <span className="text-orange-600 font-bold">AI가 10초 만에</span><br />
                            장부를 자동으로 정리해드려요.
                        </p>
                    </div>
                </div>

                {/* 2. Fake FAB (The Trigger) */}
                {/* This replicates the exact look of the real button but sits on top of the overlay */}
                <div className="relative">
                    {/* Pulsing Ring Effect */}
                    <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75 duration-1000" />

                    <button
                        onClick={handleInteraction}
                        className="relative flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full shadow-2xl hover:bg-orange-500 hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                        {/* Camera Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 0 0 0 2-2V9a2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                        </svg>
                    </button>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-white/80 whitespace-nowrap">
                        체험 시작하기
                    </div>
                </div>
            </div>
        </div>
    );
}
