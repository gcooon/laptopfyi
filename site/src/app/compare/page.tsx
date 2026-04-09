import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops } from "@/lib/laptops";
import CompareSelector from "@/components/CompareSelector";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "노트북 스펙 비교 - 맥북 vs 그램, 갤럭시북 vs 씽크패드 등",
  description:
    "맥북 vs 그램, 갤럭시북 vs 그램, 맥북 에어 vs 프로 등 인기 노트북 스펙을 나란히 비교하세요. CPU 성능, RAM, SSD, 디스플레이, 중고 가격까지 한눈에 비교. 노트북 고르는 법의 핵심은 스펙 비교입니다.",
  keywords: [
    "노트북 비교", "노트북 스펙 비교", "노트북 성능 비교", "맥북 vs 그램",
    "갤럭시북 vs 그램", "맥북 에어 vs 프로", "노트북 CPU 비교",
    "노트북 고르는 법", "노트북 순위",
  ],
  alternates: {
    canonical: "/compare",
  },
};

export default function ComparePage() {
  const laptops = getAllLaptops();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeNav="compare" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">노트북 비교하기</h1>
          <p className="mt-2 text-gray-600">
            두 노트북을 선택하여 스펙을 비교해보세요.
          </p>
        </div>

        {/* Compare Selector */}
        <CompareSelector laptops={laptops} />

        {/* Popular Comparisons */}
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            인기 비교 조합
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "맥북 프로 14 vs 맥북 에어 15",
                slug: "macbook-air-15-m3-2024-vs-macbook-pro-14-m3-pro-2023",
                desc: "M3 칩 맥북 라인업 비교",
              },
              {
                title: "LG 그램 17 vs 삼성 갤럭시북4 프로",
                slug: "lg-gram-17-2024-vs-samsung-galaxy-book4-pro-16",
                desc: "국산 프리미엄 노트북 대결",
              },
              {
                title: "Dell XPS 15 vs ASUS 젠북 14 OLED",
                slug: "asus-zenbook-14-oled-ux3405-vs-dell-xps-15-9530",
                desc: "OLED 디스플레이 노트북 비교",
              },
              {
                title: "씽크패드 X1 카본 vs HP 파빌리온 15",
                slug: "hp-pavilion-15-eg3000-vs-lenovo-thinkpad-x1-carbon-gen11",
                desc: "비즈니스 vs 가성비",
              },
              {
                title: "Acer 스위프트 고 14 vs MSI 프레스티지 16",
                slug: "acer-swift-go-14-sfg14-71-vs-msi-prestige-16-ai-evo",
                desc: "가성비 OLED vs 프리미엄 크리에이터",
              },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
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
