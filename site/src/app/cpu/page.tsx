import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops } from "@/lib/laptops";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "CPU별 노트북 - 인텔 코어 울트라·AMD 라이젠·애플 M3 성능 비교",
  description:
    "인텔 코어 울트라, 인텔 i7, 인텔 i5, AMD 라이젠 7, 애플 M3, M3 Pro, M3 Max 등 프로세서별 노트북 성능과 중고 가격을 비교하세요. CPU 벤치마크, 전력 효율, 발열 비교 가이드.",
  keywords: [
    "인텔 코어 울트라", "AMD 라이젠", "애플 M3", "인텔 i7 노트북", "인텔 i5 노트북",
    "M3 맥북", "M3 Pro 맥북", "노트북 CPU 비교", "노트북 CPU 성능", "CPU 벤치마크",
    "AMD 노트북", "노트북 프로세서 순위",
  ],
  alternates: {
    canonical: "/cpu",
  },
};

const cpuSeriesInfo: Record<
  string,
  { brand: string; description: string; generation?: string }
> = {
  "M3": {
    brand: "Apple",
    description: "Apple Silicon 3세대, 뛰어난 전력 효율과 성능",
    generation: "2023",
  },
  "M3 Pro": {
    brand: "Apple",
    description: "프로 사용자를 위한 고성능 Apple Silicon",
    generation: "2023",
  },
  "M3 Max": {
    brand: "Apple",
    description: "최고 성능의 Apple Silicon",
    generation: "2023",
  },
  "M2": {
    brand: "Apple",
    description: "Apple Silicon 2세대",
    generation: "2022",
  },
  "Core Ultra": {
    brand: "Intel",
    description: "Intel의 최신 AI 기반 프로세서, NPU 탑재",
    generation: "2024",
  },
  "13세대 Core": {
    brand: "Intel",
    description: "Raptor Lake 아키텍처, 하이브리드 코어 구조",
    generation: "2023",
  },
  "14세대 Core": {
    brand: "Intel",
    description: "Raptor Lake Refresh, 향상된 성능",
    generation: "2024",
  },
  "12세대 Core": {
    brand: "Intel",
    description: "Alder Lake, 최초의 하이브리드 아키텍처",
    generation: "2022",
  },
  "Ryzen 7000": {
    brand: "AMD",
    description: "Zen 4 아키텍처, 뛰어난 멀티코어 성능",
    generation: "2023",
  },
  "Ryzen 8000": {
    brand: "AMD",
    description: "Zen 4 기반 최신 모바일 프로세서",
    generation: "2024",
  },
  "Ryzen 6000": {
    brand: "AMD",
    description: "Zen 3+ 아키텍처, 효율적인 전력 관리",
    generation: "2022",
  },
  "Snapdragon X Elite": {
    brand: "Qualcomm",
    description: "ARM 기반 Windows 노트북용 프로세서",
    generation: "2024",
  },
};

export default function CpuListPage() {
  const laptops = getAllLaptops();

  // CPU 시리즈별 노트북 수 계산
  const cpuCounts = laptops.reduce(
    (acc, laptop) => {
      acc[laptop.cpuSeries] = (acc[laptop.cpuSeries] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // CPU 브랜드별로 그룹화
  const cpuByBrand: Record<string, { series: string; count: number }[]> = {};

  Object.entries(cpuCounts).forEach(([series, count]) => {
    const info = cpuSeriesInfo[series];
    const brand = info?.brand || "기타";
    if (!cpuByBrand[brand]) {
      cpuByBrand[brand] = [];
    }
    cpuByBrand[brand].push({ series, count });
  });

  const brandOrder = ["Intel", "Apple", "AMD", "Qualcomm", "기타"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CPU별 노트북</h1>
          <p className="mt-2 text-gray-600">
            프로세서별로 노트북을 비교해보세요.
          </p>
        </div>

        {/* CPU by Brand */}
        {brandOrder.map((brand) => {
          const cpus = cpuByBrand[brand];
          if (!cpus || cpus.length === 0) return null;

          return (
            <section key={brand} className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">{brand}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cpus.map(({ series, count }) => {
                  const info = cpuSeriesInfo[series] || {
                    description: `${series} 프로세서`,
                  };
                  const slug = series.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <Link
                      key={series}
                      href={`/cpu/${slug}`}
                      className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {series}
                        </h3>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {count}개 모델
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{info.description}</p>
                      {info.generation && (
                        <p className="mt-1 text-xs text-gray-500">
                          {info.generation}년 출시
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
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
