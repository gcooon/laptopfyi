import type { Metadata } from "next";
import Link from "next/link";
import glossaryData from "@/../../data/glossary.json";

export const metadata: Metadata = {
  title: "노트북 용어사전",
  description:
    "CPU, RAM, SSD, GPU, OLED 등 노트북 관련 용어를 쉽게 설명합니다. 스펙 이해에 도움이 되는 용어 가이드.",
  alternates: {
    canonical: "/glossary",
  },
};

interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

const terms: GlossaryTerm[] = glossaryData;

export default function GlossaryPage() {
  // 카테고리별 그룹화
  const categories = terms.reduce(
    (acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = [];
      }
      acc[term.category].push(term);
      return acc;
    },
    {} as Record<string, GlossaryTerm[]>
  );

  const categoryOrder = [
    "하드웨어",
    "성능",
    "메모리",
    "저장장치",
    "디스플레이",
    "연결",
    "배터리",
    "쿨링",
    "입력장치",
    "보안",
    "확장성",
    "오디오",
    "인증",
    "카테고리",
    "디자인",
  ];

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
              <Link href="/glossary" className="font-medium text-blue-600">
                용어사전
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">노트북 용어사전</h1>
          <p className="mt-2 text-gray-600">
            노트북 스펙을 이해하는 데 필요한 {terms.length}개의 용어를 설명합니다.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categoryOrder.map((category) => {
            if (!categories[category]) return null;
            return (
              <a
                key={category}
                href={`#${category}`}
                className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-600"
              >
                {category}
              </a>
            );
          })}
        </div>

        {/* Terms by Category */}
        {categoryOrder.map((category) => {
          const categoryTerms = categories[category];
          if (!categoryTerms) return null;

          return (
            <section key={category} id={category} className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-gray-900">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryTerms.map((term) => (
                  <Link
                    key={term.id}
                    href={`/glossary/${term.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {term.term}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {term.definition}
                    </p>
                  </Link>
                ))}
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
