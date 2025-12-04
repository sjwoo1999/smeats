"use client";

import Link from "next/link";

export function FloatingBetaBanner() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw]">
            <Link
                href="/beta/dashboard"
                className="group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
                <div className="flex items-center gap-2">
                    <span className="bg-white/20 p-1.5 rounded-full">
                        {/* Sparkles Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-yellow-200"
                        >
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            <path d="M5 3v4" />
                            <path d="M9 5h4" />
                            <path d="M19 21v-4" />
                            <path d="M15 19h4" />
                        </svg>
                    </span>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">
                            SMEats 2.0 Preview
                        </span>
                        <span className="text-sm font-bold">
                            AI 자동 장부 미리보기
                        </span>
                    </div>
                </div>
                {/* ArrowRight Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}
