import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import glossaryData from "@/../../data/glossary.json";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const terms: GlossaryTerm[] = glossaryData;

function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return terms.find((t) => t.slug === slug);
}

export async function generateStaticParams() {
  return terms.map((term) => ({
    slug: term.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    return { title: "용어를 찾을 수 없습니다" };
  }

  return {
    title: `${term.term} 뜻 - 노트북 용어 설명`,
    description: term.definition,
    alternates: {
      canonical: `/glossary/${slug}`,
    },
  };
}

export default async function GlossaryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "용어사전", url: "https://laptopfyi.com/glossary" },
    { name: term.term, url: `https://laptopfyi.com/glossary/${slug}` },
  ]);

  // 관련 용어 찾기
  const relatedTerms = term.relatedTerms
    ?.map((rt) => terms.find((t) => t.term === rt || t.slug === rt.toLowerCase().replace(/\s+/g, "-")))
    .filter(Boolean) as GlossaryTerm[] | undefined;

  // 같은 카테고리의 다른 용어
  const sameCategoryTerms = terms
    .filter((t) => t.category === term.category && t.id !== term.id)
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Laptop<span className="text-blue-600">FYI</span>
            </Link>
          </div>
        </header>

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
              <Link href="/glossary" className="hover:text-blue-600">
                용어사전
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{term.term}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <article className="rounded-xl bg-white p-8 shadow-sm">
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {term.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{term.term}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              {term.definition}
            </p>

            {/* Related Terms Tags */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">
                  관련 용어
                </h2>
                <div className="flex flex-wrap gap-2">
                  {term.relatedTerms.map((rt) => {
                    const relatedTerm = terms.find(
                      (t) =>
                        t.term === rt ||
                        t.slug === rt.toLowerCase().replace(/\s+/g, "-")
                    );
                    if (relatedTerm) {
                      return (
                        <Link
                          key={rt}
                          href={`/glossary/${relatedTerm.slug}`}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                        >
                          {relatedTerm.term}
                        </Link>
                      );
                    }
                    return (
                      <span
                        key={rt}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500"
                      >
                        {rt}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* Same Category Terms */}
          {sameCategoryTerms.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {term.category} 관련 용어
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sameCategoryTerms.map((t) => (
                  <Link
                    key={t.id}
                    href={`/glossary/${t.slug}`}
                    className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {t.term}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {t.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
