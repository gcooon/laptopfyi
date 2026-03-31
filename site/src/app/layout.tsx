import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LaptopFYI - 노트북 스펙 비교 & 중고 가격 가이드",
    template: "%s | LaptopFYI",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  description:
    "중고 노트북 스펙 비교, 가격 정보, 구매 가이드. 브랜드별, 용도별 최적의 노트북을 찾아보세요.",
  keywords: [
    "노트북",
    "중고 노트북",
    "리퍼 노트북",
    "노트북 비교",
    "노트북 스펙",
    "노트북 추천",
    "노트북 가격",
    "가성비 노트북",
    "대학생 노트북",
    "개발용 노트북",
    "영상편집 노트북",
    "게이밍 노트북",
    "삼성 노트북",
    "삼성 갤럭시북",
    "LG 그램",
    "그램 노트북",
    "맥북",
    "맥북 프로",
    "맥북 에어",
    "애플 노트북",
    "레노버",
    "씽크패드",
    "에이수스",
    "젠북",
    "델 노트북",
    "HP 노트북",
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
    title: "LaptopFYI - 노트북 스펙 비교 & 가이드",
    description:
      "중고 노트북 스펙 비교, 가격 정보, 구매 가이드. 브랜드별, 용도별 최적의 노트북을 찾아보세요.",
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
