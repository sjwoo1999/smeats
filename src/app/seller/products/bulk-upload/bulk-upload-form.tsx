"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  unit: string;
  origin?: string;
  stock: number;
  status: "ready" | "error";
  error?: string;
}

export default function BulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        alert("CSV 파일만 업로드 가능합니다.");
        return;
      }
      setFile(selectedFile);
      setProducts([]);
      setUploaded(false);
    }
  };

  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim());

    // 필수 컬럼 검증
    const requiredColumns = ["상품명", "카테고리", "가격", "단위", "재고"];
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      alert(
        `필수 컬럼이 누락되었습니다: ${missingColumns.join(", ")}\n\n필수 컬럼: ${requiredColumns.join(", ")}`
      );
      return [];
    }

    const parsedProducts: ParsedProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      // 데이터 검증
      const product: ParsedProduct = {
        name: row["상품명"],
        category: row["카테고리"],
        price: parseFloat(row["가격"]) || 0,
        unit: row["단위"],
        origin: row["원산지"],
        stock: parseInt(row["재고"]) || 0,
        status: "ready",
      };

      // 검증 로직
      if (!product.name) {
        product.status = "error";
        product.error = "상품명 누락";
      } else if (!product.category) {
        product.status = "error";
        product.error = "카테고리 누락";
      } else if (product.price <= 0) {
        product.status = "error";
        product.error = "가격 오류";
      } else if (!product.unit) {
        product.status = "error";
        product.error = "단위 누락";
      } else if (product.stock < 0) {
        product.status = "error";
        product.error = "재고 오류";
      }

      parsedProducts.push(product);
    }

    return parsedProducts;
  };

  const handlePreview = async () => {
    if (!file) return;

    setLoading(true);
    const text = await file.text();
    const parsed = parseCSV(text);
    setProducts(parsed);
    setLoading(false);
  };

  const handleUpload = async () => {
    const validProducts = products.filter((p) => p.status === "ready");

    if (validProducts.length === 0) {
      alert("등록 가능한 상품이 없습니다.");
      return;
    }

    const confirmed = confirm(
      `${validProducts.length}개의 상품을 등록하시겠습니까?\n\n등록 후에는 개별적으로 수정할 수 있습니다.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/seller/products/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: validProducts }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "일괄 등록 실패");
      }

      const result = await response.json();

      alert(
        `✅ ${result.successCount || validProducts.length}개 상품이 등록되었습니다!${
          result.failedCount > 0
            ? `\n⚠️ ${result.failedCount}개 상품 등록 실패`
            : ""
        }`
      );
      setUploaded(true);
    } catch (error) {
      console.error("일괄 등록 오류:", error);
      alert(
        `❌ 일괄 등록에 실패했습니다.\n\n${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `상품명,카테고리,가격,단위,원산지,재고
국내산 돼지고기,육류,15000,kg,국내산,100
유기농 감자,채소,3500,kg,국내산,200
양파,채소,2500,kg,국내산,150`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "상품_일괄등록_템플릿.csv";
    link.click();
  };

  const errorCount = products.filter((p) => p.status === "error").length;
  const readyCount = products.filter((p) => p.status === "ready").length;

  return (
    <div className="space-y-6">
      {/* 템플릿 다운로드 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-2">📥 CSV 템플릿 다운로드</h3>
        <p className="text-sm text-gray-700 mb-4">
          먼저 템플릿 파일을 다운로드하여 양식을 확인하세요.
        </p>
        <Button variant="outline" onClick={downloadTemplate}>
          템플릿 다운로드
        </Button>
      </Card>

      {/* 파일 업로드 */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">CSV 파일 선택</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1 text-sm border rounded px-3 py-2"
            />
            <Button onClick={handlePreview} disabled={!file || loading}>
              {loading ? "분석 중..." : "미리보기"}
            </Button>
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              선택된 파일: <span className="font-medium">{file.name}</span> (
              {(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      </Card>

      {/* 미리보기 */}
      {products.length > 0 && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                미리보기 ({products.length}개)
              </h3>
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  정상: {readyCount}
                </span>
                {errorCount > 0 && (
                  <span className="text-red-600 font-medium ml-4">
                    오류: {errorCount}
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">상태</th>
                    <th className="px-4 py-2 text-left">상품명</th>
                    <th className="px-4 py-2 text-left">카테고리</th>
                    <th className="px-4 py-2 text-left">가격</th>
                    <th className="px-4 py-2 text-left">단위</th>
                    <th className="px-4 py-2 text-left">원산지</th>
                    <th className="px-4 py-2 text-left">재고</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={index}
                      className={
                        product.status === "error" ? "bg-red-50" : ""
                      }
                    >
                      <td className="px-4 py-2">
                        {product.status === "ready" ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600" title={product.error}>
                            ✗
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">{product.name || "-"}</td>
                      <td className="px-4 py-2">{product.category || "-"}</td>
                      <td className="px-4 py-2">
                        {product.price.toLocaleString()}원
                      </td>
                      <td className="px-4 py-2">{product.unit || "-"}</td>
                      <td className="px-4 py-2">{product.origin || "-"}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 등록 버튼 */}
          {!uploaded && readyCount > 0 && (
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setProducts([]);
                  setFile(null);
                }}
                variant="outline"
                disabled={loading}
              >
                취소
              </Button>
              <Button onClick={handleUpload} disabled={loading}>
                {loading
                  ? "등록 중..."
                  : `${readyCount}개 상품 등록`}
              </Button>
            </div>
          )}

          {uploaded && (
            <Card className="p-6 bg-green-50 border-green-200">
              <p className="text-green-800 font-medium">
                ✓ 등록이 완료되었습니다!
              </p>
            </Card>
          )}
        </>
      )}

      {/* 안내사항 */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-2">📝 CSV 파일 작성 가이드</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 첫 번째 줄은 헤더(컬럼명)입니다.</li>
          <li>
            • 필수 컬럼: 상품명, 카테고리, 가격, 단위, 재고
          </li>
          <li>• 선택 컬럼: 원산지</li>
          <li>• 가격은 숫자만 입력하세요 (쉼표 없이)</li>
          <li>• 재고는 0 이상의 정수로 입력하세요</li>
          <li>• UTF-8 인코딩으로 저장하세요</li>
        </ul>
      </Card>
    </div>
  );
}
