import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops } from "@/lib/laptops";

export const metadata: Metadata = {
  title: "브랜드별 노트북",
  description:
    "Apple, Samsung, LG, Lenovo, HP, Dell, ASUS, Acer, MSI 등 브랜드별 노트북을 비교해보세요.",
  alternates: {
    canonical: "/brand",
  },
};

const brandInfo: Record<string, { nameKo: string; description: string }> = {
  Apple: {
    nameKo: "애플",
    description: "맥북 프로, 맥북 에어 등 macOS 기반 프리미엄 노트북",
  },
  Samsung: {
    nameKo: "삼성",
    description: "갤럭시북 시리즈, AMOLED 디스플레이의 강자",
  },
  LG: {
    nameKo: "LG",
    description: "그램 시리즈, 초경량 노트북의 대명사",
  },
  Lenovo: {
    nameKo: "레노버",
    description: "씽크패드, 요가 시리즈 등 비즈니스 노트북 강자",
  },
  HP: {
    nameKo: "HP",
    description: "스펙터, 파빌리온, 엔비 등 다양한 라인업",
  },
  Dell: {
    nameKo: "델",
    description: "XPS, 인스피론, 래티튜드 등 프리미엄 라인업",
  },
  ASUS: {
    nameKo: "에이수스",
    description: "젠북, ROG, 비보북 등 다양한 제품군",
  },
  Acer: {
    nameKo: "에이서",
    description: "스위프트, 아스파이어, 프레데터 게이밍 라인업",
  },
  MSI: {
    nameKo: "MSI",
    description: "게이밍과 크리에이터를 위한 고성능 노트북",
  },
  Razer: {
    nameKo: "레이저",
    description: "블레이드 시리즈, 프리미엄 게이밍 노트북",
  },
  Microsoft: {
    nameKo: "마이크로소프트",
    description: "서피스 시리즈, 2-in-1 노트북의 선구자",
  },
  Gigabyte: {
    nameKo: "기가바이트",
    description: "에어로, 어로스 게이밍 노트북",
  },
  Huawei: {
    nameKo: "화웨이",
    description: "메이트북 시리즈, 세련된 디자인의 노트북",
  },
};

export default function BrandListPage() {
  const laptops = getAllLaptops();

  // 브랜드별 노트북 수 계산
  const brandCounts = laptops.reduce(
    (acc, laptop) => {
      acc[laptop.brand] = (acc[laptop.brand] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // 정렬된 브랜드 목록
  const brands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

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
              <Link href="/brand" className="font-medium text-blue-600">
                브랜드
              </Link>
              <Link
                href="/use-case"
                className="text-gray-600 hover:text-gray-900"
              >
                용도별
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">브랜드별 노트북</h1>
          <p className="mt-2 text-gray-600">
            {brands.length}개 브랜드의 노트북을 비교해보세요.
          </p>
        </div>

        {/* Brand Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map(([brand, count]) => {
            const info = brandInfo[brand] || {
              nameKo: brand,
              description: `${brand} 노트북 제품군`,
            };
            return (
              <Link
                key={brand}
                href={`/brand/${brand.toLowerCase()}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    {brand}
                  </h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {count}개 모델
                  </span>
                </div>
                <p className="text-sm text-gray-500">{info.nameKo}</p>
                <p className="mt-2 text-gray-600">{info.description}</p>
              </Link>
            );
          })}
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
