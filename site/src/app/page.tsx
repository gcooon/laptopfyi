import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import { LogoText } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1>
              <LogoText />
            </h1>
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
              <Link href="/brand" className="text-gray-600 hover:text-gray-900">
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
