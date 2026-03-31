import laptopsData from "@/../../data/laptops.json";
import type { Laptop } from "@/types/laptop";

const laptops: Laptop[] = laptopsData as Laptop[];

export function getAllLaptops(): Laptop[] {
  return laptops;
}

export function getLaptopBySlug(slug: string): Laptop | undefined {
  return laptops.find((laptop) => laptop.slug === slug);
}

export function getLaptopsByBrand(brand: string): Laptop[] {
  return laptops.filter(
    (laptop) => laptop.brand.toLowerCase() === brand.toLowerCase()
  );
}

export function getLaptopsByUseCase(useCase: string): Laptop[] {
  return laptops.filter((laptop) => laptop.useCases.includes(useCase));
}

export function getLaptopsByCategory(category: string): Laptop[] {
  return laptops.filter((laptop) => laptop.category === category);
}

export function getLaptopsByCpuBrand(cpuBrand: string): Laptop[] {
  return laptops.filter(
    (laptop) => laptop.cpuBrand.toLowerCase() === cpuBrand.toLowerCase()
  );
}

export function searchLaptops(query: string): Laptop[] {
  const lowerQuery = query.toLowerCase();
  return laptops.filter(
    (laptop) =>
      laptop.fullName.toLowerCase().includes(lowerQuery) ||
      laptop.brand.toLowerCase().includes(lowerQuery) ||
      laptop.model.toLowerCase().includes(lowerQuery) ||
      laptop.cpu.toLowerCase().includes(lowerQuery) ||
      laptop.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllBrands(): string[] {
  return [...new Set(laptops.map((laptop) => laptop.brand))];
}

export function getAllUseCases(): string[] {
  const useCases = laptops.flatMap((laptop) => laptop.useCases);
  return [...new Set(useCases)];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function generateComparisonSlug(slug1: string, slug2: string): string {
  // 알파벳 순으로 정렬하여 일관된 URL 생성
  const sorted = [slug1, slug2].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}
