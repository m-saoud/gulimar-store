export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">المنتج غير موجود</h1>
      <p className="text-gray-600 mb-6">نأسف، لا يمكننا العثور على تفاصيل هذا المنتج. يرجى العودة إلى الصفحة الرئيسية ومحاولة مرة أخرى.</p>
      <a href="/" className="inline-block bg-[#F2C94C] text-[#1A1A1A] font-bold py-2 px-4 rounded hover:bg-[#D4A827] transition-colors">
        العودة إلى الرئيسية
      </a>
    </div>
  );
}
