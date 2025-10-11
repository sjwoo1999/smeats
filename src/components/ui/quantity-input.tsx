"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit: string;
  price?: number;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 9999,
  unit,
  price,
  className = "",
}: QuantityInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(value + 1, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - 1, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // 숫자만 허용
    if (val === "" || /^\d+$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(inputValue) || min;
    const clampedValue = Math.max(min, Math.min(numValue, max));
    onChange(clampedValue);
    setInputValue(clampedValue.toString());
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  };

  const totalPrice = price ? value * price : null;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-8 w-8 p-0"
          aria-label="수량 감소"
        >
          −
        </Button>

        <div className="flex flex-col items-center gap-1 min-w-[100px]">
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className={`h-8 w-20 text-center ${isEditing ? "ring-2 ring-blue-500" : ""}`}
              aria-label="수량"
            />
            <span className="text-sm text-gray-600 min-w-[30px]">{unit}</span>
          </div>
          {isEditing && (
            <span className="text-xs text-gray-400">
              {min}~{max} {unit}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-8 w-8 p-0"
          aria-label="수량 증가"
        >
          +
        </Button>
      </div>

      {totalPrice !== null && (
        <div className="text-sm text-gray-600 text-center">
          총 {totalPrice.toLocaleString("ko-KR")}원
        </div>
      )}
    </div>
  );
}
