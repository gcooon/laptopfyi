import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllUseCases,
  getLaptopsByUseCase,
  formatPrice,
} from "@/lib/laptops";
import { generateItemListJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const useCaseInfo: Record<
  string,
  { name: string; description: string; icon: string; keywords: string[] }
> = {
  student: {
    name: "학생용 노트북",
    description:
      "가성비 좋고 휴대성이 뛰어난 학생용 노트북. 과제, 강의, 온라인 수업에 적합합니다.",
    icon: "📚",
    keywords: ["대학생 노트북", "학생 노트북 추천", "가성비 노트북", "과제용 노트북", "대학생 노트북 추천"],
  },
  developer: {
    name: "개발자용 노트북",
    description:
      "고성능 CPU와 넉넉한 RAM을 갖춘 개발자용 노트북. IDE, 컨테이너, 빌드 환경에 최적화.",
    icon: "💻",
    keywords: ["개발용 노트북", "프로그래밍 노트북", "코딩 노트북", "개발자 노트북 추천", "맥북 개발"],
  },
  "video-editing": {
    name: "영상편집용 노트북",
    description:
      "4K 영상 편집과 렌더링을 위한 고성능 노트북. 프리미어 프로, 다빈치 리졸브에 적합.",
    icon: "🎬",
    keywords: ["영상편집 노트북", "프리미어 프로 노트북", "유튜버 노트북", "영상 제작 노트북", "4K 편집 노트북"],
  },
  "graphic-design": {
    name: "디자인용 노트북",
    description:
      "정확한 색재현과 고해상도 디스플레이를 갖춘 디자이너용 노트북. 포토샵, 일러스트레이터에 최적.",
    icon: "🎨",
    keywords: ["디자인 노트북", "포토샵 노트북", "디자이너 노트북", "그래픽 작업 노트북", "OLED 노트북"],
  },
  office: {
    name: "사무용 노트북",
    description:
      "문서 작업, 화상회의, 이메일에 최적화된 비즈니스 노트북. 안정성과 보안성이 뛰어납니다.",
    icon: "📊",
    keywords: ["사무용 노트북", "비즈니스 노트북", "회사 노트북", "업무용 노트북", "오피스 노트북"],
  },
  gaming: {
    name: "게임용 노트북",
    description:
      "외장 GPU와 고주사율 디스플레이를 갖춘 게이밍 노트북. AAA 게임도 쾌적하게.",
    icon: "🎮",
    keywords: ["게이밍 노트북", "게임용 노트북", "고사양 노트북", "RTX 노트북", "게임 노트북 추천"],
  },
  travel: {
    name: "휴대용 노트북",
    description:
      "1.5kg 미만의 초경량 노트북. 출장, 여행, 이동이 잦은 분들에게 최적의 휴대성.",
    icon: "✈️",
    keywords: ["가벼운 노트북", "경량 노트북", "휴대용 노트북", "출장용 노트북", "초경량 노트북"],
  },
  "content-creation": {
    name: "콘텐츠 제작용 노트북",
    description:
      "유튜브, 인스타그램 등 콘텐츠 크리에이터를 위한 노트북. 영상, 사진 편집에 최적화.",
    icon: "📷",
    keywords: ["크리에이터 노트북", "유튜버 노트북", "콘텐츠 제작 노트북", "인플루언서 노트북"],
  },
  "3d-modeling": {
    name: "3D 모델링용 노트북",
    description:
      "블렌더, 마야, 3ds Max 등 3D 작업을 위한 고성능 노트북. 강력한 GPU와 대용량 RAM.",
    icon: "🎯",
    keywords: ["3D 노트북", "블렌더 노트북", "렌더링 노트북", "CAD 노트북", "3D 모델링 노트북"],
  },
  "data-science": {
    name: "데이터 사이언스용 노트북",
    description:
      "머신러닝, 딥러닝, 데이터 분석을 위한 노트북. 파이썬, 주피터 노트북 환경에 최적화.",
    icon: "📈",
    keywords: ["데이터 분석 노트북", "머신러닝 노트북", "AI 노트북", "파이썬 노트북", "딥러닝 노트북"],
  },
};

export async function generateStaticParams() {
  const useCases = getAllUseCases();
  return useCases.map((useCase) => ({
    slug: useCase,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const info = useCaseInfo[slug];

  if (!info) {
    return {
      title: "용도를 찾을 수 없습니다",
    };
  }

  return {
    title: `${info.name} 추천 TOP 10 - 2024년 가성비 순위`,
    description: `${info.description} ${info.keywords.slice(0, 2).join(", ")} 추천 순위를 확인하세요.`,
    keywords: [...info.keywords, "노트북 추천", "노트북 비교", "중고 노트북"],
    alternates: {
      canonical: `/use-case/${slug}`,
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const laptops = getLaptopsByUseCase(slug);
  const info = useCaseInfo[slug];

  if (!info || laptops.length === 0) {
    notFound();
  }

  const itemListJsonLd = generateItemListJsonLd(
    info.name,
    info.description,
    laptops
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", url: "https://laptopfyi.com" },
    { name: "용도별", url: "https://laptopfyi.com/use-case" },
    { name: info.name, url: `https://laptopfyi.com/use-case/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header activeNav="use-case" />

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
              <Link href="/use-case" className="hover:text-blue-600">
                용도별
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{info.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="mb-4 inline-block text-5xl">{info.icon}</span>
              <h1 className="text-3xl font-bold text-gray-900">{info.name}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                {info.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              추천 노트북 {laptops.length}선
            </h2>
          </div>

          {/* Laptop List */}
          <div className="space-y-4">
            {laptops.map((laptop, index) => (
              <Link
                key={laptop.id}
                href={`/laptops/${laptop.slug}`}
                className="group flex items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                {/* Rank */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  {index + 1}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {laptop.brand}
                    </span>
                    <span className="text-xs text-gray-500">{laptop.year}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {laptop.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {laptop.cpu} · {laptop.ramGb}GB RAM · {laptop.displayInch}"
                    {laptop.displayType}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-sm text-gray-500">중고가</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(laptop.priceKrw)}
                  </p>
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
