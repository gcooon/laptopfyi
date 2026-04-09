import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops, formatPrice } from "@/lib/laptops";
import Header from "@/components/Header";

const LAPTOPS_PER_PAGE = 100;

export const metadata: Metadata = {
  title: "중고 노트북 전체 목록 - 스펙 비교 & 가격 시세 확인",
  description:
    "중고 맥북, 삼성 갤럭시북, LG 그램, 레노버 씽크패드, HP, 델, 에이수스 젠북 등 전 브랜드 노트북 스펙과 중고 가격을 한눈에 비교하세요. 리퍼 노트북 시세 확인, 가성비 노트북 추천, 용도별 노트북 필터링까지.",
  keywords: [
    "중고 노트북", "노트북 목록", "노트북 비교", "노트북 스펙 비교", "노트북 가격 비교",
    "맥북 중고", "갤럭시북 중고", "그램 중고", "씽크패드 중고", "리퍼 노트북",
    "가성비 노트북", "노트북 추천", "노트북 순위", "노트북 성능 비교", "중고 노트북 시세",
  ],
  alternates: {
    canonical: "/laptops",
  },
};

export default function LaptopsPage() {
  const allLaptops = getAllLaptops();
  const laptops = allLaptops.slice(0, LAPTOPS_PER_PAGE);
  const totalPages = Math.ceil(allLaptops.length / LAPTOPS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeNav="laptops" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">전체 노트북</h1>
          <p className="mt-2 text-gray-600">
            총 {allLaptops.length.toLocaleString()}개의 노트북 중 {LAPTOPS_PER_PAGE}개 표시
          </p>
          <Link
            href="/search"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            🔍 검색으로 원하는 노트북 찾기
          </Link>
        </div>

        {/* Brand Quick Links */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['Apple', 'Samsung', 'LG', 'Lenovo', 'HP', 'Dell', 'ASUS', 'Acer', 'MSI'].map((brand) => (
            <Link
              key={brand}
              href={`/brand/${brand.toLowerCase()}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              {brand}
            </Link>
          ))}
        </div>

        {/* Laptop Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {laptops.map((laptop) => (
            <Link
              key={laptop.id}
              href={`/laptops/${laptop.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                  {laptop.brand}
                </span>
                <span className="text-xs text-gray-500">{laptop.year}</span>
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
                  {laptop.displayInch}" {laptop.displayType}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {laptop.useCases.slice(0, 2).map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {useCase === "student" && "학생용"}
                    {useCase === "developer" && "개발자용"}
                    {useCase === "video-editing" && "영상편집"}
                    {useCase === "graphic-design" && "디자인"}
                    {useCase === "office" && "사무용"}
                    {useCase === "gaming" && "게임용"}
                    {useCase === "travel" && "휴대용"}
                    {useCase === "3d-modeling" && "3D작업"}
                    {useCase === "content-creation" && "콘텐츠"}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            더 많은 노트북을 보려면 브랜드별 페이지를 이용하거나 검색해주세요.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/laptops/page/${page}`}
                className={`rounded px-3 py-1 text-sm ${
                  page === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </Link>
            ))}
            {totalPages > 10 && (
              <span className="px-2 py-1 text-gray-500">... ({totalPages} 페이지)</span>
            )}
          </div>
        </div>
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
