export interface Laptop {
  // 기본 정보
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  year: number;

  // 가격 및 외부 링크
  priceKrw: number;
  refurlabUrl?: string;

  // CPU 및 메모리
  cpu: string;
  cpuSeries: string;
  cpuBrand: "Intel" | "AMD" | "Apple";
  ramGb: number;
  ramType?: string;

  // 저장소
  storageGb: number;
  storageType: "SSD" | "HDD" | "SSD+HDD";

  // 디스플레이
  displayInch: number;
  displayType: string;
  displayResolution: string;
  displayRefreshRate?: number;

  // 그래픽
  gpu: string;
  gpuType: "내장" | "외장";

  // 배터리 및 무게
  batteryWh?: number;
  weightKg: number;

  // OS
  os: string;

  // SEO 메타데이터
  metaTitle: string;
  metaDescription: string;

  // 분류
  useCases: string[];
  tags: string[];
  category: string;

  // 추가 정보
  releaseDate?: string;
  discontinued?: boolean;
  imageUrl?: string;
}

export interface LaptopComparison {
  laptop1: Laptop;
  laptop2: Laptop;
  slug: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  nameKo: string;
  description: string;
  logoUrl?: string;
  laptopCount: number;
}

export interface UseCase {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  laptopCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  laptopCount: number;
}

export interface CpuSeries {
  id: string;
  slug: string;
  name: string;
  brand: "Intel" | "AMD" | "Apple";
  generation?: string;
  laptopCount: number;
}

export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  definition: string;
  relatedTerms?: string[];
}
