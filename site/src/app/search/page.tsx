import type { Metadata } from "next";
import Link from "next/link";
import { searchLaptops, formatPrice } from "@/lib/laptops";
import SearchBox from "@/components/SearchBox";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  if (!q) {
    return {
      title: "노트북 검색",
      description: "노트북 모델명, 브랜드, 스펙으로 검색해보세요.",
    };
  }

  return {
    title: `"${q}" 검색 결과`,
    description: `"${q}" 검색 결과입니다. 관련 노트북의 스펙과 가격을 비교해보세요.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const results = query ? searchLaptops(query) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Laptop<span className="text-blue-600">FYI</span>
            </Link>
            <nav className="hidden space-x-8 md:flex">
              <Link
                href="/laptops"
                className="text-gray-600 hover:text-gray-900"
              >
                노트북
              </Link>
              <Link
                href="/compare"
                className="text-gray-600 hover:text-gray-900"
              >
                비교하기
              </Link>
              <Link href="/brand" className="text-gray-600 hover:text-gray-900">
                브랜드
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Box */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">노트북 검색</h1>
          <SearchBox initialQuery={query} />
        </div>

        {/* Results */}
        {query && (
          <div>
            <p className="mb-6 text-gray-600">
              <span className="font-semibold text-gray-900">&quot;{query}&quot;</span>{" "}
              검색 결과 {results.length}건
            </p>

            {results.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((laptop) => (
                  <Link
                    key={laptop.id}
                    href={`/laptops/${laptop.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        {laptop.brand}
                      </span>
                      <span className="text-xs text-gray-500">
                        {laptop.year}
                      </span>
                    </div>

                    <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {laptop.model}
                    </h2>

                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {laptop.cpu} · {laptop.ramGb}GB · {laptop.storageGb}GB{" "}
                      {laptop.storageType}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(laptop.priceKrw)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {laptop.displayInch}&quot; {laptop.displayType}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center">
                <p className="text-lg text-gray-600">
                  검색 결과가 없습니다.
                </p>
                <p className="mt-2 text-gray-500">
                  다른 키워드로 검색해보세요. (예: 맥북, 그램, i7, OLED)
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Query State */}
        {!query && (
          <div className="rounded-xl bg-white p-12 text-center">
            <p className="text-lg text-gray-600">
              노트북 모델명, 브랜드, CPU 등으로 검색해보세요.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["맥북 프로", "LG 그램", "OLED", "개발자용", "i7"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © 2024 LaptopFYI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
