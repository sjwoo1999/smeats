import BulkUploadForm from "./bulk-upload-form";

export default function BulkUploadPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        ℹ️ 목업 모드: 실제 업로드는 수행되지 않습니다.
      </div>

      <h1 className="text-2xl font-bold mb-2">상품 일괄 등록</h1>
      <p className="text-gray-600 mb-6">
        CSV 파일을 업로드하여 여러 상품을 한 번에 등록할 수 있습니다.
      </p>

      <BulkUploadForm />
    </div>
  );
}
