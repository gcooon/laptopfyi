import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLaptops, getLaptopBySlug } from "@/lib/laptops";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import CompareTable from "@/components/CompareTable";
import CompareSelector from "@/components/CompareSelector";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseCompareSlug(slug: string): { slug1: string; slug2: string } | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  return { slug1: parts[0], slug2: parts[1] };
}

// Dynamic rendering - no generateStaticParams
// Compare pages are rendered on-demand for faster builds

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseCompareSlug(slug);

  if (!parsed) {
    return { title: "비교를 찾을 수 없습니다" };
  }

  const laptop1 = getLaptopBySlug(parsed.slug1);
  const laptop2 = getLaptopBySlug(parsed.slug2);

  if (!laptop1 || !laptop2) {
    return { title: "비교를 찾을 수 없습니다" };
  }

  const title = `${laptop1.model} vs ${laptop2.model} 비교`;
  const description = `${laptop1.fullName}와 ${laptop2.fullName}의 스펙, 가격, 성능을 상세 비교합니다. CPU, RAM, 디스플레이, 배터리 등 모든 사양 비교.`;

  return {
    title,
    description,
    keywords: [
      laptop1.model,
      laptop2.model,
      "노트북 비교",
      laptop1.brand,
      laptop2.brand,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://laptopfyi.com/compare/${slug}`,
    },
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function CompareDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseCompareSlug(slug);

  if (!parsed) {
    notFound();
  }

  const laptop1 = getLaptopBySlug(parsed.slug1);
  const laptop2 = getLaptopBySlug(parsed.slug2);

  if (!laptop1 || !laptop2) {
    notFound();
  }

  const allLaptops = getAllLaptops();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "비교하기", url: "https://laptopfyi.com/compare" },
    {
      name: `${laptop1.model} vs ${laptop2.model}`,
      url: `https://laptopfyi.com/compare/${slug}`,
    },
  ]);

  // 비교 요약 생성
  const priceDiff = Math.abs(laptop1.priceKrw - laptop2.priceKrw);
  const cheaper = laptop1.priceKrw < laptop2.priceKrw ? laptop1 : laptop2;
  const heavier = laptop1.weightKg > laptop2.weightKg ? laptop1 : laptop2;
  const lighter = laptop1.weightKg < laptop2.weightKg ? laptop1 : laptop2;
  const moreRam = laptop1.ramGb > laptop2.ramGb ? laptop1 : laptop2;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header activeNav="compare" />

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
              <Link href="/compare" className="hover:text-blue-600">
                비교하기
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">
              {laptop1.model} vs {laptop2.model}
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {laptop1.model} vs {laptop2.model}
            </h1>
            <p className="mt-2 text-gray-600">
              {laptop1.brand} {laptop1.model}와 {laptop2.brand} {laptop2.model}
              의 상세 스펙 비교
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">더 저렴한 모델</p>
              <p className="mt-1 font-semibold text-green-900">
                {cheaper.model}
              </p>
              <p className="text-sm text-green-600">
                {new Intl.NumberFormat("ko-KR").format(priceDiff)}원 저렴
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-sm text-blue-700">더 가벼운 모델</p>
              <p className="mt-1 font-semibold text-blue-900">{lighter.model}</p>
              <p className="text-sm text-blue-600">
                {(heavier.weightKg - lighter.weightKg).toFixed(2)}kg 가벼움
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-sm text-purple-700">더 많은 RAM</p>
              <p className="mt-1 font-semibold text-purple-900">
                {laptop1.ramGb === laptop2.ramGb ? "동일" : moreRam.model}
              </p>
              <p className="text-sm text-purple-600">
                {laptop1.ramGb === laptop2.ramGb
                  ? `${laptop1.ramGb}GB`
                  : `${moreRam.ramGb}GB`}
              </p>
            </div>
          </div>

          {/* Compare Table */}
          <CompareTable laptop1={laptop1} laptop2={laptop2} />

          {/* Change Selection */}
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              다른 노트북 비교하기
            </h2>
            <CompareSelector
              laptops={allLaptops}
              initialLaptop1={laptop1.slug}
              initialLaptop2={laptop2.slug}
            />
          </div>

          {/* Related Comparisons */}
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              관련 비교
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {allLaptops
                .filter(
                  (l) =>
                    l.slug !== laptop1.slug &&
                    l.slug !== laptop2.slug &&
                    (l.brand === laptop1.brand || l.brand === laptop2.brand)
                )
                .slice(0, 4)
                .map((laptop) => {
                  const compareWith =
                    laptop.brand === laptop1.brand ? laptop2 : laptop1;
                  const slugs = [laptop.slug, compareWith.slug].sort();
                  return (
                    <Link
                      key={laptop.id}
                      href={`/compare/${slugs[0]}-vs-${slugs[1]}`}
                      className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                    >
                      <p className="font-medium text-gray-900">
                        {laptop.model} vs {compareWith.model}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {laptop.brand} vs {compareWith.brand}
                      </p>
                    </Link>
                  );
                })}
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
    </>
  );
}
