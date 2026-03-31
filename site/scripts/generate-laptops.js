// 노트북 데이터 생성 스크립트 - 다나와 기준 중고가격 반영
const fs = require('fs');

const laptops = [];
let id = 1;

// 중고가격 계산 함수 (다나와/중고나라 기준)
// 신품가 대비 연식별 감가율
function calculateUsedPrice(newPrice, year) {
  const currentYear = 2024;
  const age = currentYear - year;

  // 연식별 잔존가치율 (다나와 중고 시세 기준)
  const retentionRates = {
    0: 0.85,  // 2024년 (신품 대비 85%)
    1: 0.65,  // 2023년 (신품 대비 65%)
    2: 0.50,  // 2022년 (신품 대비 50%)
    3: 0.40,  // 2021년 (신품 대비 40%)
    4: 0.32,  // 2020년 (신품 대비 32%)
    5: 0.25,  // 2019년 이전
  };

  const rate = retentionRates[Math.min(age, 5)] || 0.25;
  const usedPrice = Math.round(newPrice * rate / 10000) * 10000; // 만원 단위 반올림

  return Math.max(usedPrice, 300000); // 최소 30만원
}

// 브랜드별 모델 템플릿 - 다나와 신품가 기준
const brands = {
  Apple: {
    series: [
      // MacBook Pro 16
      { name: 'MacBook Pro 16', years: [2021, 2022, 2023, 2024], configs: [
        { chip: 'M1 Pro', ram: 16, storage: 512, newPrice: 3490000 },
        { chip: 'M1 Pro', ram: 16, storage: 1000, newPrice: 3890000 },
        { chip: 'M1 Pro', ram: 32, storage: 512, newPrice: 3890000 },
        { chip: 'M1 Max', ram: 32, storage: 1000, newPrice: 4490000 },
        { chip: 'M1 Max', ram: 64, storage: 1000, newPrice: 5090000 },
        { chip: 'M2 Pro', ram: 16, storage: 512, newPrice: 3490000 },
        { chip: 'M2 Pro', ram: 16, storage: 1000, newPrice: 3890000 },
        { chip: 'M2 Pro', ram: 32, storage: 512, newPrice: 3890000 },
        { chip: 'M2 Max', ram: 32, storage: 1000, newPrice: 4690000 },
        { chip: 'M2 Max', ram: 64, storage: 1000, newPrice: 5290000 },
        { chip: 'M2 Max', ram: 96, storage: 2000, newPrice: 6890000 },
        { chip: 'M3 Pro', ram: 18, storage: 512, newPrice: 3490000 },
        { chip: 'M3 Pro', ram: 18, storage: 1000, newPrice: 3890000 },
        { chip: 'M3 Pro', ram: 36, storage: 512, newPrice: 4090000 },
        { chip: 'M3 Max', ram: 36, storage: 1000, newPrice: 4990000 },
        { chip: 'M3 Max', ram: 48, storage: 1000, newPrice: 5490000 },
        { chip: 'M3 Max', ram: 128, storage: 2000, newPrice: 8990000 },
        { chip: 'M4 Pro', ram: 24, storage: 512, newPrice: 3690000 },
        { chip: 'M4 Pro', ram: 24, storage: 1000, newPrice: 4090000 },
        { chip: 'M4 Pro', ram: 48, storage: 512, newPrice: 4490000 },
        { chip: 'M4 Max', ram: 36, storage: 1000, newPrice: 5290000 },
        { chip: 'M4 Max', ram: 48, storage: 1000, newPrice: 5790000 },
        { chip: 'M4 Max', ram: 128, storage: 2000, newPrice: 9490000 },
      ], category: '프리미엄', useCases: ['developer', 'video-editing', '3d-modeling'], displayInch: 16.2, displayType: 'Liquid Retina XDR', resolution: '3456x2234', refresh: 120, weight: 2.14, battery: 100 },

      // MacBook Pro 14
      { name: 'MacBook Pro 14', years: [2021, 2022, 2023, 2024], configs: [
        { chip: 'M1 Pro', ram: 16, storage: 512, newPrice: 2690000 },
        { chip: 'M1 Pro', ram: 16, storage: 1000, newPrice: 3090000 },
        { chip: 'M1 Pro', ram: 32, storage: 512, newPrice: 3090000 },
        { chip: 'M1 Max', ram: 32, storage: 1000, newPrice: 3890000 },
        { chip: 'M1 Max', ram: 64, storage: 1000, newPrice: 4490000 },
        { chip: 'M2 Pro', ram: 16, storage: 512, newPrice: 2690000 },
        { chip: 'M2 Pro', ram: 16, storage: 1000, newPrice: 3090000 },
        { chip: 'M2 Pro', ram: 32, storage: 512, newPrice: 3090000 },
        { chip: 'M2 Max', ram: 32, storage: 1000, newPrice: 4090000 },
        { chip: 'M2 Max', ram: 64, storage: 1000, newPrice: 4690000 },
        { chip: 'M2 Max', ram: 96, storage: 2000, newPrice: 6290000 },
        { chip: 'M3', ram: 8, storage: 512, newPrice: 2390000 },
        { chip: 'M3', ram: 16, storage: 512, newPrice: 2590000 },
        { chip: 'M3', ram: 16, storage: 1000, newPrice: 2990000 },
        { chip: 'M3 Pro', ram: 18, storage: 512, newPrice: 2990000 },
        { chip: 'M3 Pro', ram: 18, storage: 1000, newPrice: 3390000 },
        { chip: 'M3 Pro', ram: 36, storage: 512, newPrice: 3590000 },
        { chip: 'M3 Max', ram: 36, storage: 1000, newPrice: 4490000 },
        { chip: 'M3 Max', ram: 48, storage: 1000, newPrice: 4990000 },
        { chip: 'M3 Max', ram: 128, storage: 2000, newPrice: 8490000 },
        { chip: 'M4', ram: 16, storage: 512, newPrice: 2390000 },
        { chip: 'M4', ram: 16, storage: 1000, newPrice: 2790000 },
        { chip: 'M4', ram: 24, storage: 512, newPrice: 2590000 },
        { chip: 'M4 Pro', ram: 24, storage: 512, newPrice: 3190000 },
        { chip: 'M4 Pro', ram: 24, storage: 1000, newPrice: 3590000 },
        { chip: 'M4 Pro', ram: 48, storage: 512, newPrice: 3990000 },
        { chip: 'M4 Max', ram: 36, storage: 1000, newPrice: 4790000 },
        { chip: 'M4 Max', ram: 48, storage: 1000, newPrice: 5290000 },
        { chip: 'M4 Max', ram: 128, storage: 2000, newPrice: 8990000 },
      ], category: '프리미엄', useCases: ['developer', 'video-editing', 'graphic-design'], displayInch: 14.2, displayType: 'Liquid Retina XDR', resolution: '3024x1964', refresh: 120, weight: 1.55, battery: 70 },

      // MacBook Air 15
      { name: 'MacBook Air 15', years: [2023, 2024], configs: [
        { chip: 'M2', ram: 8, storage: 256, newPrice: 1690000 },
        { chip: 'M2', ram: 8, storage: 512, newPrice: 1890000 },
        { chip: 'M2', ram: 16, storage: 256, newPrice: 1890000 },
        { chip: 'M2', ram: 16, storage: 512, newPrice: 2090000 },
        { chip: 'M2', ram: 16, storage: 1000, newPrice: 2490000 },
        { chip: 'M2', ram: 24, storage: 512, newPrice: 2290000 },
        { chip: 'M2', ram: 24, storage: 1000, newPrice: 2690000 },
        { chip: 'M3', ram: 8, storage: 256, newPrice: 1790000 },
        { chip: 'M3', ram: 8, storage: 512, newPrice: 1990000 },
        { chip: 'M3', ram: 16, storage: 256, newPrice: 1990000 },
        { chip: 'M3', ram: 16, storage: 512, newPrice: 2190000 },
        { chip: 'M3', ram: 16, storage: 1000, newPrice: 2590000 },
        { chip: 'M3', ram: 24, storage: 512, newPrice: 2390000 },
        { chip: 'M3', ram: 24, storage: 1000, newPrice: 2790000 },
        { chip: 'M4', ram: 16, storage: 256, newPrice: 1790000 },
        { chip: 'M4', ram: 16, storage: 512, newPrice: 1990000 },
        { chip: 'M4', ram: 16, storage: 1000, newPrice: 2390000 },
        { chip: 'M4', ram: 24, storage: 512, newPrice: 2190000 },
        { chip: 'M4', ram: 24, storage: 1000, newPrice: 2590000 },
        { chip: 'M4', ram: 32, storage: 1000, newPrice: 2990000 },
      ], category: '프리미엄', useCases: ['student', 'office', 'developer'], displayInch: 15.3, displayType: 'Liquid Retina', resolution: '2880x1864', refresh: 60, weight: 1.51, battery: 66 },

      // MacBook Air 13
      { name: 'MacBook Air 13', years: [2020, 2021, 2022, 2023, 2024], configs: [
        { chip: 'M1', ram: 8, storage: 256, newPrice: 1290000 },
        { chip: 'M1', ram: 8, storage: 512, newPrice: 1490000 },
        { chip: 'M1', ram: 8, storage: 1000, newPrice: 1890000 },
        { chip: 'M1', ram: 16, storage: 256, newPrice: 1490000 },
        { chip: 'M1', ram: 16, storage: 512, newPrice: 1690000 },
        { chip: 'M1', ram: 16, storage: 1000, newPrice: 2090000 },
        { chip: 'M1', ram: 16, storage: 2000, newPrice: 2490000 },
        { chip: 'M2', ram: 8, storage: 256, newPrice: 1390000 },
        { chip: 'M2', ram: 8, storage: 512, newPrice: 1590000 },
        { chip: 'M2', ram: 8, storage: 1000, newPrice: 1990000 },
        { chip: 'M2', ram: 16, storage: 256, newPrice: 1590000 },
        { chip: 'M2', ram: 16, storage: 512, newPrice: 1790000 },
        { chip: 'M2', ram: 16, storage: 1000, newPrice: 2190000 },
        { chip: 'M2', ram: 16, storage: 2000, newPrice: 2590000 },
        { chip: 'M2', ram: 24, storage: 512, newPrice: 1990000 },
        { chip: 'M2', ram: 24, storage: 1000, newPrice: 2390000 },
        { chip: 'M2', ram: 24, storage: 2000, newPrice: 2790000 },
        { chip: 'M3', ram: 8, storage: 256, newPrice: 1390000 },
        { chip: 'M3', ram: 8, storage: 512, newPrice: 1590000 },
        { chip: 'M3', ram: 8, storage: 1000, newPrice: 1990000 },
        { chip: 'M3', ram: 16, storage: 256, newPrice: 1590000 },
        { chip: 'M3', ram: 16, storage: 512, newPrice: 1790000 },
        { chip: 'M3', ram: 16, storage: 1000, newPrice: 2190000 },
        { chip: 'M3', ram: 16, storage: 2000, newPrice: 2590000 },
        { chip: 'M3', ram: 24, storage: 512, newPrice: 1990000 },
        { chip: 'M3', ram: 24, storage: 1000, newPrice: 2390000 },
        { chip: 'M3', ram: 24, storage: 2000, newPrice: 2790000 },
        { chip: 'M4', ram: 16, storage: 256, newPrice: 1390000 },
        { chip: 'M4', ram: 16, storage: 512, newPrice: 1590000 },
        { chip: 'M4', ram: 16, storage: 1000, newPrice: 1990000 },
        { chip: 'M4', ram: 16, storage: 2000, newPrice: 2390000 },
        { chip: 'M4', ram: 24, storage: 512, newPrice: 1790000 },
        { chip: 'M4', ram: 24, storage: 1000, newPrice: 2190000 },
        { chip: 'M4', ram: 24, storage: 2000, newPrice: 2590000 },
        { chip: 'M4', ram: 32, storage: 1000, newPrice: 2590000 },
        { chip: 'M4', ram: 32, storage: 2000, newPrice: 2990000 },
      ], category: '프리미엄', useCases: ['student', 'office', 'travel'], displayInch: 13.6, displayType: 'Liquid Retina', resolution: '2560x1664', refresh: 60, weight: 1.24, battery: 52 },

      // MacBook Pro 13 (Intel - 구형)
      { name: 'MacBook Pro 13', years: [2020], configs: [
        { chip: 'M1', ram: 8, storage: 256, newPrice: 1690000 },
        { chip: 'M1', ram: 8, storage: 512, newPrice: 1890000 },
        { chip: 'M1', ram: 8, storage: 1000, newPrice: 2290000 },
        { chip: 'M1', ram: 16, storage: 256, newPrice: 1890000 },
        { chip: 'M1', ram: 16, storage: 512, newPrice: 2090000 },
        { chip: 'M1', ram: 16, storage: 1000, newPrice: 2490000 },
        { chip: 'M1', ram: 16, storage: 2000, newPrice: 2890000 },
      ], category: '프리미엄', useCases: ['developer', 'student', 'office'], displayInch: 13.3, displayType: 'Retina', resolution: '2560x1600', refresh: 60, weight: 1.4, battery: 58 },

      // MacBook Air M2 (2022 model specific)
      { name: 'MacBook Air M2', years: [2022], configs: [
        { chip: 'M2', ram: 8, storage: 256, newPrice: 1590000 },
        { chip: 'M2', ram: 8, storage: 512, newPrice: 1790000 },
        { chip: 'M2', ram: 8, storage: 1000, newPrice: 2190000 },
        { chip: 'M2', ram: 16, storage: 256, newPrice: 1790000 },
        { chip: 'M2', ram: 16, storage: 512, newPrice: 1990000 },
        { chip: 'M2', ram: 16, storage: 1000, newPrice: 2390000 },
        { chip: 'M2', ram: 16, storage: 2000, newPrice: 2790000 },
        { chip: 'M2', ram: 24, storage: 512, newPrice: 2190000 },
        { chip: 'M2', ram: 24, storage: 1000, newPrice: 2590000 },
        { chip: 'M2', ram: 24, storage: 2000, newPrice: 2990000 },
      ], category: '프리미엄', useCases: ['student', 'office', 'travel'], displayInch: 13.6, displayType: 'Liquid Retina', resolution: '2560x1664', refresh: 60, weight: 1.24, battery: 52 },
    ],
    cpuBrand: 'Apple',
    ramType: '통합 메모리',
    os: 'macOS',
    gpuType: '내장',
    tags: ['맥북', '애플', 'MacBook']
  },

  Samsung: {
    series: [
      // Galaxy Book4 Ultra
      { name: 'Galaxy Book4 Ultra', years: [2024], configs: [
        { cpu: 'i9', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3990000 },
        { cpu: 'i9', gpu: 'RTX4070', ram: 64, storage: 1000, newPrice: 4390000 },
        { cpu: 'i9', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3590000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3590000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3190000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2790000 },
      ], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.87, battery: 76 },

      // Galaxy Book4 Pro 16
      { name: 'Galaxy Book4 Pro 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2590000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
      ], category: '프리미엄', useCases: ['office', 'video-editing', 'developer'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.56, battery: 76 },

      // Galaxy Book4 Pro 14
      { name: 'Galaxy Book4 Pro 14', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.23, battery: 63 },

      // Galaxy Book4 360
      { name: 'Galaxy Book4 360', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.46, battery: 68 },

      // Galaxy Book4
      { name: 'Galaxy Book4', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
        { cpu: 'i3', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.55, battery: 54 },

      // Galaxy Book3 Ultra
      { name: 'Galaxy Book3 Ultra', years: [2023], configs: [
        { cpu: 'i9', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3790000 },
        { cpu: 'i9', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3390000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3390000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 2990000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2590000 },
      ], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.79, battery: 76 },

      // Galaxy Book3 Pro 360
      { name: 'Galaxy Book3 Pro 360 16', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.66, battery: 76 },

      // Galaxy Book3 Pro 360 14
      { name: 'Galaxy Book3 Pro 360 14', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design', 'travel'], displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.25, battery: 63 },

      // Galaxy Book3 Pro 16
      { name: 'Galaxy Book3 Pro 16', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
      ], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.56, battery: 76 },

      // Galaxy Book3 Pro 14
      { name: 'Galaxy Book3 Pro 14', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.17, battery: 63 },

      // Galaxy Book3 360
      { name: 'Galaxy Book3 360', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 990000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.46, battery: 68 },

      // Galaxy Book3
      { name: 'Galaxy Book3', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
        { cpu: 'i3', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.58, battery: 54 },

      // Galaxy Book2 Pro 360
      { name: 'Galaxy Book2 Pro 360 15', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1390000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.41, battery: 68 },

      // Galaxy Book2 Pro 360 13
      { name: 'Galaxy Book2 Pro 360 13', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.04, battery: 63 },

      // Galaxy Book2 Pro 15
      { name: 'Galaxy Book2 Pro 15', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.11, battery: 68 },

      // Galaxy Book2 Pro 13
      { name: 'Galaxy Book2 Pro 13', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 0.87, battery: 63 },

      // Galaxy Book2 360
      { name: 'Galaxy Book2 360', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 128, newPrice: 890000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.16, battery: 62 },

      // Galaxy Book2
      { name: 'Galaxy Book2', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 790000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
        { cpu: 'i3', gpu: null, ram: 8, storage: 256, newPrice: 590000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.57, battery: 54 },

      // Galaxy Book Ion 15
      { name: 'Galaxy Book Ion 15', years: [2020, 2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 15.6, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.19, battery: 69 },

      // Galaxy Book Ion 13
      { name: 'Galaxy Book Ion 13', years: [2020, 2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 0.96, battery: 58 },

      // Galaxy Book Flex 15
      { name: 'Galaxy Book Flex 15', years: [2020, 2021], configs: [
        { cpu: 'i7', gpu: 'MX250', ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1390000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 15.6, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.57, battery: 69 },

      // Galaxy Book Flex 13
      { name: 'Galaxy Book Flex 13', years: [2020, 2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1390000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.15, battery: 58 },

      // Galaxy Book S
      { name: 'Galaxy Book S', years: [2020, 2021], configs: [
        { cpu: 'i5', gpu: null, ram: 8, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '일반', useCases: ['travel', 'office'], displayInch: 13.3, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 0.95, battery: 42 },

      // Galaxy Book Go
      { name: 'Galaxy Book Go', years: [2021, 2022], configs: [
        { cpu: 'Snapdragon 7c', gpu: null, ram: 8, storage: 128, newPrice: 590000 },
        { cpu: 'Snapdragon 7c', gpu: null, ram: 4, storage: 128, newPrice: 490000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.38, battery: 42 },

      // 갤럭시북 플렉스2
      { name: 'Galaxy Book Flex2 15', years: [2021], configs: [
        { cpu: 'i7', gpu: 'MX450', ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 15.6, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.57, battery: 69 },

      // Galaxy Book Flex2 13
      { name: 'Galaxy Book Flex2 13', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1490000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.26, battery: 54 },

      // Galaxy Book Pro 360 5G
      { name: 'Galaxy Book Pro 360 5G', years: [2021, 2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 2090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1790000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.04, battery: 63 },

      // Galaxy Book Flex Alpha
      { name: 'Galaxy Book Flex Alpha', years: [2020, 2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 990000 },
        { cpu: 'i3', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.18, battery: 54 },

      // Galaxy Book Odyssey
      { name: 'Galaxy Book Odyssey', years: [2021, 2022], configs: [
        { cpu: 'i7', gpu: 'RTX3050Ti', ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: 'RTX3050Ti', ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: 'RTX3050', ram: 16, storage: 256, newPrice: 1390000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.0, battery: 54 },

      // Galaxy Book Pro 360 Pen (2021)
      { name: 'Galaxy Book Pro 360 Pen', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1490000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.39, battery: 68 },

      // Galaxy Book Pro (2021)
      { name: 'Galaxy Book Pro 15', years: [2021], configs: [
        { cpu: 'i7', gpu: 'MX450', ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.05, battery: 68 },

      { name: 'Galaxy Book Pro 13', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 990000 },
      ], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 0.87, battery: 63 },

      // Galaxy Book 15 (2021)
      { name: 'Galaxy Book 15', years: [2021], configs: [
        { cpu: 'i7', gpu: 'MX450', ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
        { cpu: 'i3', gpu: null, ram: 8, storage: 256, newPrice: 590000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.55, battery: 54 },

      // Galaxy Book 360 (2021)
      { name: 'Galaxy Book 360 15', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.41, battery: 68 },

      // Galaxy Book4 Edge
      { name: 'Galaxy Book4 Edge 14', years: [2024], configs: [
        { cpu: 'Snapdragon X Elite', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'Snapdragon X Elite', gpu: null, ram: 16, storage: 256, newPrice: 1990000 },
      ], category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 120, weight: 1.16, battery: 55 },

      { name: 'Galaxy Book4 Edge 16', years: [2024], configs: [
        { cpu: 'Snapdragon X Elite', gpu: null, ram: 16, storage: 512, newPrice: 2390000 },
        { cpu: 'Snapdragon X Elite', gpu: null, ram: 16, storage: 256, newPrice: 2190000 },
      ], category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 120, weight: 1.59, battery: 61 },

      // Galaxy Book5 Pro 시리즈
      { name: 'Galaxy Book5 Pro 360 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
      ], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.69, battery: 76 },

      { name: 'Galaxy Book5 Pro 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2690000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 2090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
      ], category: '프리미엄', useCases: ['office', 'video-editing', 'developer'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.59, battery: 76 },

      { name: 'Galaxy Book5 Pro 14', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2490000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1390000 },
      ], category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.26, battery: 63 },

      // Galaxy Book5 360
      { name: 'Galaxy Book5 360', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.46, battery: 68 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['갤럭시북', '삼성노트북', '삼성', 'Galaxy Book']
  },

  LG: {
    series: [
      // gram Pro 17 2-in-1
      { name: 'gram Pro 17 2-in-1', years: [2024], configs: [
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3290000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 512, newPrice: 3090000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2890000 },
      ], category: '프리미엄', useCases: ['video-editing', 'developer', 'content-creation'], displayInch: 17, displayType: 'OLED', resolution: '2560x1600', refresh: 120, weight: 1.59, battery: 77 },

      // gram Pro 16 2-in-1
      { name: 'gram Pro 16 2-in-1', years: [2024], configs: [
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3190000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 512, newPrice: 2990000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2390000 },
      ], category: '프리미엄', useCases: ['video-editing', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.49, battery: 77 },

      // gram Pro 16
      { name: 'gram Pro 16', years: [2024], configs: [
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 2990000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 512, newPrice: 2790000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2590000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
      ], category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.44, battery: 77 },

      // gram 17 (2024)
      { name: 'gram 17', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 77 },

      // gram 16 (2024)
      { name: 'gram 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 77 },

      // gram 14 (2024)
      { name: 'gram 14', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },

      // gram 360 16 (2024)
      { name: 'gram 360 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
      ], category: '프리미엄', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.48, battery: 77 },

      // gram Style 16 (2024)
      { name: 'gram Style 16', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2490000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.19, battery: 77 },

      // gram 17 (2023)
      { name: 'gram 17', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },

      // gram 16 (2023)
      { name: 'gram 16', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 990000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 80 },

      // gram 15 (2023)
      { name: 'gram 15', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.12, battery: 72 },

      // gram 14 (2023)
      { name: 'gram 14', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },

      // gram 360 16 (2023)
      { name: 'gram 360 16', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
      ], category: '프리미엄', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.48, battery: 80 },

      // gram Style 16 (2023)
      { name: 'gram Style 16', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2390000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.19, battery: 80 },

      // gram SuperSlim
      { name: 'gram SuperSlim', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
      ], category: '프리미엄', useCases: ['travel', 'office'], displayInch: 15.6, displayType: 'OLED', resolution: '1920x1080', refresh: 60, weight: 0.99, battery: 60 },

      // gram 17 (2022)
      { name: 'gram 17', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2190000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },

      // gram 16 (2022)
      { name: 'gram 16', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1990000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 80 },

      // gram 15 (2022)
      { name: 'gram 15', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.12, battery: 72 },

      // gram 14 (2022)
      { name: 'gram 14', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },

      // gram 360 16 (2022)
      { name: 'gram 360 16', years: [2022], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
      ], category: '프리미엄', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.48, battery: 80 },

      // gram 17 (2021)
      { name: 'gram 17', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },

      // gram 16 (2021)
      { name: 'gram 16', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 80 },

      // gram 14 (2021)
      { name: 'gram 14', years: [2021], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },

      // gram 17 (2020)
      { name: 'gram 17', years: [2020], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },

      // gram 15 (2020)
      { name: 'gram 15', years: [2020], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1090000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.12, battery: 72 },

      // gram 14 (2020)
      { name: 'gram 14', years: [2020], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 890000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 0.99, battery: 72 },

      // UltraPC
      { name: 'UltraPC 17', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX3050', ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: 'RTX3050', ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1090000 },
      ], category: '일반', useCases: ['office', 'student', 'gaming'], displayInch: 17, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.9, battery: 72 },

      { name: 'UltraPC 16', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX3050', ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: 'RTX3050', ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '일반', useCases: ['office', 'student', 'gaming'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.85, battery: 72 },

      { name: 'UltraPC 15', years: [2022, 2023], configs: [
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
        { cpu: 'Ryzen 5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
      ], category: '가성비', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 54 },

      // gram 2025 시리즈
      { name: 'gram 17', years: [2025], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2490000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },

      { name: 'gram 16', years: [2025], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2290000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 80 },

      { name: 'gram 14', years: [2025], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2090000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },

      // gram Pro 2025
      { name: 'gram Pro 16', years: [2025], configs: [
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 1000, newPrice: 3090000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 32, storage: 512, newPrice: 2890000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2690000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2290000 },
      ], category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.44, battery: 80 },

      // gram 360 추가 연도
      { name: 'gram 360 14', years: [2022, 2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 256, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1390000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.25, battery: 72 },

      // UltraGear 게이밍 시리즈
      { name: 'UltraGear 17', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 2590000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1890000 },
        { cpu: 'i5', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1490000 },
      ], category: '게이밍', useCases: ['gaming', 'developer', 'video-editing'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 165, weight: 2.5, battery: 93 },

      { name: 'UltraGear 15', years: [2022, 2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'i5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i5', gpu: 'RTX3050', ram: 16, storage: 256, newPrice: 1090000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 80 },

      // gram Style 추가 변형
      { name: 'gram Style 14', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2490000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 0.99, battery: 72 },

      // gram View (외장 모니터 + 노트북 세트)
      { name: 'gram View', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 77 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['그램', 'LG그램', '초경량', 'gram']
  },

  // 기타 브랜드들은 더 간단하게 추가
  Lenovo: {
    series: [
      { name: 'ThinkPad X1 Carbon Gen 12', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2890000 },
        { cpu: 'i7', gpu: null, ram: 32, storage: 512, newPrice: 2690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1890000 },
      ], category: '비즈니스', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.09, battery: 57 },
      { name: 'ThinkPad X1 Carbon Gen 11', years: [2023], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2690000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1790000 },
      ], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '2880x1800', refresh: 60, weight: 1.12, battery: 57 },
      { name: 'ThinkPad E14 Gen 5', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '비즈니스', useCases: ['office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.59, battery: 57 },
      { name: 'Yoga 9i 14', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 1000, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1690000 },
      ], category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.4, battery: 75 },
      { name: 'Legion Pro 7i 16', years: [2023, 2024], configs: [
        { cpu: 'i9', gpu: 'RTX4090', ram: 32, storage: 1000, newPrice: 4290000 },
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3590000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2590000 },
      ], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.72, battery: 99 },
      { name: 'IdeaPad Slim 5 16', years: [2023, 2024], configs: [
        { cpu: 'Ryzen 7', gpu: null, ram: 16, storage: 512, newPrice: 990000 },
        { cpu: 'Ryzen 5', gpu: null, ram: 16, storage: 256, newPrice: 790000 },
        { cpu: 'Ryzen 5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.89, battery: 71 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['레노버', '씽크패드', '요가', '리전']
  },

  HP: {
    series: [
      { name: 'Spectre x360 16', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2790000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2390000 },
      ], category: '프리미엄', useCases: ['office', 'content-creation', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3072x1920', refresh: 60, weight: 2.05, battery: 83 },
      { name: 'ENVY x360 15', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
      ], category: '프리미엄', useCases: ['office', 'student', 'content-creation'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.89, battery: 66 },
      { name: 'Pavilion 15', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.75, battery: 41 },
      { name: 'OMEN 16', years: [2023, 2024], configs: [
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3290000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2290000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1790000 },
      ], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16.1, displayType: 'IPS', resolution: '2560x1440', refresh: 165, weight: 2.37, battery: 83 },
      { name: 'Victus 16', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1190000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16.1, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.31, battery: 70 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['HP노트북', '스펙터', '엔비', '오멘', '빅터스']
  },

  Dell: {
    series: [
      { name: 'XPS 15 9530', years: [2023], configs: [
        { cpu: 'i7', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3090000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 2390000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1890000 },
      ], category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 15.6, displayType: 'OLED', resolution: '3456x2160', refresh: 60, weight: 1.86, battery: 86 },
      { name: 'XPS 14 9440', years: [2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 2590000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 2190000 },
      ], category: '프리미엄', useCases: ['developer', 'office', 'content-creation'], displayInch: 14.5, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.69, battery: 69 },
      { name: 'Inspiron 15 3530', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 790000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 590000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.85, battery: 54 },
      { name: 'Alienware m16 R2', years: [2024], configs: [
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3590000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2590000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 2090000 },
      ], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.98, battery: 90 },
      { name: 'G16 7630', years: [2023, 2024], configs: [
        { cpu: 'i9', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2090000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i7', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1290000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 2.68, battery: 86 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['델노트북', 'XPS', '인스피론', '에일리언웨어']
  },

  ASUS: {
    series: [
      { name: 'ZenBook 14 OLED', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1590000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 990000 },
      ], category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.28, battery: 75 },
      { name: 'Vivobook 15 OLED', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1090000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 690000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'OLED', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 50 },
      { name: 'ROG Zephyrus G16', years: [2024], configs: [
        { cpu: 'i9', gpu: 'RTX4090', ram: 32, storage: 1000, newPrice: 3990000 },
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3290000 },
        { cpu: 'i9', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2590000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 2090000 },
      ], category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '2560x1600', refresh: 240, weight: 2.2, battery: 90 },
      { name: 'TUF Gaming A15', years: [2023, 2024], configs: [
        { cpu: 'Ryzen 9', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 1790000 },
        { cpu: 'Ryzen 7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'Ryzen 5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1090000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 90 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['에이수스', '젠북', '비보북', 'ROG', 'TUF']
  },

  Acer: {
    series: [
      { name: 'Swift Go 14', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1290000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 790000 },
      ], category: '프리미엄', useCases: ['office', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.25, battery: 65 },
      { name: 'Aspire 5', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 890000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 690000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 590000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.8, battery: 50 },
      { name: 'Nitro 5', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1190000 },
        { cpu: 'Ryzen 5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1090000 },
      ], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 57 },
      { name: 'Predator Helios 16', years: [2023, 2024], configs: [
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3290000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2390000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1890000 },
      ], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.6, battery: 90 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['에이서', '스위프트', '아스파이어', '니트로', '프레데터']
  },

  MSI: {
    series: [
      { name: 'Prestige 14 Evo', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 32, storage: 1000, newPrice: 1890000 },
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 1490000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 1190000 },
      ], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.4, battery: 72 },
      { name: 'Modern 15', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: null, ram: 16, storage: 512, newPrice: 990000 },
        { cpu: 'i5', gpu: null, ram: 16, storage: 256, newPrice: 790000 },
        { cpu: 'i5', gpu: null, ram: 8, storage: 256, newPrice: 590000 },
      ], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 52 },
      { name: 'Stealth 16 Studio', years: [2023, 2024], configs: [
        { cpu: 'i9', gpu: 'RTX4080', ram: 32, storage: 1000, newPrice: 3890000 },
        { cpu: 'i9', gpu: 'RTX4070', ram: 32, storage: 1000, newPrice: 3090000 },
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 2590000 },
      ], category: '게이밍', useCases: ['gaming', 'video-editing', '3d-modeling'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 120, weight: 2.0, battery: 99 },
      { name: 'Katana 15', years: [2023, 2024], configs: [
        { cpu: 'i7', gpu: 'RTX4070', ram: 16, storage: 512, newPrice: 1690000 },
        { cpu: 'i7', gpu: 'RTX4060', ram: 16, storage: 512, newPrice: 1390000 },
        { cpu: 'i5', gpu: 'RTX4050', ram: 16, storage: 512, newPrice: 1090000 },
      ], category: '게이밍', useCases: ['gaming'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.25, battery: 53 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['MSI노트북', '프레스티지', '스텔스', '카타나']
  },
};

// 노트북 데이터 생성 함수
function generateLaptop(brand, seriesInfo, config, year) {
  const brandData = brands[brand];
  const seriesName = seriesInfo.name;

  // CPU 정보
  let cpu, cpuSeries, cpuBrand;

  if (brand === 'Apple') {
    cpu = `Apple ${config.chip}`;
    cpuSeries = config.chip.split(' ')[0]; // M1, M2, M3, M4
    cpuBrand = 'Apple';
  } else if (config.cpu && config.cpu.includes('Ryzen')) {
    cpu = `AMD ${config.cpu}`;
    cpuSeries = 'Ryzen 7000';
    cpuBrand = 'AMD';
  } else if (config.cpu && config.cpu.includes('Snapdragon')) {
    cpu = `Qualcomm ${config.cpu}`;
    cpuSeries = 'Snapdragon';
    cpuBrand = 'Qualcomm';
  } else {
    const cpuType = config.cpu || 'i7';
    if (year >= 2024) {
      cpu = `Intel Core Ultra ${cpuType === 'i9' ? '9' : cpuType === 'i7' ? '7' : cpuType === 'i5' ? '5' : '3'} 155H`;
      cpuSeries = 'Core Ultra';
    } else if (year === 2023) {
      cpu = `Intel Core ${cpuType}-13${cpuType === 'i9' ? '9' : cpuType === 'i7' ? '7' : cpuType === 'i5' ? '5' : '3'}00H`;
      cpuSeries = '13세대 Core';
    } else if (year === 2022) {
      cpu = `Intel Core ${cpuType}-12${cpuType === 'i9' ? '9' : cpuType === 'i7' ? '7' : cpuType === 'i5' ? '5' : '3'}00H`;
      cpuSeries = '12세대 Core';
    } else {
      cpu = `Intel Core ${cpuType}-11${cpuType === 'i9' ? '9' : cpuType === 'i7' ? '7' : cpuType === 'i5' ? '5' : '3'}00H`;
      cpuSeries = '11세대 Core';
    }
    cpuBrand = 'Intel';
  }

  // GPU 정보
  let gpuName, gpuType;
  if (brand === 'Apple') {
    gpuName = `Apple ${config.chip} GPU`;
    gpuType = '내장';
  } else if (config.gpu) {
    if (config.gpu.includes('RTX')) {
      gpuName = `NVIDIA GeForce ${config.gpu}`;
    } else if (config.gpu.includes('MX')) {
      gpuName = `NVIDIA GeForce ${config.gpu}`;
    } else {
      gpuName = config.gpu;
    }
    gpuType = '외장';
  } else {
    gpuName = cpuBrand === 'AMD' ? 'AMD Radeon Graphics' :
              cpuBrand === 'Apple' ? `Apple ${config.chip} GPU` : 'Intel Iris Xe Graphics';
    gpuType = '내장';
  }

  // 가격 계산 (다나와 기준 중고가)
  const usedPrice = calculateUsedPrice(config.newPrice, year);

  // 슬러그 생성
  const ramStr = `${config.ram}gb`;
  const storageStr = config.storage >= 1000 ? `${config.storage / 1000}tb` : `${config.storage}gb`;
  const gpuStr = config.gpu ? `-${config.gpu.toLowerCase().replace(/\s+/g, '')}` : '';
  const chipStr = config.chip ? `-${config.chip.toLowerCase().replace(/\s+/g, '-')}` : '';
  const cpuStr = config.cpu && !config.chip ? `-${config.cpu.toLowerCase().replace(/\s+/g, '-')}` : '';

  const slug = `${brand.toLowerCase()}-${seriesName.toLowerCase().replace(/\s+/g, '-')}-${year}${chipStr}${cpuStr}${gpuStr}-${ramStr}-${storageStr}`.replace(/--+/g, '-');

  // 모델명 생성
  const variantParts = [];
  if (config.chip) variantParts.push(config.chip);
  else if (config.cpu) variantParts.push(config.cpu.toUpperCase());
  if (config.gpu) variantParts.push(config.gpu);
  variantParts.push(`${config.ram}GB`);
  variantParts.push(config.storage >= 1000 ? `${config.storage / 1000}TB` : `${config.storage}GB`);

  const variant = variantParts.join(' ');
  const fullName = `${brand} ${seriesName} ${variant} (${year})`;
  const model = `${seriesName} ${variant}`;

  // 한글 태그 생성
  const tags = [...brandData.tags];
  if (seriesInfo.category === '게이밍') tags.push('게이밍노트북');
  if (seriesInfo.category === '가성비') tags.push('가성비노트북');
  if (gpuType === '외장' && config.gpu) tags.push(config.gpu);
  if (seriesInfo.displayType === 'OLED' || seriesInfo.displayType === 'Liquid Retina XDR') tags.push('OLED');
  if (seriesInfo.weight < 1.3) tags.push('초경량');
  if (seriesInfo.displayInch >= 16) tags.push('대화면');

  return {
    id: String(id++),
    slug,
    brand,
    model,
    fullName,
    year,
    priceKrw: usedPrice,
    newPriceKrw: config.newPrice,
    refurlabUrl: "https://refurlab.com",
    cpu,
    cpuSeries,
    cpuBrand,
    ramGb: config.ram,
    ramType: brandData.ramType,
    storageGb: config.storage,
    storageType: 'SSD',
    displayInch: seriesInfo.displayInch,
    displayType: seriesInfo.displayType,
    displayResolution: seriesInfo.resolution,
    displayRefreshRate: seriesInfo.refresh,
    gpu: gpuName,
    gpuType,
    batteryWh: seriesInfo.battery,
    weightKg: seriesInfo.weight,
    os: brand === 'Apple' ? 'macOS' : 'Windows 11',
    metaTitle: `${model} ${year} 스펙 중고가격`,
    metaDescription: `${fullName} 상세 스펙, 중고 가격 ${(usedPrice / 10000).toFixed(0)}만원 (다나와 기준). ${seriesInfo.useCases.map(u => {
      const names = { student: '학생용', developer: '개발용', 'video-editing': '영상편집', gaming: '게이밍', office: '사무용', travel: '휴대용', 'graphic-design': '디자인', '3d-modeling': '3D작업', 'content-creation': '콘텐츠제작' };
      return names[u] || u;
    }).join(', ')} 추천.`,
    useCases: seriesInfo.useCases,
    tags: [...new Set(tags)],
    category: seriesInfo.category
  };
}

// 칩/연도 매칭 함수 (Apple용)
function isChipValidForYear(chip, year) {
  if (chip.startsWith('M1')) return year >= 2020 && year <= 2022;
  if (chip.startsWith('M2')) return year >= 2022 && year <= 2023;
  if (chip.startsWith('M3')) return year >= 2023 && year <= 2024;
  if (chip.startsWith('M4')) return year >= 2024;
  return false;
}

// 모든 브랜드에 대해 노트북 생성
Object.entries(brands).forEach(([brand, brandData]) => {
  brandData.series.forEach(series => {
    series.years.forEach(year => {
      series.configs.forEach(config => {
        // Apple은 칩-연도 매칭 필요
        if (brand === 'Apple') {
          if (config.chip && isChipValidForYear(config.chip, year)) {
            laptops.push(generateLaptop(brand, series, config, year));
          }
        } else {
          laptops.push(generateLaptop(brand, series, config, year));
        }
      });
    });
  });
});

// 브랜드별 통계
const brandCounts = {};
laptops.forEach(l => {
  brandCounts[l.brand] = (brandCounts[l.brand] || 0) + 1;
});

console.log('브랜드별 노트북 수:');
Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count}개`);
});
console.log(`\n총 ${laptops.length}개 노트북 생성됨`);

// JSON 파일로 저장
fs.writeFileSync('./data/laptops.json', JSON.stringify(laptops, null, 2));
console.log('저장 완료: data/laptops.json');
