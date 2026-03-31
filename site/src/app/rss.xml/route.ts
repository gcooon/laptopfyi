import { getAllLaptops } from "@/lib/laptops";

export async function GET() {
  const laptops = getAllLaptops();
  const baseUrl = "https://www.laptopfyi.com";

  // 최신 50개 노트북
  const recentLaptops = laptops.slice(0, 50);

  const rssItems = recentLaptops
    .map(
      (laptop) => `
    <item>
      <title>${escapeXml(laptop.fullName)}</title>
      <link>${baseUrl}/laptops/${laptop.slug}</link>
      <description>${escapeXml(laptop.metaDescription)}</description>
      <guid isPermaLink="true">${baseUrl}/laptops/${laptop.slug}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>${escapeXml(laptop.brand)}</category>
      <category>${escapeXml(laptop.category)}</category>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LaptopFYI - 노트북 스펙 비교</title>
    <link>${baseUrl}</link>
    <description>노트북 스펙, 가격, 성능 비교 정보를 제공하는 LaptopFYI의 최신 노트북 목록입니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icon.svg</url>
      <title>LaptopFYI</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
