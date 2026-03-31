// 500개 노트북 데이터 생성 스크립트
const fs = require('fs');

const laptops = [];
let id = 1;

// 브랜드별 모델 템플릿
const brands = {
  Apple: {
    series: [
      { name: 'MacBook Pro 16', years: [2021, 2022, 2023, 2024], chips: ['M1 Pro', 'M1 Max', 'M2 Pro', 'M2 Max', 'M3 Pro', 'M3 Max', 'M4 Pro', 'M4 Max'], category: '프리미엄', useCases: ['developer', 'video-editing', '3d-modeling'], displayInch: 16.2, displayType: 'Liquid Retina XDR', resolution: '3456x2234', refresh: 120, basePrice: 3200000, weight: 2.14, battery: 100 },
      { name: 'MacBook Pro 14', years: [2021, 2022, 2023, 2024], chips: ['M1 Pro', 'M1 Max', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max', 'M4', 'M4 Pro'], category: '프리미엄', useCases: ['developer', 'video-editing', 'graphic-design'], displayInch: 14.2, displayType: 'Liquid Retina XDR', resolution: '3024x1964', refresh: 120, basePrice: 2400000, weight: 1.55, battery: 70 },
      { name: 'MacBook Air 15', years: [2023, 2024], chips: ['M2', 'M3', 'M4'], category: '프리미엄', useCases: ['student', 'office', 'developer'], displayInch: 15.3, displayType: 'Liquid Retina', resolution: '2880x1864', refresh: 60, basePrice: 1800000, weight: 1.51, battery: 66 },
      { name: 'MacBook Air 13', years: [2020, 2022, 2023, 2024], chips: ['M1', 'M2', 'M3', 'M4'], category: '프리미엄', useCases: ['student', 'office', 'travel'], displayInch: 13.6, displayType: 'Liquid Retina', resolution: '2560x1664', refresh: 60, basePrice: 1500000, weight: 1.24, battery: 52 },
    ],
    cpuBrand: 'Apple',
    ramType: '통합 메모리',
    os: 'macOS',
    gpuType: '내장',
    tags: ['맥북', '애플']
  },
  Samsung: {
    series: [
      { name: 'Galaxy Book4 Ultra', years: [2024], variants: ['i9 RTX4070', 'i9 RTX4050', 'i7 RTX4070', 'i7 RTX4050'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, basePrice: 3200000, weight: 1.87, battery: 76 },
      { name: 'Galaxy Book4 Pro 16', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'video-editing', 'developer'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, basePrice: 2400000, weight: 1.56, battery: 76 },
      { name: 'Galaxy Book4 Pro 14', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, basePrice: 2100000, weight: 1.23, battery: 63 },
      { name: 'Galaxy Book4 360', years: [2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, basePrice: 1500000, weight: 1.46, battery: 68 },
      { name: 'Galaxy Book4', years: [2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 1000000, weight: 1.55, battery: 54 },
      { name: 'Galaxy Book3 Pro 360', years: [2023], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'graphic-design'], displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, basePrice: 1900000, weight: 1.66, battery: 76 },
      { name: 'Galaxy Book3 Pro', years: [2023], variants: ['i7 16GB 16인치', 'i7 16GB 14인치', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, basePrice: 1700000, weight: 1.17, battery: 63 },
      { name: 'Galaxy Book3 Ultra', years: [2023], variants: ['i9 RTX4070', 'i9 RTX4050', 'i7 RTX4050'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'], displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, basePrice: 2900000, weight: 1.79, battery: 76 },
      { name: 'Galaxy Book3 360', years: [2023], variants: ['i7 16GB', 'i5 8GB'], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, basePrice: 1300000, weight: 1.46, battery: 68 },
      { name: 'Galaxy Book2 Pro', years: [2022], variants: ['i7 16GB 15인치', 'i7 16GB 13인치', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, basePrice: 1400000, weight: 1.11, battery: 68 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['갤럭시북', '삼성노트북', '삼성']
  },
  LG: {
    series: [
      { name: 'gram Pro 16 2-in-1', years: [2024], variants: ['i7 RTX4050 32GB', 'i7 RTX4050 16GB'], category: '프리미엄', useCases: ['video-editing', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 2900000, weight: 1.49, battery: 77 },
      { name: 'gram Pro 16', years: [2024], variants: ['i7 RTX4050 32GB', 'i7 RTX4050 16GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 2700000, weight: 1.44, battery: 77 },
      { name: 'gram 17', years: [2022, 2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'student', 'developer'], displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 2100000, weight: 1.35, battery: 77 },
      { name: 'gram 16', years: [2022, 2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1900000, weight: 1.19, battery: 77 },
      { name: 'gram 15', years: [2022, 2023], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'student', 'travel'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1600000, weight: 1.12, battery: 72 },
      { name: 'gram 14', years: [2022, 2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1600000, weight: 0.99, battery: 72 },
      { name: 'gram Style 16', years: [2023, 2024], variants: ['i7 16GB OLED'], category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 2400000, weight: 1.19, battery: 77 },
      { name: 'gram 360 16', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 2000000, weight: 1.48, battery: 77 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['그램', 'LG그램', '초경량']
  },
  Lenovo: {
    series: [
      { name: 'ThinkPad X1 Carbon Gen 12', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 2500000, weight: 1.09, battery: 57 },
      { name: 'ThinkPad X1 Carbon Gen 11', years: [2023], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '2880x1800', refresh: 60, basePrice: 2200000, weight: 1.12, battery: 57 },
      { name: 'ThinkPad X1 Nano Gen 3', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['travel', 'office'], displayInch: 13, displayType: 'IPS', resolution: '2160x1350', refresh: 60, basePrice: 2000000, weight: 0.97, battery: 49 },
      { name: 'ThinkPad T14s Gen 5', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'IPS', resolution: '2880x1800', refresh: 60, basePrice: 1800000, weight: 1.22, battery: 58 },
      { name: 'ThinkPad T14s Gen 4', years: [2023], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1600000, weight: 1.22, battery: 58 },
      { name: 'ThinkPad T16 Gen 2', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1700000, weight: 1.72, battery: 86 },
      { name: 'ThinkPad E14 Gen 5', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1100000, weight: 1.59, battery: 57 },
      { name: 'ThinkPad E16 Gen 1', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1200000, weight: 1.77, battery: 57 },
      { name: 'ThinkPad X13 Gen 4', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['travel', 'office'], displayInch: 13.3, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1500000, weight: 1.19, battery: 54 },
      { name: 'Yoga 9i 14', years: [2023, 2024], variants: ['i7 16GB OLED', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 2100000, weight: 1.4, battery: 75 },
      { name: 'Yoga 7i 16', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1500000, weight: 2.04, battery: 71 },
      { name: 'Yoga Slim 7i Pro', years: [2023, 2024], variants: ['i7 16GB OLED', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 90, basePrice: 1600000, weight: 1.45, battery: 70 },
      { name: 'IdeaPad Pro 5i 16', years: [2023, 2024], variants: ['i7 RTX4050', 'i7 16GB', 'i5 16GB'], category: '일반', useCases: ['developer', 'student', 'video-editing'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 120, basePrice: 1400000, weight: 1.89, battery: 84 },
      { name: 'IdeaPad Slim 5 16', years: [2023, 2024], variants: ['Ryzen 7 16GB', 'Ryzen 5 16GB', 'Ryzen 5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 900000, weight: 1.89, battery: 71 },
      { name: 'IdeaPad Slim 5 14', years: [2023, 2024], variants: ['Ryzen 7 16GB', 'Ryzen 5 16GB', 'i5 16GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 850000, weight: 1.46, battery: 56 },
      { name: 'IdeaPad Gaming 3 15', years: [2023, 2024], variants: ['Ryzen 7 RTX4050', 'Ryzen 5 RTX4050', 'Ryzen 5 RTX3050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 120, basePrice: 1100000, weight: 2.32, battery: 60 },
      { name: 'Legion Pro 7i 16', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 3500000, weight: 2.72, battery: 99 },
      { name: 'Legion Pro 5i 16', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 2200000, weight: 2.52, battery: 80 },
      { name: 'Legion 5 Pro 16', years: [2023, 2024], variants: ['Ryzen 9 RTX4070', 'Ryzen 7 RTX4060', 'Ryzen 7 RTX4050'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 1900000, weight: 2.5, battery: 80 },
      { name: 'Legion 5i 15', years: [2023, 2024], variants: ['i7 RTX4060', 'i5 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1500000, weight: 2.4, battery: 60 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['레노버', '씽크패드', '요가', '아이디어패드', '리전']
  },
  HP: {
    series: [
      { name: 'Spectre x360 16', years: [2023, 2024], variants: ['i7 32GB OLED', 'i7 16GB OLED', 'i7 16GB IPS'], category: '프리미엄', useCases: ['office', 'content-creation', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3072x1920', refresh: 60, basePrice: 2500000, weight: 2.05, battery: 83 },
      { name: 'Spectre x360 14', years: [2023, 2024], variants: ['i7 32GB OLED', 'i7 16GB OLED', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 2300000, weight: 1.44, battery: 68 },
      { name: 'ENVY x360 15', years: [2023, 2024], variants: ['i7 16GB OLED', 'Ryzen 7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'student', 'content-creation'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 1500000, weight: 1.89, battery: 66 },
      { name: 'ENVY 16', years: [2023, 2024], variants: ['i7 RTX4060', 'i7 RTX4050', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 1900000, weight: 2.18, battery: 83 },
      { name: 'ENVY 17', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1600000, weight: 2.6, battery: 83 },
      { name: 'Pavilion Plus 14', years: [2023, 2024], variants: ['i7 16GB OLED', 'i5 16GB', 'i5 8GB'], category: '일반', useCases: ['student', 'office'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, basePrice: 1200000, weight: 1.4, battery: 51 },
      { name: 'Pavilion 15', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'Ryzen 7 16GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 850000, weight: 1.75, battery: 41 },
      { name: 'Pavilion x360 14', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '일반', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 900000, weight: 1.52, battery: 43 },
      { name: 'OMEN 17', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 240, basePrice: 3200000, weight: 2.78, battery: 83 },
      { name: 'OMEN 16', years: [2023, 2024], variants: ['i9 RTX4080', 'i7 RTX4070', 'i7 RTX4060', 'Ryzen 9 RTX4070'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16.1, displayType: 'IPS', resolution: '2560x1440', refresh: 165, basePrice: 2100000, weight: 2.37, battery: 83 },
      { name: 'Victus 16', years: [2023, 2024], variants: ['i7 RTX4060', 'i7 RTX4050', 'i5 RTX4050', 'Ryzen 7 RTX4060'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16.1, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1200000, weight: 2.31, battery: 70 },
      { name: 'Victus 15', years: [2023, 2024], variants: ['i5 RTX4050', 'Ryzen 5 RTX4050', 'Ryzen 5 RTX3050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1000000, weight: 2.29, battery: 70 },
      { name: 'EliteBook 840 G10', years: [2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1800000, weight: 1.36, battery: 51 },
      { name: 'EliteBook 860 G10', years: [2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 2000000, weight: 1.82, battery: 76 },
      { name: 'ProBook 450 G10', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 1100000, weight: 1.79, battery: 51 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['HP노트북', '스펙터', '엔비', '파빌리온', '오멘', '빅터스']
  },
  Dell: {
    series: [
      { name: 'XPS 17 9730', years: [2023], variants: ['i7 RTX4070 32GB', 'i7 RTX4050 16GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'developer'], displayInch: 17, displayType: 'UHD+', resolution: '3840x2400', refresh: 60, basePrice: 3000000, weight: 2.44, battery: 97 },
      { name: 'XPS 15 9530', years: [2023], variants: ['i7 RTX4070 32GB', 'i7 RTX4050 16GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 15.6, displayType: 'OLED', resolution: '3456x2160', refresh: 60, basePrice: 2500000, weight: 1.86, battery: 86 },
      { name: 'XPS 14 9440', years: [2024], variants: ['i7 32GB OLED', 'i7 16GB OLED', 'i5 16GB'], category: '프리미엄', useCases: ['developer', 'office', 'content-creation'], displayInch: 14.5, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 2300000, weight: 1.69, battery: 69 },
      { name: 'XPS 13 Plus 9320', years: [2023], variants: ['i7 32GB OLED', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['travel', 'developer', 'office'], displayInch: 13.4, displayType: 'OLED', resolution: '3456x2160', refresh: 60, basePrice: 1800000, weight: 1.26, battery: 55 },
      { name: 'XPS 13 9315', years: [2023], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['travel', 'office', 'student'], displayInch: 13.4, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1500000, weight: 1.17, battery: 51 },
      { name: 'Inspiron 16 Plus 7640', years: [2024], variants: ['i7 RTX4060', 'i7 RTX4050', 'i7 16GB'], category: '일반', useCases: ['video-editing', 'student', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1400000, weight: 2.1, battery: 86 },
      { name: 'Inspiron 16 Plus 7630', years: [2023], variants: ['i7 RTX4050', 'i7 16GB', 'i5 16GB'], category: '일반', useCases: ['developer', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, basePrice: 1300000, weight: 2.1, battery: 86 },
      { name: 'Inspiron 15 3530', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'i3 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 700000, weight: 1.85, battery: 54 },
      { name: 'Inspiron 14 5430', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '일반', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 900000, weight: 1.47, battery: 54 },
      { name: 'Latitude 7440', years: [2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1800000, weight: 1.36, battery: 58 },
      { name: 'Latitude 5540', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 1500000, weight: 1.79, battery: 63 },
      { name: 'Latitude 5440', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 1400000, weight: 1.48, battery: 58 },
      { name: 'Alienware m18 R2', years: [2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 18, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 4000000, weight: 4.04, battery: 97 },
      { name: 'Alienware m16 R2', years: [2024], variants: ['i9 RTX4080', 'i7 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 2800000, weight: 2.98, battery: 90 },
      { name: 'Alienware x16 R2', years: [2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'OLED', resolution: '2560x1600', refresh: 240, basePrice: 3500000, weight: 2.75, battery: 97 },
      { name: 'G16 7630', years: [2023, 2024], variants: ['i9 RTX4070', 'i7 RTX4060', 'i7 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 1800000, weight: 2.68, battery: 86 },
      { name: 'G15 5530', years: [2023], variants: ['i7 RTX4060', 'i7 RTX4050', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 120, basePrice: 1400000, weight: 2.52, battery: 56 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['델노트북', 'XPS', '인스피론', '래티튜드', '에일리언웨어']
  },
  ASUS: {
    series: [
      { name: 'ZenBook Pro 16X OLED', years: [2023, 2024], variants: ['i9 RTX4080 32GB', 'i9 RTX4070 32GB', 'i7 RTX4060 16GB'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 60, basePrice: 3200000, weight: 2.4, battery: 96 },
      { name: 'ZenBook Pro 14 OLED', years: [2023, 2024], variants: ['i9 RTX4060 32GB', 'i7 RTX4060 16GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'graphic-design', 'developer'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 2200000, weight: 1.64, battery: 76 },
      { name: 'ZenBook 14 OLED UX3405', years: [2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 1500000, weight: 1.28, battery: 75 },
      { name: 'ZenBook 14 UX3402', years: [2023], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, basePrice: 1300000, weight: 1.39, battery: 75 },
      { name: 'ZenBook S 13 OLED', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['travel', 'office'], displayInch: 13.3, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 1400000, weight: 1.0, battery: 63 },
      { name: 'ZenBook Duo 14 OLED', years: [2023, 2024], variants: ['i9 RTX4050 32GB', 'i7 16GB'], category: '프리미엄', useCases: ['content-creation', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 2000000, weight: 1.65, battery: 75 },
      { name: 'Vivobook Pro 16X OLED', years: [2023, 2024], variants: ['i9 RTX4060', 'i7 RTX4060', 'i7 RTX4050'], category: '일반', useCases: ['video-editing', 'developer'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 1800000, weight: 1.95, battery: 90 },
      { name: 'Vivobook Pro 15 OLED', years: [2023, 2024], variants: ['i7 RTX4050', 'i7 16GB', 'Ryzen 7 RTX4050'], category: '일반', useCases: ['video-editing', 'developer', 'student'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1620', refresh: 120, basePrice: 1400000, weight: 1.8, battery: 70 },
      { name: 'Vivobook S15 OLED', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'Ryzen 7 16GB'], category: '일반', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1620', refresh: 120, basePrice: 1200000, weight: 1.5, battery: 75 },
      { name: 'Vivobook 15 OLED', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'Ryzen 7 16GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'OLED', resolution: '1920x1080', refresh: 60, basePrice: 900000, weight: 1.7, battery: 50 },
      { name: 'Vivobook 16X', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'Ryzen 7 16GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 850000, weight: 1.88, battery: 70 },
      { name: 'ProArt Studiobook 16 OLED', years: [2023, 2024], variants: ['i9 RTX4080 64GB', 'i9 RTX4070 32GB', 'i7 RTX4060 32GB'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 60, basePrice: 3400000, weight: 2.4, battery: 90 },
      { name: 'ProArt Studiobook Pro 16', years: [2023, 2024], variants: ['i9 RTX A5000', 'i9 RTX A4000'], category: '프리미엄', useCases: ['3d-modeling', 'video-editing'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 60, basePrice: 4000000, weight: 2.4, battery: 90 },
      { name: 'ROG Zephyrus G16', years: [2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '2560x1600', refresh: 240, basePrice: 2800000, weight: 2.2, battery: 90 },
      { name: 'ROG Zephyrus G14', years: [2023, 2024], variants: ['Ryzen 9 RTX4090', 'Ryzen 9 RTX4070', 'Ryzen 9 RTX4060', 'Ryzen 7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 2500000, weight: 1.5, battery: 73 },
      { name: 'ROG Zephyrus M16', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 3000000, weight: 2.3, battery: 90 },
      { name: 'ROG Strix G18', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming'], displayInch: 18, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 3200000, weight: 3.1, battery: 90 },
      { name: 'ROG Strix G16', years: [2023, 2024], variants: ['i9 RTX4080', 'i9 RTX4070', 'i7 RTX4060', 'i5 RTX4060'], category: '게이밍', useCases: ['gaming'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 2100000, weight: 2.5, battery: 90 },
      { name: 'ROG Strix SCAR 18', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 18, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 4000000, weight: 3.2, battery: 90 },
      { name: 'ROG Strix SCAR 16', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070'], category: '게이밍', useCases: ['gaming'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 3500000, weight: 2.5, battery: 90 },
      { name: 'TUF Gaming A16', years: [2023, 2024], variants: ['Ryzen 9 RTX4070', 'Ryzen 7 RTX4060', 'Ryzen 7 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, basePrice: 1500000, weight: 2.2, battery: 90 },
      { name: 'TUF Gaming A15', years: [2023, 2024], variants: ['Ryzen 9 RTX4070', 'Ryzen 7 RTX4060', 'Ryzen 7 RTX4050', 'Ryzen 5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1200000, weight: 2.2, battery: 90 },
      { name: 'TUF Gaming F15', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1300000, weight: 2.2, battery: 90 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['에이수스', '젠북', '비보북', 'ROG', 'TUF', '프로아트']
  },
  Acer: {
    series: [
      { name: 'Swift Go 16', years: [2023, 2024], variants: ['i7 16GB OLED', 'i5 16GB OLED', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 60, basePrice: 1400000, weight: 1.65, battery: 65 },
      { name: 'Swift Go 14', years: [2023, 2024], variants: ['i7 16GB OLED', 'i5 16GB OLED', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, basePrice: 1100000, weight: 1.25, battery: 65 },
      { name: 'Swift X 16', years: [2023, 2024], variants: ['i7 RTX4070 32GB', 'i7 RTX4060 16GB', 'i7 RTX4050 16GB'], category: '프리미엄', useCases: ['video-editing', 'developer'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, basePrice: 1800000, weight: 1.9, battery: 76 },
      { name: 'Swift X 14', years: [2023, 2024], variants: ['i7 RTX4050 16GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['developer', 'video-editing', 'office'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 1500000, weight: 1.54, battery: 73 },
      { name: 'Swift 5', years: [2023], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 14, displayType: 'IPS', resolution: '2560x1440', refresh: 60, basePrice: 1300000, weight: 1.2, battery: 56 },
      { name: 'Swift Edge 16', years: [2023, 2024], variants: ['Ryzen 7 Pro 16GB OLED', 'Ryzen 5 16GB'], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 60, basePrice: 1500000, weight: 1.23, battery: 54 },
      { name: 'Aspire 5', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'Ryzen 7 16GB', 'Ryzen 5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 700000, weight: 1.8, battery: 50 },
      { name: 'Aspire 3', years: [2023, 2024], variants: ['i5 8GB', 'i3 8GB', 'Ryzen 5 8GB', 'Ryzen 3 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 500000, weight: 1.9, battery: 45 },
      { name: 'Aspire Vero 15', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 900000, weight: 1.8, battery: 57 },
      { name: 'Predator Helios 18', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 18, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 3500000, weight: 3.1, battery: 90 },
      { name: 'Predator Helios 16', years: [2023, 2024], variants: ['i9 RTX4080', 'i7 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 2500000, weight: 2.6, battery: 90 },
      { name: 'Predator Helios Neo 16', years: [2023, 2024], variants: ['i9 RTX4070', 'i7 RTX4060', 'i7 RTX4050'], category: '게이밍', useCases: ['gaming'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 1800000, weight: 2.55, battery: 90 },
      { name: 'Predator Triton 17 X', years: [2023, 2024], variants: ['i9 RTX4090 64GB', 'i9 RTX4090 32GB'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17.3, displayType: 'Mini-LED', resolution: '2560x1600', refresh: 250, basePrice: 4500000, weight: 2.9, battery: 99 },
      { name: 'Nitro V 16', years: [2024], variants: ['Ryzen 7 RTX4060', 'Ryzen 5 RTX4050', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, basePrice: 1200000, weight: 2.5, battery: 90 },
      { name: 'Nitro 5 AN515', years: [2023, 2024], variants: ['i7 RTX4060', 'i5 RTX4050', 'Ryzen 7 RTX4060', 'Ryzen 5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1000000, weight: 2.2, battery: 57 },
      { name: 'Nitro 17', years: [2023, 2024], variants: ['i7 RTX4060', 'i7 RTX4050', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming'], displayInch: 17.3, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1400000, weight: 2.6, battery: 90 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['에이서', '스위프트', '아스파이어', '프레데터', '니트로']
  },
  MSI: {
    series: [
      { name: 'Prestige 16 AI Evo', years: [2024], variants: ['i9 32GB', 'i7 32GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'graphic-design', 'developer'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 60, basePrice: 2000000, weight: 1.6, battery: 90 },
      { name: 'Prestige 14 AI Evo', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, basePrice: 1600000, weight: 1.4, battery: 72 },
      { name: 'Prestige 13 AI Evo', years: [2024], variants: ['i7 32GB', 'i7 16GB'], category: '프리미엄', useCases: ['travel', 'office'], displayInch: 13.3, displayType: 'OLED', resolution: '2560x1600', refresh: 60, basePrice: 1500000, weight: 0.99, battery: 75 },
      { name: 'Summit E16 Flip Evo', years: [2023, 2024], variants: ['i7 32GB', 'i7 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 2200000, weight: 2.0, battery: 82 },
      { name: 'Summit E14 Evo', years: [2023, 2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB'], category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 1800000, weight: 1.35, battery: 72 },
      { name: 'Modern 15', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 850000, weight: 1.7, battery: 52 },
      { name: 'Modern 14', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 800000, weight: 1.4, battery: 52 },
      { name: 'Creator Z16 HX Studio', years: [2023, 2024], variants: ['i9 RTX4080 64GB', 'i9 RTX4070 32GB', 'i7 RTX4060 32GB'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 16, displayType: 'Mini-LED', resolution: '3840x2400', refresh: 120, basePrice: 4000000, weight: 2.6, battery: 90 },
      { name: 'Creator M16', years: [2023, 2024], variants: ['i9 RTX4070', 'i7 RTX4060', 'i7 RTX4050'], category: '프리미엄', useCases: ['video-editing', 'graphic-design'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, basePrice: 2200000, weight: 2.3, battery: 90 },
      { name: 'Stealth 18 Studio', years: [2024], variants: ['i9 RTX4090', 'i9 RTX4080'], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 18, displayType: 'Mini-LED', resolution: '3840x2400', refresh: 120, basePrice: 5000000, weight: 2.9, battery: 99 },
      { name: 'Stealth 16 Studio', years: [2023, 2024], variants: ['i9 RTX4080', 'i9 RTX4070', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming', 'video-editing', '3d-modeling'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 120, basePrice: 3200000, weight: 2.0, battery: 99 },
      { name: 'Stealth 14 Studio', years: [2023, 2024], variants: ['i9 RTX4070', 'i7 RTX4060', 'i7 RTX4050'], category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, basePrice: 2400000, weight: 1.7, battery: 72 },
      { name: 'Raider GE78 HX', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17, displayType: 'Mini-LED', resolution: '2560x1600', refresh: 240, basePrice: 4500000, weight: 3.1, battery: 99 },
      { name: 'Raider GE68 HX', years: [2023, 2024], variants: ['i9 RTX4080', 'i9 RTX4070', 'i7 RTX4070'], category: '게이밍', useCases: ['gaming'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, basePrice: 3000000, weight: 2.7, battery: 99 },
      { name: 'Katana 17 B13V', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i7 RTX4050'], category: '게이밍', useCases: ['gaming'], displayInch: 17.3, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1400000, weight: 2.6, battery: 53 },
      { name: 'Katana 15 B13V', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1200000, weight: 2.25, battery: 53 },
      { name: 'Pulse 17', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4060'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 17.3, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1500000, weight: 2.7, battery: 53 },
      { name: 'Pulse 15', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1300000, weight: 2.3, battery: 53 },
      { name: 'Thin GF63', years: [2023, 2024], variants: ['i7 RTX4050', 'i5 RTX4050', 'i5 RTX3050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 900000, weight: 1.86, battery: 52 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['MSI노트북', '프레스티지', '스텔스', '레이더', '카타나']
  },
  Razer: {
    series: [
      { name: 'Blade 18', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 18, displayType: 'Mini-LED', resolution: '2560x1600', refresh: 240, basePrice: 4500000, weight: 2.98, battery: 91 },
      { name: 'Blade 16', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'Mini-LED', resolution: '2560x1600', refresh: 240, basePrice: 3800000, weight: 2.45, battery: 95 },
      { name: 'Blade 15', years: [2023, 2024], variants: ['i9 RTX4070', 'i7 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 15.6, displayType: 'IPS', resolution: '2560x1440', refresh: 240, basePrice: 2800000, weight: 2.01, battery: 80 },
      { name: 'Blade 14', years: [2023, 2024], variants: ['Ryzen 9 RTX4070', 'Ryzen 9 RTX4060', 'Ryzen 7 RTX4060'], category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 240, basePrice: 2900000, weight: 1.84, battery: 68 },
      { name: 'Book 13', years: [2022, 2023], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.4, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1500000, weight: 1.34, battery: 55 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['레이저', '블레이드', '게이밍노트북']
  },
  Microsoft: {
    series: [
      { name: 'Surface Laptop Studio 2', years: [2023, 2024], variants: ['i7 RTX4060 64GB', 'i7 RTX4050 32GB', 'i7 16GB'], category: '프리미엄', useCases: ['video-editing', 'graphic-design', 'developer'], displayInch: 14.4, displayType: 'IPS', resolution: '2400x1600', refresh: 120, basePrice: 2800000, weight: 1.98, battery: 58 },
      { name: 'Surface Laptop 6', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 15, displayType: 'IPS', resolution: '2496x1664', refresh: 120, basePrice: 1800000, weight: 1.66, battery: 58 },
      { name: 'Surface Laptop 5', years: [2022, 2023], variants: ['i7 16GB 15인치', 'i7 16GB 13인치', 'i5 8GB'], category: '프리미엄', useCases: ['office', 'student'], displayInch: 13.5, displayType: 'IPS', resolution: '2256x1504', refresh: 60, basePrice: 1500000, weight: 1.27, battery: 47 },
      { name: 'Surface Pro 10', years: [2024], variants: ['i7 32GB', 'i7 16GB', 'i5 16GB', 'i5 8GB'], category: '비즈니스', useCases: ['office', 'travel'], displayInch: 13, displayType: 'IPS', resolution: '2880x1920', refresh: 120, basePrice: 1600000, weight: 0.88, battery: 53 },
      { name: 'Surface Pro 9', years: [2022, 2023], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'SQ3 16GB'], category: '비즈니스', useCases: ['office', 'travel'], displayInch: 13, displayType: 'IPS', resolution: '2880x1920', refresh: 120, basePrice: 1400000, weight: 0.88, battery: 53 },
      { name: 'Surface Go 4', years: [2023, 2024], variants: ['i3 8GB', 'Pentium 4GB'], category: '가성비', useCases: ['student', 'travel'], displayInch: 10.5, displayType: 'IPS', resolution: '1920x1280', refresh: 60, basePrice: 700000, weight: 0.52, battery: 28 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR5x',
    os: 'Windows 11',
    tags: ['서피스', '마이크로소프트', '윈도우']
  },
  Gigabyte: {
    series: [
      { name: 'AERO 17 OLED', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 17.3, displayType: 'OLED', resolution: '3840x2160', refresh: 60, basePrice: 3500000, weight: 2.5, battery: 99 },
      { name: 'AERO 16 OLED', years: [2023, 2024], variants: ['i9 RTX4070 32GB', 'i7 RTX4060 32GB', 'i7 RTX4050 16GB'], category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 60, basePrice: 2700000, weight: 2.3, battery: 99 },
      { name: 'AORUS 17X', years: [2023, 2024], variants: ['i9 RTX4090', 'i9 RTX4080', 'i9 RTX4070'], category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 240, basePrice: 4000000, weight: 3.3, battery: 99 },
      { name: 'AORUS 15X', years: [2023, 2024], variants: ['i9 RTX4080', 'i9 RTX4070', 'i7 RTX4060'], category: '게이밍', useCases: ['gaming'], displayInch: 15.6, displayType: 'IPS', resolution: '2560x1440', refresh: 165, basePrice: 2500000, weight: 2.6, battery: 99 },
      { name: 'G5 KF5', years: [2023, 2024], variants: ['i7 RTX4060', 'i5 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1200000, weight: 2.08, battery: 54 },
      { name: 'G6 KF', years: [2023, 2024], variants: ['i7 RTX4070', 'i7 RTX4060', 'i5 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, basePrice: 1400000, weight: 2.3, battery: 54 },
      { name: 'A5 X1', years: [2023, 2024], variants: ['Ryzen 9 RTX4070', 'Ryzen 7 RTX4060', 'Ryzen 7 RTX4050'], category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, basePrice: 1300000, weight: 2.4, battery: 54 },
    ],
    cpuBrand: 'Intel',
    ramType: 'DDR5',
    os: 'Windows 11',
    tags: ['기가바이트', '에어로', '어로스']
  },
  Huawei: {
    series: [
      { name: 'MateBook X Pro 2024', years: [2024], variants: ['i9 32GB', 'i7 32GB', 'i7 16GB'], category: '프리미엄', useCases: ['office', 'developer', 'travel'], displayInch: 14.2, displayType: 'OLED', resolution: '3120x2080', refresh: 120, basePrice: 2300000, weight: 0.98, battery: 70 },
      { name: 'MateBook X Pro 2023', years: [2023], variants: ['i7 16GB'], category: '프리미엄', useCases: ['office', 'developer'], displayInch: 14.2, displayType: 'OLED', resolution: '3120x2080', refresh: 90, basePrice: 2000000, weight: 1.26, battery: 60 },
      { name: 'MateBook 16s', years: [2023, 2024], variants: ['i9 16GB', 'i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['developer', 'office'], displayInch: 16, displayType: 'IPS', resolution: '2520x1680', refresh: 60, basePrice: 1600000, weight: 1.99, battery: 84 },
      { name: 'MateBook 14s', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB'], category: '프리미엄', useCases: ['office', 'travel'], displayInch: 14.2, displayType: 'IPS', resolution: '2520x1680', refresh: 90, basePrice: 1400000, weight: 1.43, battery: 60 },
      { name: 'MateBook D16', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB'], category: '가성비', useCases: ['office', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, basePrice: 1000000, weight: 1.68, battery: 60 },
      { name: 'MateBook D15', years: [2023, 2024], variants: ['i7 16GB', 'i5 16GB', 'i5 8GB', 'Ryzen 7 16GB'], category: '가성비', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 800000, weight: 1.56, battery: 56 },
      { name: 'MateBook D14', years: [2023, 2024], variants: ['i5 16GB', 'i5 8GB', 'Ryzen 5 8GB'], category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, basePrice: 700000, weight: 1.38, battery: 56 },
    ],
    cpuBrand: 'Intel',
    ramType: 'LPDDR4x',
    os: 'Windows 11',
    tags: ['화웨이', '메이트북']
  }
};

// 노트북 데이터 생성 함수
function generateLaptop(brand, seriesInfo, variant, year) {
  const brandData = brands[brand];
  const seriesName = seriesInfo.name;

  // CPU 정보 파싱
  let cpu, cpuSeries, ramGb, gpuName, gpuType;

  if (brand === 'Apple') {
    cpu = `Apple ${variant}`;
    cpuSeries = variant.split(' ')[0]; // M1, M2, M3, M4
    ramGb = variant.includes('Max') ? 36 : variant.includes('Pro') ? 18 : 8;
    if (seriesName.includes('Pro 16') || seriesName.includes('Pro 14')) {
      ramGb = variant.includes('Max') ? 48 : variant.includes('Pro') ? 18 : 8;
    }
    gpuName = `Apple ${variant} GPU`;
    gpuType = '내장';
  } else {
    // 일반 노트북
    const variantParts = variant.split(' ');
    let cpuModel = variantParts[0];

    if (variant.includes('Ryzen')) {
      cpuModel = variantParts.slice(0, 2).join(' ');
      cpu = `AMD ${cpuModel}`;
      cpuSeries = cpuModel.includes('9') ? 'Ryzen 9000' : cpuModel.includes('8') ? 'Ryzen 8000' : 'Ryzen 7000';
      brandData.cpuBrand = 'AMD';
    } else if (variantParts[0] === 'i9' || variantParts[0] === 'i7' || variantParts[0] === 'i5' || variantParts[0] === 'i3') {
      const coreType = variantParts[0];
      if (year >= 2024) {
        cpu = `Intel Core Ultra ${coreType === 'i9' ? '9' : coreType === 'i7' ? '7' : coreType === 'i5' ? '5' : '3'} 155H`;
        cpuSeries = 'Core Ultra';
      } else if (year === 2023) {
        cpu = `Intel Core ${coreType}-13${coreType === 'i9' ? '9' : coreType === 'i7' ? '7' : coreType === 'i5' ? '5' : '3'}00H`;
        cpuSeries = '13세대 Core';
      } else {
        cpu = `Intel Core ${coreType}-12${coreType === 'i9' ? '9' : coreType === 'i7' ? '7' : coreType === 'i5' ? '5' : '3'}00H`;
        cpuSeries = '12세대 Core';
      }
      brandData.cpuBrand = 'Intel';
    } else {
      cpu = `Intel Core Ultra 7 155H`;
      cpuSeries = 'Core Ultra';
    }

    // RAM 추출
    const ramMatch = variant.match(/(\d+)GB/);
    ramGb = ramMatch ? parseInt(ramMatch[1]) : 16;

    // GPU 추출
    const gpuMatch = variant.match(/RTX\s*(\d+)/);
    if (gpuMatch) {
      gpuName = `NVIDIA GeForce RTX ${gpuMatch[1]}`;
      gpuType = '외장';
    } else {
      gpuName = brandData.cpuBrand === 'AMD' ? 'AMD Radeon Graphics' : 'Intel Arc Graphics';
      gpuType = '내장';
    }
  }

  // 저장공간
  let storageGb = ramGb >= 32 ? 1000 : ramGb >= 16 ? 512 : 256;
  if (seriesInfo.category === '게이밍' || seriesInfo.category === '프리미엄') {
    storageGb = ramGb >= 32 ? 2000 : 1000;
  }

  // 가격 계산
  let price = seriesInfo.basePrice;
  if (variant.includes('RTX4090')) price += 1500000;
  else if (variant.includes('RTX4080')) price += 1000000;
  else if (variant.includes('RTX4070')) price += 600000;
  else if (variant.includes('RTX4060')) price += 300000;
  else if (variant.includes('RTX4050')) price += 150000;

  if (ramGb >= 64) price += 500000;
  else if (ramGb >= 32) price += 200000;

  if (year < 2024) price -= 200000;
  if (year < 2023) price -= 200000;

  // 가격 조정 (하한선)
  price = Math.max(price, 500000);

  // 슬러그 생성
  const slugBase = `${brand.toLowerCase()}-${seriesName.toLowerCase().replace(/\s+/g, '-')}-${year}`;
  const variantSlug = variant.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
  const slug = `${slugBase}-${variantSlug}`.replace(/--+/g, '-');

  // 모델명 생성
  const fullName = `${brand} ${seriesName} ${variant} (${year})`;
  const model = `${seriesName} ${variant}`;

  // 한글 태그 생성
  const tags = [...brandData.tags];
  if (seriesInfo.category === '게이밍') tags.push('게이밍노트북');
  if (seriesInfo.category === '가성비') tags.push('가성비노트북');
  if (gpuType === '외장') tags.push(gpuName.split(' ').pop());
  if (seriesInfo.displayType === 'OLED') tags.push('OLED');
  if (seriesInfo.weight < 1.3) tags.push('초경량');
  if (seriesInfo.displayInch >= 16) tags.push('대화면');

  return {
    id: String(id++),
    slug,
    brand,
    model,
    fullName,
    year,
    priceKrw: price,
    refurlabUrl: "https://refurlab.com",
    cpu,
    cpuSeries,
    cpuBrand: brand === 'Apple' ? 'Apple' : brandData.cpuBrand,
    ramGb,
    ramType: brandData.ramType,
    storageGb,
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
    metaTitle: `${model} ${year} 스펙 가격 리뷰`,
    metaDescription: `${fullName} 상세 스펙, 중고 가격 비교. ${seriesInfo.useCases.map(u => {
      const names = { student: '학생용', developer: '개발용', 'video-editing': '영상편집', gaming: '게이밍', office: '사무용', travel: '휴대용', 'graphic-design': '디자인', '3d-modeling': '3D작업', 'content-creation': '콘텐츠제작', 'data-science': '데이터분석' };
      return names[u] || u;
    }).join(', ')} 추천.`,
    useCases: seriesInfo.useCases,
    tags: [...new Set(tags)],
    category: seriesInfo.category
  };
}

// 모든 브랜드에 대해 노트북 생성
Object.entries(brands).forEach(([brand, brandData]) => {
  brandData.series.forEach(series => {
    if (brand === 'Apple') {
      // Apple은 chip 기반
      series.years.forEach(year => {
        series.chips.forEach(chip => {
          // 연도에 맞는 칩만 사용
          const chipGen = chip.charAt(1);
          if ((year === 2021 && chip.startsWith('M1')) ||
              (year === 2022 && (chip.startsWith('M1') || chip.startsWith('M2'))) ||
              (year === 2023 && (chip.startsWith('M2') || chip.startsWith('M3'))) ||
              (year === 2024 && (chip.startsWith('M3') || chip.startsWith('M4')))) {
            laptops.push(generateLaptop(brand, series, chip, year));
          }
        });
      });
    } else {
      // 일반 브랜드는 variant 기반
      series.years.forEach(year => {
        series.variants.forEach(variant => {
          laptops.push(generateLaptop(brand, series, variant, year));
        });
      });
    }
  });
});

console.log(`Generated ${laptops.length} laptops`);

// JSON 파일로 저장
fs.writeFileSync('./data/laptops.json', JSON.stringify(laptops, null, 2));
console.log('Saved to data/laptops.json');
