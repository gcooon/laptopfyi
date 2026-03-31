import type { MetadataRoute } from "next";
import { getAllLaptops, getAllBrands, getAllUseCases } from "@/lib/laptops";
import glossaryData from "@/../../data/glossary.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://laptopfyi.com";
  const laptops = getAllLaptops();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/laptops`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brand`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/use-case`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cpu`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // 노트북 개별 페이지
  const laptopPages: MetadataRoute.Sitemap = laptops.map((laptop) => ({
    url: `${baseUrl}/laptops/${laptop.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 비교 페이지 (인기 조합만)
  const comparePages: MetadataRoute.Sitemap = [];
  const addedSlugs = new Set<string>();

  // 브랜드별 그룹
  const brandGroups: Record<string, typeof laptops> = {};
  laptops.forEach(l => {
    if (!brandGroups[l.brand]) brandGroups[l.brand] = [];
    brandGroups[l.brand].push(l);
  });

  // 1. 같은 브랜드 내 비교 (브랜드당 최대 20개)
  Object.values(brandGroups).forEach(brandLaptops => {
    let count = 0;
    for (let i = 0; i < brandLaptops.length && count < 20; i++) {
      for (let j = i + 1; j < brandLaptops.length && count < 20; j++) {
        const slugs = [brandLaptops[i].slug, brandLaptops[j].slug].sort();
        const slug = `${slugs[0]}-vs-${slugs[1]}`;
        if (!addedSlugs.has(slug)) {
          comparePages.push({
            url: `${baseUrl}/compare/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          });
          addedSlugs.add(slug);
          count++;
        }
      }
    }
  });

  // 2. 같은 카테고리 내 비교 (다른 브랜드 간)
  const categoryGroups: Record<string, typeof laptops> = {};
  laptops.forEach(l => {
    if (!categoryGroups[l.category]) categoryGroups[l.category] = [];
    categoryGroups[l.category].push(l);
  });

  Object.values(categoryGroups).forEach(catLaptops => {
    let count = 0;
    for (let i = 0; i < catLaptops.length && count < 15; i++) {
      for (let j = i + 1; j < catLaptops.length && count < 15; j++) {
        if (catLaptops[i].brand !== catLaptops[j].brand) {
          const slugs = [catLaptops[i].slug, catLaptops[j].slug].sort();
          const slug = `${slugs[0]}-vs-${slugs[1]}`;
          if (!addedSlugs.has(slug)) {
            comparePages.push({
              url: `${baseUrl}/compare/${slug}`,
              lastModified: new Date(),
              changeFrequency: "weekly" as const,
              priority: 0.6,
            });
            addedSlugs.add(slug);
            count++;
          }
        }
      }
    }
  });

  // 3. 인기 크로스 브랜드 비교
  const popularBrands = ['Apple', 'Samsung', 'LG', 'Lenovo', 'HP', 'Dell', 'ASUS'];
  popularBrands.forEach((brand1, i) => {
    popularBrands.slice(i + 1).forEach(brand2 => {
      const laptops1 = brandGroups[brand1]?.slice(0, 3) || [];
      const laptops2 = brandGroups[brand2]?.slice(0, 3) || [];
      laptops1.forEach(l1 => {
        laptops2.forEach(l2 => {
          const slugs = [l1.slug, l2.slug].sort();
          const slug = `${slugs[0]}-vs-${slugs[1]}`;
          if (!addedSlugs.has(slug)) {
            comparePages.push({
              url: `${baseUrl}/compare/${slug}`,
              lastModified: new Date(),
              changeFrequency: "weekly" as const,
              priority: 0.6,
            });
            addedSlugs.add(slug);
          }
        });
      });
    });
  });

  // 브랜드 페이지
  const brands = getAllBrands();
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/brand/${brand.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 용도별 페이지
  const useCases = getAllUseCases();
  const useCasePages: MetadataRoute.Sitemap = useCases.map((useCase) => ({
    url: `${baseUrl}/use-case/${useCase}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // CPU별 페이지
  const cpuSeries = [...new Set(laptops.map((l) => l.cpuSeries))];
  const cpuPages: MetadataRoute.Sitemap = cpuSeries.map((series) => ({
    url: `${baseUrl}/cpu/${series.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 용어사전 페이지
  const glossaryPages: MetadataRoute.Sitemap = glossaryData.map((term: { slug: string }) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...laptopPages,
    ...comparePages,
    ...brandPages,
    ...useCasePages,
    ...cpuPages,
    ...glossaryPages,
  ];
}
