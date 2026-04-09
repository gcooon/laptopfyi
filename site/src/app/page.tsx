import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import Header from "@/components/Header";

const faqItems = [
  {
    q: "중고 노트북 구매 시 확인해야 할 사항은?",
    a: "중고 노트북 구매 시 배터리 사이클, CPU 성능, RAM 용량, SSD 상태, 외관 스크래치 여부를 반드시 확인하세요. LaptopFYI에서 중고 노트북 시세와 스펙을 비교하면 합리적인 가격에 구매할 수 있습니다.",
  },
  {
    q: "대학생에게 추천하는 가성비 노트북은?",
    a: "대학생 노트북은 휴대성과 배터리 수명이 중요합니다. 50만원~100만원대의 LG 그램, 삼성 갤럭시북, 레노버 아이디어패드 등이 가성비 좋은 대학생 노트북으로 추천됩니다. 중고 맥북 에어도 좋은 선택입니다.",
  },
  {
    q: "게이밍 노트북과 사무용 노트북의 차이는?",
    a: "게이밍 노트북은 외장 GPU(RTX 시리즈)와 고주사율(144Hz) 디스플레이가 특징이며, 사무용 노트북은 가벼운 무게, 긴 배터리 수명, 안정성에 초점을 맞춥니다. 용도에 따라 노트북 스펙 비교 후 선택하세요.",
  },
  {
    q: "리퍼 노트북과 중고 노트북의 차이는?",
    a: "리퍼비시(리퍼) 노트북은 제조사나 공인 업체에서 점검·수리 후 재판매하는 제품으로, 일반 중고 노트북보다 품질 보증이 확실합니다. 리퍼 맥북, 리퍼 갤럭시북 등은 새 제품 대비 20~40% 저렴하게 구매 가능합니다.",
  },
  {
    q: "영상편집용 노트북 스펙은 어느 정도가 필요한가요?",
    a: "영상편집 노트북은 최소 16GB RAM, 외장 GPU, SSD 512GB 이상을 추천합니다. 4K 편집이 필요하다면 32GB RAM과 고성능 GPU(RTX 4060 이상)가 필요합니다. 맥북 프로 M3 Pro나 고사양 윈도우 노트북이 적합합니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero Section */}
      <main>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              나에게 맞는 노트북 찾기
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              스펙 비교부터 실사용 후기까지, 중고 노트북 구매에 필요한 모든
              정보를 제공합니다.
            </p>

            {/* Search Box */}
            <div className="mx-auto mt-8 max-w-xl">
              <SearchBox />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
              용도별 노트북 추천
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "학생용",
                  desc: "가성비 좋은 노트북",
                  icon: "📚",
                  href: "/use-case/student",
                },
                {
                  title: "개발자용",
                  desc: "고성능 개발 환경",
                  icon: "💻",
                  href: "/use-case/developer",
                },
                {
                  title: "영상편집용",
                  desc: "크리에이터를 위한",
                  icon: "🎬",
                  href: "/use-case/video-editing",
                },
                {
                  title: "사무용",
                  desc: "업무에 최적화된",
                  icon: "📊",
                  href: "/use-case/office",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-3 text-4xl">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
              브랜드별 노트북
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Apple",
                "Samsung",
                "LG",
                "Lenovo",
                "HP",
                "Dell",
                "ASUS",
                "Acer",
                "MSI",
              ].map((brand) => (
                <Link
                  key={brand}
                  href={`/brand/${brand.toLowerCase()}`}
                  className="rounded-full border border-gray-300 bg-white px-6 py-2 text-gray-700 transition hover:border-blue-400 hover:text-blue-600"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

        {/* Popular Keywords Section - SEO */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-6 text-center text-2xl font-bold text-gray-900">
              인기 노트북 검색
            </h3>
            <p className="mx-auto mb-8 max-w-3xl text-center text-gray-600">
              중고 노트북 가격 비교부터 리퍼 노트북 추천까지, 나에게 맞는 노트북을 찾아보세요.
              가성비 노트북, 게이밍 노트북, 사무용 노트북, 대학생 노트북 등 용도별 추천 정보를 제공합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "중고 노트북 추천", href: "/laptops" },
                { label: "가성비 노트북", href: "/use-case/student" },
                { label: "게이밍 노트북 추천", href: "/use-case/gaming" },
                { label: "사무용 노트북", href: "/use-case/office" },
                { label: "대학생 노트북 추천", href: "/use-case/student" },
                { label: "영상편집 노트북", href: "/use-case/video-editing" },
                { label: "개발용 노트북", href: "/use-case/developer" },
                { label: "맥북 프로 중고", href: "/brand/apple" },
                { label: "갤럭시북 중고 가격", href: "/brand/samsung" },
                { label: "LG 그램 중고", href: "/brand/lg" },
                { label: "노트북 스펙 비교", href: "/compare" },
                { label: "노트북 성능 순위", href: "/laptops" },
                { label: "리퍼 노트북", href: "/laptops" },
                { label: "코딩 노트북 추천", href: "/use-case/developer" },
                { label: "초경량 노트북", href: "/use-case/travel" },
                { label: "OLED 노트북", href: "/laptops" },
                { label: "노트북 용어 사전", href: "/glossary" },
                { label: "CPU별 노트북", href: "/cpu" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Rich Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
              노트북 구매 가이드 FAQ
            </h3>
            <div className="space-y-6">
              {faqItems.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:text-blue-600">
                    {faq.q}
                  </summary>
                  <p className="px-6 pb-4 text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Price Range Section - SEO */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-900">
              가격대별 노트북 추천
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  range: "30~50만원",
                  desc: "인강용·기본 사무용 중고 노트북",
                  href: "/laptops",
                },
                {
                  range: "50~100만원",
                  desc: "대학생·직장인 가성비 노트북",
                  href: "/laptops",
                },
                {
                  range: "100~150만원",
                  desc: "개발용·디자인 노트북",
                  href: "/laptops",
                },
                {
                  range: "150만원 이상",
                  desc: "게이밍·영상편집 고성능 노트북",
                  href: "/laptops",
                },
              ].map((item) => (
                <Link
                  key={item.range}
                  href={item.href}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-2 text-xl font-bold text-blue-600">
                    {item.range}
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-600">
              © 2024 LaptopFYI. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                소개
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/sitemap.xml"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
