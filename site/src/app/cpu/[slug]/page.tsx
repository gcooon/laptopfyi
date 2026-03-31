import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllLaptops, formatPrice } from "@/lib/laptops";
import { generateBreadcrumbJsonLd } from "@/lib/seo";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const cpuSeriesInfo: Record<
  string,
  { name: string; brand: string; description: string }
> = {
  m3: { name: "M3", brand: "Apple", description: "Apple Silicon 3세대" },
  "m3-pro": { name: "M3 Pro", brand: "Apple", description: "프로용 Apple Silicon" },
  "m3-max": { name: "M3 Max", brand: "Apple", description: "최고 성능 Apple Silicon" },
  m2: { name: "M2", brand: "Apple", description: "Apple Silicon 2세대" },
  "core-ultra": { name: "Core Ultra", brand: "Intel", description: "AI 기반 최신 프로세서" },
  "13세대-core": { name: "13세대 Core", brand: "Intel", description: "Raptor Lake" },
  "14세대-core": { name: "14세대 Core", brand: "Intel", description: "Raptor Lake Refresh" },
  "ryzen-7000": { name: "Ryzen 7000", brand: "AMD", description: "Zen 4 아키텍처" },
  "ryzen-8000": { name: "Ryzen 8000", brand: "AMD", description: "최신 Zen 4 모바일" },
};

function slugToCpuSeries(slug: string): string | null {
  const info = cpuSeriesInfo[slug];
  if (info) return info.name;

  // 역변환 시도
  const laptops = getAllLaptops();
  const allSeries = [...new Set(laptops.map((l) => l.cpuSeries))];
  return allSeries.find(
    (series) => series.toLowerCase().replace(/\s+/g, "-") === slug
  ) || null;
}

export async function generateStaticParams() {
  const laptops = getAllLaptops();
  const cpuSeries = [...new Set(laptops.map((l) => l.cpuSeries))];
  return cpuSeries.map((series) => ({
    slug: series.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cpuSeries = slugToCpuSeries(slug);

  if (!cpuSeries) {
    return { title: "CPU를 찾을 수 없습니다" };
  }

  return {
    title: `${cpuSeries} 탑재 노트북 비교`,
    description: `${cpuSeries} 프로세서가 탑재된 노트북 목록. 스펙, 가격, 성능을 비교해보세요.`,
    alternates: {
      canonical: `/cpu/${slug}`,
    },
  };
}

export default async function CpuDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cpuSeries = slugToCpuSeries(slug);

  if (!cpuSeries) {
    notFound();
  }

  const allLaptops = getAllLaptops();
  const laptops = allLaptops.filter((l) => l.cpuSeries === cpuSeries);

  if (laptops.length === 0) {
    notFound();
  }

  const cpuBrand = laptops[0].cpuBrand;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "CPU", url: "https://laptopfyi.com/cpu" },
    { name: cpuSeries, url: `https://laptopfyi.com/cpu/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

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
              <Link href="/cpu" className="hover:text-blue-600">
                CPU
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{cpuSeries}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {cpuBrand}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              {cpuSeries} 탑재 노트북
            </h1>
            <p className="mt-2 text-gray-600">
              {cpuSeries} 프로세서가 탑재된 노트북 {laptops.length}개 모델
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
