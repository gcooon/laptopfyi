import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops, formatPrice } from "@/lib/laptops";
import Header from "@/components/Header";
import { notFound } from "next/navigation";

const LAPTOPS_PER_PAGE = 100;

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const laptops = getAllLaptops();
  const totalPages = Math.ceil(laptops.length / LAPTOPS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  return {
    title: `전체 노트북 목록 - ${pageNum}페이지`,
    description: `노트북 목록 ${pageNum}페이지. 맥북, 삼성 갤럭시북, LG 그램 등 중고 노트북 스펙과 가격 비교.`,
    alternates: {
      canonical: `/laptops/page/${page}`,
    },
  };
}

export default async function LaptopsPagePaginated({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const allLaptops = getAllLaptops();
  const totalPages = Math.ceil(allLaptops.length / LAPTOPS_PER_PAGE);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
    notFound();
  }

  const startIndex = (pageNum - 1) * LAPTOPS_PER_PAGE;
  const laptops = allLaptops.slice(startIndex, startIndex + LAPTOPS_PER_PAGE);

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, pageNum - 2);
    const end = Math.min(totalPages, pageNum + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeNav="laptops" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">전체 노트북 - {pageNum}페이지</h1>
          <p className="mt-2 text-gray-600">
            총 {allLaptops.length.toLocaleString()}개 중 {startIndex + 1}~{Math.min(startIndex + LAPTOPS_PER_PAGE, allLaptops.length)}번째
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
                {laptop.cpu} · {laptop.ramGb}GB · {laptop.storageGb}GB {laptop.storageType}
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

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {pageNum > 1 && (
            <Link
              href={pageNum === 2 ? "/laptops" : `/laptops/page/${pageNum - 1}`}
              className="rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              ← 이전
            </Link>
          )}

          {pageNum > 3 && (
            <>
              <Link
                href="/laptops"
                className="rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                1
              </Link>
              {pageNum > 4 && <span className="px-2 py-2 text-gray-500">...</span>}
            </>
          )}

          {getVisiblePages().map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/laptops" : `/laptops/page/${p}`}
              className={`rounded px-3 py-2 text-sm ${
                p === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {p}
            </Link>
          ))}

          {pageNum < totalPages - 2 && (
            <>
              {pageNum < totalPages - 3 && <span className="px-2 py-2 text-gray-500">...</span>}
              <Link
                href={`/laptops/page/${totalPages}`}
                className="rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                {totalPages}
              </Link>
            </>
          )}

          {pageNum < totalPages && (
            <Link
              href={`/laptops/page/${pageNum + 1}`}
              className="rounded px-3 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              다음 →
            </Link>
          )}
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
