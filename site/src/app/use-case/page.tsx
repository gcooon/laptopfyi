import type { Metadata } from "next";
import Link from "next/link";
import { getAllLaptops } from "@/lib/laptops";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "용도별 노트북 추천",
  description:
    "학생용, 개발자용, 영상편집용, 사무용, 게임용 등 용도에 맞는 최적의 노트북을 찾아보세요.",
  alternates: {
    canonical: "/use-case",
  },
};

const useCaseInfo: Record<
  string,
  { name: string; description: string; icon: string; keywords: string[] }
> = {
  student: {
    name: "학생용 노트북",
    description:
      "가성비 좋고 휴대성이 뛰어난 학생용 노트북. 과제, 강의, 온라인 수업에 적합합니다.",
    icon: "📚",
    keywords: ["가성비", "휴대성", "배터리", "가벼운"],
  },
  developer: {
    name: "개발자용 노트북",
    description:
      "고성능 CPU와 넉넉한 RAM을 갖춘 개발자용 노트북. IDE, 컨테이너, 빌드 환경에 최적화.",
    icon: "💻",
    keywords: ["고성능", "멀티태스킹", "16GB+", "SSD"],
  },
  "video-editing": {
    name: "영상편집용 노트북",
    description:
      "4K 영상 편집과 렌더링을 위한 고성능 노트북. 프리미어 프로, 다빈치 리졸브에 적합.",
    icon: "🎬",
    keywords: ["고성능 GPU", "4K", "32GB RAM", "색재현"],
  },
  "graphic-design": {
    name: "그래픽 디자인용 노트북",
    description:
      "정확한 색재현과 고해상도 디스플레이를 갖춘 디자이너용 노트북. 포토샵, 일러스트레이터에 최적.",
    icon: "🎨",
    keywords: ["색재현", "고해상도", "펜 지원", "P3"],
  },
  office: {
    name: "사무용 노트북",
    description:
      "문서 작업, 화상회의, 이메일에 최적화된 비즈니스 노트북. 안정성과 보안성이 뛰어납니다.",
    icon: "📊",
    keywords: ["비즈니스", "안정성", "보안", "경량"],
  },
  gaming: {
    name: "게임용 노트북",
    description:
      "외장 GPU와 고주사율 디스플레이를 갖춘 게이밍 노트북. AAA 게임도 쾌적하게.",
    icon: "🎮",
    keywords: ["외장 GPU", "144Hz", "고성능", "쿨링"],
  },
  "content-creation": {
    name: "콘텐츠 크리에이터용",
    description:
      "유튜브, 스트리밍, 팟캐스트 제작을 위한 올라운드 노트북. 다양한 작업을 한 대로.",
    icon: "📹",
    keywords: ["올라운드", "스트리밍", "고성능", "웹캠"],
  },
  "data-science": {
    name: "데이터 사이언스용",
    description:
      "머신러닝, 데이터 분석을 위한 고성능 노트북. 대용량 RAM과 빠른 연산 능력.",
    icon: "📈",
    keywords: ["머신러닝", "대용량 RAM", "GPU 연산", "Python"],
  },
  "3d-modeling": {
    name: "3D 모델링용",
    description:
      "블렌더, Maya, 3ds Max 등 3D 작업을 위한 워크스테이션급 노트북.",
    icon: "🎭",
    keywords: ["3D", "렌더링", "워크스테이션", "Quadro"],
  },
  travel: {
    name: "여행/출장용 노트북",
    description:
      "가볍고 배터리가 오래가는 휴대용 노트북. 어디서든 업무 가능.",
    icon: "✈️",
    keywords: ["초경량", "긴 배터리", "휴대성", "LTE"],
  },
};

export default function UseCaseListPage() {
  const laptops = getAllLaptops();

  // 용도별 노트북 수 계산
  const useCaseCounts: Record<string, number> = {};
  laptops.forEach((laptop) => {
    laptop.useCases.forEach((useCase) => {
      useCaseCounts[useCase] = (useCaseCounts[useCase] || 0) + 1;
    });
  });

  // 정의된 모든 용도 표시 (노트북이 없어도)
  const allUseCases = Object.entries(useCaseInfo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header activeNav="use-case" />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">용도별 노트북 추천</h1>
          <p className="mt-2 text-gray-600">
            나에게 맞는 용도의 노트북을 찾아보세요.
          </p>
        </div>

        {/* Use Case Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allUseCases.map(([slug, info]) => {
            const count = useCaseCounts[slug] || 0;
            return (
              <Link
                key={slug}
                href={`/use-case/${slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-4xl">{info.icon}</span>
                  {count > 0 && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {count}개 추천
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                  {info.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{info.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {info.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
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
