import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllLaptops,
  getLaptopBySlug,
  formatPrice,
} from "@/lib/laptops";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const laptops = getAllLaptops();
  return laptops.map((laptop) => ({
    slug: laptop.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const laptop = getLaptopBySlug(slug);

  if (!laptop) {
    return {
      title: "노트북을 찾을 수 없습니다",
    };
  }

  return {
    title: laptop.metaTitle,
    description: laptop.metaDescription,
    keywords: laptop.tags,
    openGraph: {
      title: laptop.metaTitle,
      description: laptop.metaDescription,
      type: "website",
      url: `https://laptopfyi.com/laptops/${laptop.slug}`,
    },
    alternates: {
      canonical: `/laptops/${laptop.slug}`,
    },
  };
}

export default async function LaptopDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const laptop = getLaptopBySlug(slug);

  if (!laptop) {
    notFound();
  }

  const productJsonLd = generateProductJsonLd(laptop);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "노트북", url: "https://laptopfyi.com/laptops" },
    { name: laptop.fullName, url: `https://laptopfyi.com/laptops/${laptop.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header activeNav="laptops" />

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
              <Link href="/laptops" className="hover:text-blue-600">
                노트북
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/brand/${laptop.brand.toLowerCase()}`}
                className="hover:text-blue-600"
              >
                {laptop.brand}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{laptop.model}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {laptop.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {laptop.fullName}
                    </h1>
                    <p className="mt-2 text-gray-600">
                      {laptop.brand} · {laptop.year}년 출시
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">중고가</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(laptop.priceKrw)}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {laptop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-700">{laptop.metaDescription}</p>
              </div>

              {/* Specs Table */}
              <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  상세 스펙
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* CPU & Memory */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">
                      프로세서 & 메모리
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">CPU</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.cpu}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">CPU 시리즈</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.cpuSeries}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">RAM</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.ramGb}GB {laptop.ramType}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Storage */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">저장장치</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">용량</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.storageGb}GB
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">종류</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.storageType}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Display */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">
                      디스플레이
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">크기</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.displayInch}인치
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">패널</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.displayType}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">해상도</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.displayResolution}
                        </dd>
                      </div>
                      {laptop.displayRefreshRate && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">주사율</dt>
                          <dd className="font-medium text-gray-900">
                            {laptop.displayRefreshRate}Hz
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Graphics & Battery */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">
                      그래픽 & 기타
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">GPU</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.gpu}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">GPU 타입</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.gpuType}
                        </dd>
                      </div>
                      {laptop.batteryWh && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">배터리</dt>
                          <dd className="font-medium text-gray-900">
                            {laptop.batteryWh}Wh
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-600">무게</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.weightKg}kg
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">OS</dt>
                        <dd className="font-medium text-gray-900">
                          {laptop.os}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - CTA & Related */}
            <div className="lg:col-span-1">
              {/* CTA Card */}
              <div className="sticky top-4 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  이 노트북 구매하기
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  리퍼연구소에서 검증된 중고 제품을 만나보세요.
                </p>
                <a
                  href="https://refurlab.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  중고 매물 보기 →
                </a>

                {/* Use Cases */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                    추천 용도
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {laptop.useCases.map((useCase) => (
                      <Link
                        key={useCase}
                        href={`/use-case/${useCase}`}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 hover:bg-green-200"
                      >
                        {useCase === "student" && "학생용"}
                        {useCase === "developer" && "개발자용"}
                        {useCase === "video-editing" && "영상편집용"}
                        {useCase === "graphic-design" && "디자인용"}
                        {useCase === "office" && "사무용"}
                        {useCase === "gaming" && "게임용"}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
