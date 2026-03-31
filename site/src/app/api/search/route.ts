import { NextRequest, NextResponse } from "next/server";
import { searchLaptops } from "@/lib/laptops";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 1) {
    return NextResponse.json({ results: [], query: "" });
  }

  const results = searchLaptops(query.trim());

  // 검색 결과를 간소화하여 반환
  const simplifiedResults = results.map((laptop) => ({
    id: laptop.id,
    slug: laptop.slug,
    brand: laptop.brand,
    model: laptop.model,
    fullName: laptop.fullName,
    priceKrw: laptop.priceKrw,
    cpu: laptop.cpu,
    ramGb: laptop.ramGb,
    displayInch: laptop.displayInch,
    displayType: laptop.displayType,
    category: laptop.category,
  }));

  return NextResponse.json({
    results: simplifiedResults,
    query: query.trim(),
    total: results.length,
  });
}
