import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllBrands,
  getLaptopsByBrand,
  formatPrice,
} from "@/lib/laptops";
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const brandNames: Record<string, string> = {
  apple: "애플",
  samsung: "삼성",
  lg: "LG",
  lenovo: "레노버",
  hp: "HP",
  dell: "델",
  asus: "에이수스",
  acer: "에이서",
  msi: "MSI",
  razer: "레이저",
  microsoft: "마이크로소프트",
  gigabyte: "기가바이트",
  huawei: "화웨이",
};

const brandKeywords: Record<string, string[]> = {
  apple: ["맥북", "맥북 프로", "맥북 에어", "애플 노트북", "M3 맥북"],
  samsung: ["삼성 노트북", "갤럭시북", "갤럭시북 프로", "삼성 갤럭시북"],
  lg: ["LG 그램", "그램 노트북", "그램 프로", "초경량 노트북"],
  lenovo: ["레노버 노트북", "씽크패드", "아이디어패드", "요가", "리전"],
  hp: ["HP 노트북", "스펙터", "엔비", "파빌리온", "오멘"],
  dell: ["델 노트북", "XPS", "인스피론", "래티튜드"],
  asus: ["에이수스 노트북", "젠북", "비보북", "ROG", "프로아트"],
  acer: ["에이서 노트북", "스위프트", "아스파이어", "프레데터"],
  msi: ["MSI 노트북", "프레스티지", "스텔스", "카타나"],
  razer: ["레이저 노트북", "블레이드", "게이밍 노트북"],
  microsoft: ["서피스", "서피스 프로", "서피스 랩탑"],
  gigabyte: ["기가바이트 노트북", "에어로", "게이밍"],
  huawei: ["화웨이 노트북", "메이트북"],
};

export async function generateStaticParams() {
  const brands = getAllBrands();
  return brands.map((brand) => ({
    slug: brand.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brandNameKo = brandNames[slug] || slug.toUpperCase();
  const keywords = brandKeywords[slug] || [];

  return {
    title: `${brandNameKo} 노트북 전체 모델 - 스펙 가격 비교`,
    description: `${brandNameKo} 노트북 전 모델의 스펙과 중고 가격을 비교해보세요. ${keywords.slice(0, 3).join(", ")} 등 인기 모델 총정리.`,
    keywords: [...keywords, `${brandNameKo} 노트북`, `${brandNameKo} 중고`, "노트북 비교", "노트북 추천"],
    alternates: {
      canonical: `/brand/${slug}`,
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const laptops = getLaptopsByBrand(slug);

  if (laptops.length === 0) {
    notFound();
  }

  const brandNameKo = brandNames[slug] || slug.toUpperCase();
  const brandName = laptops[0]?.brand || slug.toUpperCase();

  const itemListJsonLd = generateItemListJsonLd(
    `${brandNameKo} 노트북`,
    `${brandNameKo}의 모든 노트북 목록입니다.`,
    laptops
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "브랜드", url: "https://laptopfyi.com/brand" },
    { name: brandNameKo, url: `https://laptopfyi.com/brand/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header activeNav="brand" />

        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                홈
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/brand" className="hover:text-blue-600">
                브랜드
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{brandNameKo}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {brandName} 노트북
            </h1>
            <p className="mt-2 text-gray-600">
              {brandNameKo}의 노트북 {laptops.length}개 모델을 비교해보세요.
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
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {laptop.category}
                  </span>
                  <span className="text-xs text-gray-500">{laptop.year}</span>
                </div>

                <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {laptop.model}
                </h2>

                <p className="mb-4 text-sm text-gray-600">
                  {laptop.cpu} · {laptop.ramGb}GB · {laptop.displayInch}"
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(laptop.priceKrw)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {laptop.weightKg}kg
                  </span>
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
