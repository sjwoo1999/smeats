import BulkUploadForm from "./bulk-upload-form";

export default function BulkUploadPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">상품 일괄 등록</h1>
      <p className="text-gray-600 mb-6">
        CSV 파일을 업로드하여 여러 상품을 한 번에 등록할 수 있습니다.
      </p>

      <BulkUploadForm />
    </div>
  );
}
