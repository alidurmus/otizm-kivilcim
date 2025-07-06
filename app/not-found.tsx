import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🤔</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Sayfa Bulunamadı
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="space-y-4">
          <Link
            href="/modules"
            className="block bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            🎯 Modüllere Git
          </Link>
          <Link
            href="/"
            className="block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            🏠 Ana Sayfaya Git
          </Link>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          Sorun devam ederse lütfen yöneticiye başvurun.
        </div>
      </div>
    </div>
  );
} 