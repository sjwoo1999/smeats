"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SellerDeliveryPage() {
    const [deliveryType, setDeliveryType] = useState<"radius" | "district">("radius");
    const [radius, setRadius] = useState(5);
    const [districts, setDistricts] = useState<string[]>(["강남구", "서초구"]);
    const [newDistrict, setNewDistrict] = useState("");

    const handleAddDistrict = () => {
        if (newDistrict && !districts.includes(newDistrict)) {
            setDistricts([...districts, newDistrict]);
            setNewDistrict("");
        }
    };

    const handleRemoveDistrict = (district: string) => {
        setDistricts(districts.filter((d) => d !== district));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-text mb-2">배송 설정</h1>
            <p className="text-text-secondary mb-8">
                배송 가능한 지역과 조건을 설정하세요.
            </p>

            <div className="grid gap-6">
                {/* Delivery Method Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>배송 권역 설정 방식</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button
                                variant={deliveryType === "radius" ? "primary" : "outline"}
                                onClick={() => setDeliveryType("radius")}
                                className="flex-1 h-auto py-4 flex flex-col gap-2"
                            >
                                <span className="text-lg">📍 반경 기준</span>
                                <span className="text-xs font-normal opacity-80">
                                    매장 위치를 중심으로 반경 N km 이내
                                </span>
                            </Button>
                            <Button
                                variant={deliveryType === "district" ? "primary" : "outline"}
                                onClick={() => setDeliveryType("district")}
                                className="flex-1 h-auto py-4 flex flex-col gap-2"
                            >
                                <span className="text-lg">🗺️ 행정구역 기준</span>
                                <span className="text-xs font-normal opacity-80">
                                    특정 구/동 단위로 배송 지역 지정
                                </span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {deliveryType === "radius" ? "배송 반경 설정" : "배송 지역 관리"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {deliveryType === "radius" ? (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        최대 배송 거리 (km)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={radius}
                                            onChange={(e) => setRadius(Number(e.target.value))}
                                            className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <span className="text-xl font-bold w-16 text-right">
                                            {radius}km
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-2">
                                        매장 주소지 기준으로 반경 {radius}km 이내 주문만 접수합니다.
                                    </p>
                                </div>

                                <div className="bg-neutral-100 rounded-lg p-4 h-64 flex items-center justify-center text-text-secondary">
                                    지도 미리보기 (구현 예정)
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        배송 가능 지역 추가
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="예: 강남구, 역삼동"
                                            value={newDistrict}
                                            onChange={(e) => setNewDistrict(e.target.value)}
                                            className="flex-1 border rounded-md px-3 py-2"
                                            onKeyDown={(e) => e.key === "Enter" && handleAddDistrict()}
                                        />
                                        <Button onClick={handleAddDistrict}>추가</Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        설정된 지역 ({districts.length})
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {districts.map((district) => (
                                            <Badge
                                                key={district}
                                                variant="default"
                                                className="pl-3 pr-1 py-1 flex items-center gap-1"
                                            >
                                                {district}
                                                <button
                                                    onClick={() => handleRemoveDistrict(district)}
                                                    className="hover:bg-neutral-200 rounded-full p-0.5"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button size="lg" onClick={() => alert("설정이 저장되었습니다.")}>
                        변경사항 저장
                    </Button>
                </div>
            </div>
        </div>
    );
}
