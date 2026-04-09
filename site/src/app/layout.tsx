import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LaptopFYI - 중고 노트북 가격 비교 · 스펙 비교 · 노트북 추천 가이드",
    template: "%s | LaptopFYI",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  description:
    "중고 노트북 가격 비교, 리퍼 노트북 추천, 노트북 스펙 비교 사이트. 맥북, 갤럭시북, LG 그램, 씽크패드 등 브랜드별 중고 시세와 용도별 노트북 추천 가이드를 제공합니다. 가성비 노트북부터 게이밍 노트북까지 한눈에 비교하세요.",
  keywords: [
    // 핵심 키워드 (월간 검색량 10만+)
    "노트북",
    "노트북 추천",
    "가성비 노트북",
    "게이밍 노트북",
    "중고 노트북",
    "중고노트북",
    "사무용 노트북",
    "노트북 가격",
    "맥북",
    "노트북 비교",
    // 브랜드 키워드 (월간 검색량 1만~10만)
    "맥북 프로",
    "맥북 에어",
    "삼성 노트북",
    "갤럭시북",
    "갤럭시북 프로",
    "갤럭시북4",
    "갤럭시북4 프로",
    "LG 그램",
    "그램 노트북",
    "그램 프로",
    "레노버 노트북",
    "씽크패드",
    "아이디어패드",
    "HP 노트북",
    "델 노트북",
    "에이수스 노트북",
    "젠북",
    "MSI 노트북",
    "에이서 노트북",
    "서피스",
    // 용도별 키워드 (월간 검색량 5천~5만)
    "대학생 노트북",
    "대학생 노트북 추천",
    "학생용 노트북",
    "개발용 노트북",
    "코딩 노트북",
    "프로그래밍 노트북",
    "영상편집 노트북",
    "영상편집용 노트북",
    "유튜버 노트북",
    "디자인 노트북",
    "사무용 노트북 추천",
    "게이밍 노트북 추천",
    "출장용 노트북",
    "업무용 노트북",
    "인강용 노트북",
    "온라인 수업 노트북",
    "재택근무 노트북",
    // 가격대별 키워드 (월간 검색량 3천~3만)
    "가성비 노트북 추천",
    "50만원대 노트북",
    "100만원대 노트북",
    "30만원대 노트북",
    "저렴한 노트북",
    "노트북 할인",
    "노트북 특가",
    "200만원대 노트북",
    "가성비 게이밍 노트북",
    // 스펙 키워드 (월간 검색량 3천~2만)
    "노트북 스펙 비교",
    "노트북 성능 비교",
    "노트북 CPU 비교",
    "OLED 노트북",
    "144Hz 노트북",
    "16인치 노트북",
    "14인치 노트북",
    "15인치 노트북",
    "17인치 노트북",
    "가벼운 노트북",
    "초경량 노트북",
    "노트북 무게 비교",
    "SSD 노트북",
    "16GB RAM 노트북",
    "32GB RAM 노트북",
    "터치스크린 노트북",
    "2in1 노트북",
    // 중고·리퍼 키워드 (월간 검색량 2천~2만)
    "리퍼 노트북",
    "리퍼비시 노트북",
    "중고 맥북",
    "중고 맥북 프로",
    "중고 맥북 에어",
    "중고 삼성 노트북",
    "중고 LG 그램",
    "중고 노트북 가격",
    "중고 노트북 추천",
    "중고 노트북 시세",
    "중고 노트북 구매 가이드",
    "리퍼 맥북",
    "중고 게이밍 노트북",
    // 비교 키워드 (월간 검색량 2천~1만)
    "맥북 vs 그램",
    "갤럭시북 vs 그램",
    "맥북 에어 vs 프로",
    "노트북 순위",
    "노트북 랭킹",
    // CPU·성능 키워드 (월간 검색량 2천~1만)
    "인텔 코어 울트라",
    "AMD 라이젠 노트북",
    "애플 M3",
    "인텔 i7 노트북",
    "인텔 i5 노트북",
    "M3 맥북",
    "M3 Pro 맥북",
    // 구매 가이드 키워드 (월간 검색량 2천~1만)
    "노트북 구매 가이드",
    "노트북 고르는 법",
    "노트북 추천 2025",
    "노트북 추천 2026",
    "노트북 살 때 주의사항",
    "노트북 브랜드 순위",
    // 기타 인기 키워드 (월간 검색량 1천~5천)
    "노트북 배터리 수명",
    "윈도우 노트북",
    "ROG 노트북",
    "애플 노트북",
    "노트북 스펙",
    "노트북 용어",
  ],
  authors: [{ name: "LaptopFYI" }],
  creator: "LaptopFYI",
  publisher: "LaptopFYI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://laptopfyi.com"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://www.laptopfyi.com/rss.xml",
    },
  },
  openGraph: {
    title: "LaptopFYI - 중고 노트북 가격 비교 & 스펙 추천 가이드",
    description:
      "중고 노트북 가격 비교, 리퍼 노트북 추천, 노트북 스펙 비교 사이트. 맥북, 갤럭시북, LG 그램, 씽크패드 등 브랜드별 중고 시세와 용도별 노트북 추천 가이드를 제공합니다.",
    url: "https://laptopfyi.com",
    siteName: "LaptopFYI",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
