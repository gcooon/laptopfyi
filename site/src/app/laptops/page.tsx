import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops, formatPrice } from "@/lib/laptops";
import { generateItemListJsonLd } from "@/lib/seo";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "전체 노트북 목록 - 55개 모델 스펙 비교",
  description:
    "맥북, 삼성 갤럭시북, LG 그램, 레노버 씽크패드 등 55개 노트북 스펙과 중고 가격을 비교해보세요. 브랜드별, 용도별 노트북 추천.",
  keywords: ["노트북 목록", "노트북 비교", "맥북", "갤럭시북", "그램", "씽크패드", "중고 노트북"],
  alternates: {
    canonical: "/laptops",
  },
};

export default function LaptopsPage() {
  const laptops = getAllLaptops();

  const itemListJsonLd = generateItemListJsonLd(
    "전체 노트북 목록",
    "LaptopFYI의 모든 노트북 목록입니다.",
    laptops
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header activeNav="laptops" />

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">전체 노트북</h1>
            <p className="mt-2 text-gray-600">
              총 {laptops.length}개의 노트북을 비교해보세요.
            </p>
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
                    </span>
                  ))}
                </div>
              </Link>
            ))}
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
    </>
  );
}
