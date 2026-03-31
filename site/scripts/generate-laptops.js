// 노트북 데이터 생성 스크립트 - 다나와 기준 중고가격 반영 (5000개 확장 버전)
const fs = require('fs');

const laptops = [];
let id = 1;

// 중고가격 계산 함수 (다나와/중고나라 기준)
function calculateUsedPrice(newPrice, year) {
  const currentYear = 2024;
  const age = currentYear - year;
  const retentionRates = {
    0: 0.85, 1: 0.65, 2: 0.50, 3: 0.40, 4: 0.32, 5: 0.25, 6: 0.20, 7: 0.18
  };
  const rate = retentionRates[Math.min(age, 7)] || 0.18;
  const usedPrice = Math.round(newPrice * rate / 10000) * 10000;
  return Math.max(usedPrice, 300000);
}

function createSlug(text) {
  return text.toLowerCase()
    .replace(/[가-힣]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ===== APPLE =====
const appleModels = [
  // MacBook Pro 16
  { name: 'MacBook Pro 16', years: [2019, 2020, 2021, 2022, 2023, 2024], chips: ['M1 Pro', 'M1 Max', 'M2 Pro', 'M2 Max', 'M3 Pro', 'M3 Max', 'M4 Pro', 'M4 Max'],
    ramOptions: [16, 32, 48, 64, 96, 128], storageOptions: [256, 512, 1000, 2000, 4000, 8000],
    basePrice: 3490000, category: '프리미엄', useCases: ['developer', 'video-editing', '3d-modeling'],
    displayInch: 16.2, displayType: 'Liquid Retina XDR', resolution: '3456x2234', refresh: 120, weight: 2.14, battery: 100 },
  // MacBook Pro 14
  { name: 'MacBook Pro 14', years: [2021, 2022, 2023, 2024], chips: ['M1 Pro', 'M1 Max', 'M2 Pro', 'M2 Max', 'M3', 'M3 Pro', 'M3 Max', 'M4', 'M4 Pro', 'M4 Max'],
    ramOptions: [8, 16, 18, 24, 32, 36, 48, 64, 96, 128], storageOptions: [256, 512, 1000, 2000, 4000],
    basePrice: 2690000, category: '프리미엄', useCases: ['developer', 'video-editing', 'graphic-design'],
    displayInch: 14.2, displayType: 'Liquid Retina XDR', resolution: '3024x1964', refresh: 120, weight: 1.55, battery: 70 },
  // MacBook Air 15
  { name: 'MacBook Air 15', years: [2023, 2024], chips: ['M2', 'M3', 'M4'],
    ramOptions: [8, 16, 24, 32], storageOptions: [256, 512, 1000, 2000],
    basePrice: 1690000, category: '프리미엄', useCases: ['student', 'office', 'developer'],
    displayInch: 15.3, displayType: 'Liquid Retina', resolution: '2880x1864', refresh: 60, weight: 1.51, battery: 66 },
  // MacBook Air 13
  { name: 'MacBook Air 13', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024], chips: ['Intel i5', 'M1', 'M2', 'M3', 'M4'],
    ramOptions: [8, 16, 24, 32], storageOptions: [128, 256, 512, 1000, 2000],
    basePrice: 1290000, category: '프리미엄', useCases: ['student', 'office', 'travel'],
    displayInch: 13.6, displayType: 'Liquid Retina', resolution: '2560x1664', refresh: 60, weight: 1.24, battery: 52 },
  // MacBook Pro 13
  { name: 'MacBook Pro 13', years: [2017, 2018, 2019, 2020], chips: ['Intel i5', 'Intel i7', 'M1'],
    ramOptions: [8, 16], storageOptions: [128, 256, 512, 1000],
    basePrice: 1690000, category: '프리미엄', useCases: ['developer', 'student', 'office'],
    displayInch: 13.3, displayType: 'Retina', resolution: '2560x1600', refresh: 60, weight: 1.4, battery: 58 },
  // MacBook 12
  { name: 'MacBook 12', years: [2017, 2018], chips: ['Intel m3', 'Intel i5', 'Intel i7'],
    ramOptions: [8, 16], storageOptions: [256, 512],
    basePrice: 1490000, category: '프리미엄', useCases: ['travel', 'office'],
    displayInch: 12, displayType: 'Retina', resolution: '2304x1440', refresh: 60, weight: 0.92, battery: 41 },
];

function generateAppleLaptops() {
  const generated = [];

  appleModels.forEach(model => {
    model.years.forEach(year => {
      model.chips.forEach(chip => {
        // 칩과 연도 호환성 체크
        if (!isAppleChipYearCompatible(chip, year, model.name)) return;

        model.ramOptions.forEach(ram => {
          // 칩별 RAM 호환성 체크
          if (!isAppleRamCompatible(chip, ram)) return;

          model.storageOptions.forEach(storage => {
            const newPrice = calculateApplePrice(model.basePrice, chip, ram, storage);
            const usedPrice = calculateUsedPrice(newPrice, year);

            const fullName = `Apple ${model.name} ${year} ${chip} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
            const slug = createSlug(fullName) + '-' + id;

            generated.push({
              id: String(id++),
              brand: 'Apple',
              model: `${chip} ${ram}GB`,
              fullName,
              slug,
              year,
              cpu: chip,
              cpuSeries: chip.split(' ')[0],
              cpuBrand: 'Apple',
              ramGb: ram,
              ramType: '통합 메모리',
              storageGb: storage,
              storageType: 'SSD',
              gpu: chip,
              gpuType: '내장',
              displayInch: model.displayInch,
              displayType: model.displayType,
              displayResolution: model.resolution,
              displayRefreshRate: model.refresh,
              weightKg: model.weight,
              batteryWh: model.battery,
              os: 'macOS',
              priceKrw: usedPrice,
              category: model.category,
              useCases: model.useCases,
              tags: ['맥북', '애플', 'MacBook', model.name.includes('Air') ? '맥북에어' : '맥북프로'],
              metaTitle: `${fullName} 중고 가격, 스펙 비교`,
              metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북으로 ${model.useCases.join(', ')}에 적합.`
            });
          });
        });
      });
    });
  });

  return generated;
}

function isAppleChipYearCompatible(chip, year, modelName) {
  if (chip.startsWith('Intel')) return year <= 2020;
  if (chip === 'M1' || chip === 'M1 Pro' || chip === 'M1 Max') return year >= 2020 && year <= 2022;
  if (chip === 'M2' || chip === 'M2 Pro' || chip === 'M2 Max') return year >= 2022 && year <= 2023;
  if (chip === 'M3' || chip === 'M3 Pro' || chip === 'M3 Max') return year >= 2023 && year <= 2024;
  if (chip === 'M4' || chip === 'M4 Pro' || chip === 'M4 Max') return year >= 2024;
  return false;
}

function isAppleRamCompatible(chip, ram) {
  if (chip.startsWith('Intel')) return ram <= 16;
  if (chip === 'M1' || chip === 'M2' || chip === 'M3' || chip === 'M4') return ram <= 32;
  if (chip.includes('Pro')) return ram <= 48;
  if (chip.includes('Max')) return ram <= 128;
  return false;
}

function calculateApplePrice(basePrice, chip, ram, storage) {
  let price = basePrice;
  if (chip.includes('Max')) price += 800000;
  else if (chip.includes('Pro')) price += 300000;
  if (ram > 16) price += (ram - 16) * 25000;
  if (storage > 512) price += (storage - 512) * 400;
  return price;
}

// ===== SAMSUNG =====
const samsungModels = [
  { name: 'Galaxy Book4 Ultra', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4050'],
    ramOptions: [16, 32, 64], storageOptions: [512, 1000, 2000], basePrice: 3590000,
    category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'],
    displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.87, battery: 76 },
  { name: 'Galaxy Book4 Pro 16', years: [2024], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 2190000,
    category: '프리미엄', useCases: ['office', 'video-editing', 'developer'],
    displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.56, battery: 76 },
  { name: 'Galaxy Book4 Pro 14', years: [2024], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1790000,
    category: '프리미엄', useCases: ['office', 'travel', 'developer'],
    displayInch: 14, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.23, battery: 63 },
  { name: 'Galaxy Book4 360', years: [2024], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1290000,
    category: '일반', useCases: ['office', 'student'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.46, battery: 68 },
  { name: 'Galaxy Book4', years: [2024], cpus: ['i7', 'i5', 'i3'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000,
    category: '가성비', useCases: ['student', 'office'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.55, battery: 54 },
  { name: 'Galaxy Book4 Edge', years: [2024], cpus: ['Snapdragon X Elite', 'Snapdragon X Plus'], gpus: [null],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2190000,
    category: '프리미엄', useCases: ['office', 'travel', 'developer'],
    displayInch: 14, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.17, battery: 55 },
  { name: 'Galaxy Book3 Ultra', years: [2023], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4050'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 3390000,
    category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'gaming'],
    displayInch: 16, displayType: 'Dynamic AMOLED 2X', resolution: '2880x1800', refresh: 120, weight: 1.79, battery: 76 },
  { name: 'Galaxy Book3 Pro 360 16', years: [2023], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 2090000,
    category: '프리미엄', useCases: ['office', 'graphic-design'],
    displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.66, battery: 76 },
  { name: 'Galaxy Book3 Pro 360 14', years: [2023], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000,
    category: '프리미엄', useCases: ['office', 'graphic-design', 'travel'],
    displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.25, battery: 63 },
  { name: 'Galaxy Book3 Pro 16', years: [2023], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 16, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.56, battery: 76 },
  { name: 'Galaxy Book3 Pro 14', years: [2023], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1590000,
    category: '프리미엄', useCases: ['office', 'developer', 'travel'],
    displayInch: 14, displayType: 'AMOLED', resolution: '2880x1800', refresh: 60, weight: 1.17, battery: 63 },
  { name: 'Galaxy Book3 360', years: [2023], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1190000,
    category: '일반', useCases: ['office', 'student'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.46, battery: 68 },
  { name: 'Galaxy Book3', years: [2023], cpus: ['i7', 'i5', 'i3'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000,
    category: '가성비', useCases: ['student', 'office'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.58, battery: 54 },
  { name: 'Galaxy Book2 Pro 360 15', years: [2022], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000,
    category: '프리미엄', useCases: ['office', 'graphic-design'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.41, battery: 68 },
  { name: 'Galaxy Book2 Pro 360 13', years: [2022], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1690000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.04, battery: 63 },
  { name: 'Galaxy Book2 Pro 15', years: [2022], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1690000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.11, battery: 68 },
  { name: 'Galaxy Book2 Pro 13', years: [2022], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 0.87, battery: 63 },
  { name: 'Galaxy Book2 360', years: [2022], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000,
    category: '일반', useCases: ['office', 'student'],
    displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.16, battery: 62 },
  { name: 'Galaxy Book2', years: [2022], cpus: ['i7', 'i5', 'i3'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000,
    category: '가성비', useCases: ['student', 'office'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.57, battery: 54 },
  { name: 'Galaxy Book Pro 360 15', years: [2021], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512, 1000], basePrice: 1790000,
    category: '프리미엄', useCases: ['office', 'graphic-design'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.39, battery: 68 },
  { name: 'Galaxy Book Pro 360 13', years: [2021], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1590000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.04, battery: 63 },
  { name: 'Galaxy Book Pro 15', years: [2021], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512, 1000], basePrice: 1590000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 15.6, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 1.05, battery: 68 },
  { name: 'Galaxy Book Pro 13', years: [2021], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1390000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'AMOLED', resolution: '1920x1080', refresh: 60, weight: 0.87, battery: 63 },
  { name: 'Galaxy Book Flex 15', years: [2020], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1690000,
    category: '프리미엄', useCases: ['office', 'graphic-design'],
    displayInch: 15.6, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.57, battery: 69 },
  { name: 'Galaxy Book Flex 13', years: [2020], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.16, battery: 69 },
  { name: 'Galaxy Book Ion 15', years: [2020], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 15.6, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 1.19, battery: 69 },
  { name: 'Galaxy Book Ion 13', years: [2020], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1290000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'QLED', resolution: '1920x1080', refresh: 60, weight: 0.97, battery: 69 },
  { name: 'Galaxy Book S', years: [2020], cpus: ['i5'], gpus: [null],
    ramOptions: [8], storageOptions: [256, 512], basePrice: 1290000,
    category: '프리미엄', useCases: ['travel', 'office'],
    displayInch: 13.3, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 0.96, battery: 42 },
  { name: 'Notebook 9 Pro 15', years: [2019], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1590000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 15, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.29, battery: 55 },
  { name: 'Notebook 9 Pro 13', years: [2019], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1390000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.1, battery: 55 },
  { name: 'Notebook 9 15', years: [2018, 2019], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000,
    category: '프리미엄', useCases: ['office', 'developer'],
    displayInch: 15, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.29, battery: 75 },
  { name: 'Notebook 9 13', years: [2018, 2019], cpus: ['i7', 'i5'], gpus: [null],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1290000,
    category: '프리미엄', useCases: ['office', 'travel'],
    displayInch: 13.3, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 0.99, battery: 75 },
  { name: 'Galaxy Book Odyssey', years: [2021, 2022], cpus: ['i7', 'i5'], gpus: ['RTX3050Ti', 'RTX3050'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1790000,
    category: '게이밍', useCases: ['gaming', 'developer'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 1.86, battery: 83 },
];

function generateSamsungLaptops() {
  const generated = [];

  samsungModels.forEach(model => {
    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        model.gpus.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateSamsungPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `Samsung ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'Samsung',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Snapdragon') ? cpu : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Snapdragon') ? 'Intel' : 'Intel',
                ramGb: ram,
                ramType: 'LPDDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || 'Intel Iris Xe',
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['삼성', '갤럭시북', 'Galaxy Book', model.name],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

function calculateSamsungPrice(basePrice, cpu, gpu, ram, storage) {
  let price = basePrice;
  if (cpu === 'i9') price += 400000;
  else if (cpu === 'i7') price += 200000;
  if (gpu === 'RTX4070') price += 400000;
  else if (gpu === 'RTX4050') price += 200000;
  if (ram > 16) price += (ram - 16) * 15000;
  if (storage > 256) price += (storage - 256) * 300;
  return price;
}

// ===== LG =====
const lgModels = [
  { name: 'gram 17', years: [2019, 2020, 2021, 2022, 2023, 2024, 2025], cpus: ['i7', 'i5'],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000,
    category: '프리미엄', useCases: ['office', 'student', 'developer'],
    displayInch: 17, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.35, battery: 80 },
  { name: 'gram 16', years: [2021, 2022, 2023, 2024, 2025], cpus: ['i7', 'i5'],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1690000,
    category: '프리미엄', useCases: ['office', 'student', 'travel'],
    displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 80 },
  { name: 'gram 15', years: [2018, 2019, 2020, 2021, 2022, 2023], cpus: ['i7', 'i5'],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1390000,
    category: '프리미엄', useCases: ['office', 'student', 'travel'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.12, battery: 72 },
  { name: 'gram 14', years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], cpus: ['i7', 'i5'],
    ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1290000,
    category: '프리미엄', useCases: ['travel', 'office', 'student'],
    displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 0.99, battery: 72 },
  { name: 'gram 13', years: [2018, 2019, 2020], cpus: ['i7', 'i5'],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1190000,
    category: '프리미엄', useCases: ['travel', 'office'],
    displayInch: 13.3, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 0.96, battery: 72 },
  { name: 'gram 360 16', years: [2022, 2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1790000,
    category: '프리미엄', useCases: ['office', 'student'],
    displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.48, battery: 80 },
  { name: 'gram 360 14', years: [2022, 2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000,
    category: '프리미엄', useCases: ['office', 'student'],
    displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.25, battery: 72 },
  { name: 'gram Style 16', years: [2023, 2024], cpus: ['i7'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2390000,
    category: '프리미엄', useCases: ['office', 'developer', 'content-creation'],
    displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.19, battery: 80 },
  { name: 'gram Style 14', years: [2023, 2024], cpus: ['i7'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2190000,
    category: '프리미엄', useCases: ['office', 'developer', 'content-creation'],
    displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 0.99, battery: 72 },
  { name: 'gram SuperSlim', years: [2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16], storageOptions: [256, 512], basePrice: 1790000,
    category: '프리미엄', useCases: ['travel', 'office'],
    displayInch: 15.6, displayType: 'OLED', resolution: '1920x1080', refresh: 60, weight: 0.99, battery: 60 },
  { name: 'gram Pro 16', years: [2024, 2025], cpus: ['i7'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2690000,
    category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'],
    displayInch: 16, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.44, battery: 80, gpus: ['RTX4050', null] },
  { name: 'UltraGear 17', years: [2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1890000, gpus: ['RTX4070', 'RTX4060', 'RTX4050'],
    category: '게이밍', useCases: ['gaming', 'developer', 'video-editing'],
    displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 165, weight: 2.5, battery: 93 },
  { name: 'UltraGear 15', years: [2022, 2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1390000, gpus: ['RTX4070', 'RTX4060', 'RTX4050', 'RTX3050'],
    category: '게이밍', useCases: ['gaming', 'student'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 80 },
  { name: 'UltraPC 17', years: [2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16], storageOptions: [256, 512], basePrice: 1290000, gpus: ['RTX3050', null],
    category: '일반', useCases: ['office', 'student', 'gaming'],
    displayInch: 17, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.9, battery: 72 },
  { name: 'UltraPC 16', years: [2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, gpus: ['RTX3050', null],
    category: '일반', useCases: ['office', 'student', 'gaming'],
    displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.85, battery: 72 },
  { name: 'UltraPC 15', years: [2022, 2023], cpus: ['i5', 'Ryzen 5'],
    ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000,
    category: '가성비', useCases: ['office', 'student'],
    displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 54 },
  { name: 'gram View', years: [2023, 2024], cpus: ['i7', 'i5'],
    ramOptions: [16], storageOptions: [256, 512], basePrice: 1990000,
    category: '프리미엄', useCases: ['office', 'developer', 'content-creation'],
    displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.19, battery: 77 },
];

function generateLGLaptops() {
  const generated = [];

  lgModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateLGPrice(model.basePrice, cpu, gpu, ram, storage, year);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `LG ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'LG',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Ryzen') ? `AMD ${cpu}` : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Ryzen') ? 'AMD' : 'Intel',
                ramGb: ram,
                ramType: 'LPDDR5x',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || 'Intel Iris Xe',
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['LG', '그램', 'gram', model.name],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

function calculateLGPrice(basePrice, cpu, gpu, ram, storage, year) {
  let price = basePrice;
  if (cpu === 'i7') price += 200000;
  if (gpu) {
    if (gpu.includes('4070')) price += 400000;
    else if (gpu.includes('4060')) price += 300000;
    else if (gpu.includes('4050')) price += 200000;
    else if (gpu.includes('3050')) price += 100000;
  }
  if (ram > 16) price += (ram - 16) * 15000;
  if (storage > 256) price += (storage - 256) * 300;
  if (year >= 2024) price += 100000;
  return price;
}

// ===== Lenovo =====
const lenovoModels = [
  { name: 'ThinkPad X1 Carbon Gen 12', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 2290000, category: '비즈니스', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.09, battery: 57 },
  { name: 'ThinkPad X1 Carbon Gen 11', years: [2023], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 2090000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '2880x1800', refresh: 60, weight: 1.12, battery: 57 },
  { name: 'ThinkPad X1 Carbon Gen 10', years: [2022], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '2880x1800', refresh: 60, weight: 1.12, battery: 57 },
  { name: 'ThinkPad X1 Carbon Gen 9', years: [2021], cpus: ['i7', 'i5'], ramOptions: [8, 16, 32], storageOptions: [256, 512], basePrice: 1690000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.13, battery: 57 },
  { name: 'ThinkPad X1 Carbon Gen 8', years: [2020], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1490000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.09, battery: 51 },
  { name: 'ThinkPad X1 Nano Gen 3', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 2190000, category: '비즈니스', useCases: ['travel', 'office'], displayInch: 13, displayType: 'IPS', resolution: '2160x1350', refresh: 60, weight: 0.97, battery: 49 },
  { name: 'ThinkPad T14s Gen 5', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.24, battery: 58 },
  { name: 'ThinkPad T14s Gen 4', years: [2023], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1690000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.22, battery: 58 },
  { name: 'ThinkPad T14 Gen 5', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1590000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.38, battery: 52 },
  { name: 'ThinkPad T14 Gen 4', years: [2023], cpus: ['i7', 'i5'], ramOptions: [8, 16, 32], storageOptions: [256, 512], basePrice: 1390000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.38, battery: 52 },
  { name: 'ThinkPad E14 Gen 5', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '비즈니스', useCases: ['office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.59, battery: 57 },
  { name: 'ThinkPad E15 Gen 5', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '비즈니스', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.78, battery: 57 },
  { name: 'Yoga 9i 14 Gen 9', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2090000, category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.4, battery: 75 },
  { name: 'Yoga 9i 14 Gen 8', years: [2023], cpus: ['i7', 'i5'], ramOptions: [16], storageOptions: [256, 512, 1000], basePrice: 1890000, category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.4, battery: 75 },
  { name: 'Yoga Slim 7 Pro 14', years: [2022, 2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7', 'Ryzen 5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1290000, category: '프리미엄', useCases: ['developer', 'office'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.45, battery: 61 },
  { name: 'Yoga 7 16', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7'], ramOptions: [16], storageOptions: [256, 512, 1000], basePrice: 1490000, category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 2.0, battery: 71 },
  { name: 'IdeaPad Slim 5 16', years: [2023, 2024], cpus: ['Ryzen 7', 'Ryzen 5', 'i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000, category: '가성비', useCases: ['student', 'office'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.89, battery: 71 },
  { name: 'IdeaPad Slim 5 14', years: [2022, 2023, 2024], cpus: ['Ryzen 7', 'Ryzen 5', 'i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 690000, category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.46, battery: 56 },
  { name: 'IdeaPad 3 15', years: [2022, 2023, 2024], cpus: ['Ryzen 5', 'i5', 'i3'], ramOptions: [8], storageOptions: [256, 512], basePrice: 590000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.63, battery: 45 },
  { name: 'Legion Pro 7i 16 Gen 9', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 3290000, category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.72, battery: 99 },
  { name: 'Legion Pro 7i 16 Gen 8', years: [2023], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2990000, category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.72, battery: 99 },
  { name: 'Legion 5 Pro 16', years: [2022, 2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7', 'i7'], gpus: ['RTX4070', 'RTX4060', 'RTX3070'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1790000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 2.5, battery: 80 },
  { name: 'Legion 5 15', years: [2021, 2022, 2023, 2024], cpus: ['Ryzen 7', 'Ryzen 5', 'i7', 'i5'], gpus: ['RTX4060', 'RTX4050', 'RTX3060', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1190000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.4, battery: 60 },
  { name: 'LOQ 15', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.38, battery: 60 },
];

function generateLenovoLaptops() {
  const generated = [];

  lenovoModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `Lenovo ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'Lenovo',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Ryzen') ? `AMD ${cpu}` : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Ryzen') ? 'AMD' : 'Intel',
                ramGb: ram,
                ramType: 'LPDDR5x',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || (cpu.startsWith('Ryzen') ? 'AMD Radeon' : 'Intel Iris Xe'),
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['레노버', 'Lenovo', model.name.includes('ThinkPad') ? '씽크패드' : model.name.includes('Legion') ? '리전' : model.name.includes('Yoga') ? '요가' : '아이디어패드'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// ===== HP =====
const hpModels = [
  { name: 'Spectre x360 16', years: [2023, 2024], cpus: ['i7'], ramOptions: [16, 32], storageOptions: [512, 1000, 2000], basePrice: 2390000, category: '프리미엄', useCases: ['office', 'content-creation', 'graphic-design'], displayInch: 16, displayType: 'OLED', resolution: '3072x1920', refresh: 60, weight: 2.05, battery: 83 },
  { name: 'Spectre x360 14', years: [2022, 2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1990000, category: '프리미엄', useCases: ['office', 'content-creation'], displayInch: 13.5, displayType: 'OLED', resolution: '3000x2000', refresh: 60, weight: 1.36, battery: 66 },
  { name: 'ENVY x360 15', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512, 1000], basePrice: 1290000, category: '프리미엄', useCases: ['office', 'student', 'content-creation'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.89, battery: 66 },
  { name: 'ENVY x360 13', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '프리미엄', useCases: ['office', 'travel'], displayInch: 13.3, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.34, battery: 51 },
  { name: 'Pavilion Plus 14', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16], storageOptions: [256, 512], basePrice: 1190000, category: '일반', useCases: ['office', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.4, battery: 51 },
  { name: 'Pavilion 15', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.75, battery: 41 },
  { name: 'Pavilion 14', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 690000, category: '가성비', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.41, battery: 43 },
  { name: 'OMEN 16', years: [2022, 2023, 2024], cpus: ['i9', 'i7', 'Ryzen 9', 'Ryzen 7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070', 'RTX4060'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1990000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16.1, displayType: 'IPS', resolution: '2560x1440', refresh: 165, weight: 2.37, battery: 83 },
  { name: 'OMEN 17', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 2790000, category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 240, weight: 2.78, battery: 83 },
  { name: 'Victus 16', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16.1, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.31, battery: 70 },
  { name: 'Victus 15', years: [2022, 2023], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], gpus: ['RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.29, battery: 70 },
  { name: 'EliteBook 840 G10', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1890000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.36, battery: 51 },
  { name: 'EliteBook 840 G9', years: [2022], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512], basePrice: 1690000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.36, battery: 51 },
  { name: 'ProBook 450 G10', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '비즈니스', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.79, battery: 51 },
];

function generateHPLaptops() {
  const generated = [];

  hpModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `HP ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'HP',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Ryzen') ? `AMD ${cpu}` : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Ryzen') ? 'AMD' : 'Intel',
                ramGb: ram,
                ramType: 'DDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || (cpu.startsWith('Ryzen') ? 'AMD Radeon' : 'Intel Iris Xe'),
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['HP', model.name.includes('OMEN') ? '오멘' : model.name.includes('Spectre') ? '스펙터' : model.name.includes('ENVY') ? '엔비' : model.name.includes('Victus') ? '빅터스' : 'HP노트북'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// ===== Dell =====
const dellModels = [
  { name: 'XPS 16 9640', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060', null], ramOptions: [32, 64], storageOptions: [512, 1000, 2000], basePrice: 2890000, category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 16.3, displayType: 'OLED', resolution: '3456x2160', refresh: 120, weight: 2.3, battery: 99 },
  { name: 'XPS 15 9530', years: [2023], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4050', null], ramOptions: [16, 32, 64], storageOptions: [512, 1000, 2000], basePrice: 2390000, category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 15.6, displayType: 'OLED', resolution: '3456x2160', refresh: 60, weight: 1.86, battery: 86 },
  { name: 'XPS 15 9520', years: [2022], cpus: ['i9', 'i7'], gpus: ['RTX3050Ti', 'RTX3050', null], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2090000, category: '프리미엄', useCases: ['video-editing', 'developer'], displayInch: 15.6, displayType: 'OLED', resolution: '3456x2160', refresh: 60, weight: 1.86, battery: 86 },
  { name: 'XPS 14 9440', years: [2024], cpus: ['i7', 'i5'], gpus: [null], ramOptions: [16, 32, 64], storageOptions: [512, 1000], basePrice: 2190000, category: '프리미엄', useCases: ['developer', 'office', 'content-creation'], displayInch: 14.5, displayType: 'OLED', resolution: '3200x2000', refresh: 120, weight: 1.69, battery: 69 },
  { name: 'XPS 13 Plus 9320', years: [2022, 2023], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1790000, category: '프리미엄', useCases: ['developer', 'office', 'travel'], displayInch: 13.4, displayType: 'OLED', resolution: '3456x2160', refresh: 60, weight: 1.24, battery: 55 },
  { name: 'XPS 13 9340', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1690000, category: '프리미엄', useCases: ['developer', 'office', 'travel'], displayInch: 13.4, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.17, battery: 55 },
  { name: 'XPS 13 9315', years: [2022, 2023], cpus: ['i7', 'i5'], ramOptions: [8, 16, 32], storageOptions: [256, 512, 1000], basePrice: 1490000, category: '프리미엄', useCases: ['developer', 'office', 'travel'], displayInch: 13.4, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.17, battery: 51 },
  { name: 'Inspiron 16 Plus 7630', years: [2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4060', 'RTX4050', null], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1390000, category: '일반', useCases: ['developer', 'office', 'content-creation'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 2.06, battery: 86 },
  { name: 'Inspiron 15 3530', years: [2023, 2024], cpus: ['i7', 'i5', 'i3'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 690000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.85, battery: 54 },
  { name: 'Inspiron 14 5430', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '일반', useCases: ['student', 'office'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.54, battery: 54 },
  { name: 'Latitude 5540', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16, 32], storageOptions: [256, 512], basePrice: 1390000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.66, battery: 58 },
  { name: 'Latitude 5440', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16, 32], storageOptions: [256, 512], basePrice: 1290000, category: '비즈니스', useCases: ['office', 'developer'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.44, battery: 54 },
  { name: 'Latitude 7440', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [256, 512, 1000], basePrice: 1790000, category: '비즈니스', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.27, battery: 57 },
  { name: 'Alienware m18 R2', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [32, 64], storageOptions: [1000, 2000, 4000], basePrice: 3590000, category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 18, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 4.04, battery: 97 },
  { name: 'Alienware m16 R2', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4080', 'RTX4070', 'RTX4060'], ramOptions: [16, 32], storageOptions: [512, 1000, 2000], basePrice: 2590000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.98, battery: 90 },
  { name: 'Alienware x16 R2', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 3290000, category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 16, displayType: 'OLED', resolution: '2560x1600', refresh: 240, weight: 2.69, battery: 99 },
  { name: 'G16 7630', years: [2023, 2024], cpus: ['i9', 'i7', 'i5'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1490000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 2.68, battery: 86 },
  { name: 'G15 5530', years: [2023], cpus: ['i7', 'i5'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [16], storageOptions: [512, 1000], basePrice: 1290000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 120, weight: 2.52, battery: 86 },
];

function generateDellLaptops() {
  const generated = [];

  dellModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `Dell ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'Dell',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: 'Intel',
                ramGb: ram,
                ramType: 'DDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || 'Intel Iris Xe',
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['델', 'Dell', model.name.includes('XPS') ? 'XPS' : model.name.includes('Alienware') ? '에일리언웨어' : model.name.includes('Latitude') ? '래티튜드' : '인스피론'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// ===== ASUS =====
const asusModels = [
  { name: 'ZenBook 14 OLED UX3405', years: [2024], cpus: ['i9', 'i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1590000, category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.28, battery: 75 },
  { name: 'ZenBook 14 OLED UX3402', years: [2023], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1290000, category: '프리미엄', useCases: ['office', 'developer', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.39, battery: 75 },
  { name: 'ZenBook Pro 14 OLED', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060', null], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2190000, category: '프리미엄', useCases: ['video-editing', 'developer', '3d-modeling'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.6, battery: 76 },
  { name: 'ZenBook S 13 OLED', years: [2023, 2024], cpus: ['Ryzen 7', 'Ryzen 5', 'i7'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1590000, category: '프리미엄', useCases: ['travel', 'office', 'developer'], displayInch: 13.3, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 1.0, battery: 63 },
  { name: 'ZenBook Duo 14', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4050', null], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2390000, category: '프리미엄', useCases: ['developer', 'content-creation', 'video-editing'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.65, battery: 75 },
  { name: 'Vivobook 16 OLED', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '가성비', useCases: ['student', 'office'], displayInch: 16, displayType: 'OLED', resolution: '1920x1200', refresh: 60, weight: 1.88, battery: 50 },
  { name: 'Vivobook 15 OLED', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'OLED', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 50 },
  { name: 'Vivobook Pro 15 OLED', years: [2023, 2024], cpus: ['i9', 'i7', 'Ryzen 9', 'Ryzen 7'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1490000, category: '프리미엄', useCases: ['video-editing', 'developer', 'graphic-design'], displayInch: 15.6, displayType: 'OLED', resolution: '2880x1620', refresh: 120, weight: 1.8, battery: 70 },
  { name: 'Vivobook S 14 OLED', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7'], ramOptions: [16], storageOptions: [512, 1000], basePrice: 1190000, category: '일반', useCases: ['student', 'office', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.5, battery: 70 },
  { name: 'ROG Zephyrus G16', years: [2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070', 'RTX4060'], ramOptions: [16, 32], storageOptions: [512, 1000, 2000], basePrice: 2590000, category: '게이밍', useCases: ['gaming', 'developer', 'content-creation'], displayInch: 16, displayType: 'OLED', resolution: '2560x1600', refresh: 240, weight: 2.2, battery: 90 },
  { name: 'ROG Zephyrus G14', years: [2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7'], gpus: ['RTX4090', 'RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1990000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2560x1600', refresh: 165, weight: 1.72, battery: 76 },
  { name: 'ROG Strix G16', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4080', 'RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1790000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 2.5, battery: 90 },
  { name: 'ROG Strix G15', years: [2022, 2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7', 'i7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050', 'RTX3060'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1490000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.3, battery: 90 },
  { name: 'ROG Flow X13', years: [2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1990000, category: '게이밍', useCases: ['gaming', 'travel', 'content-creation'], displayInch: 13.4, displayType: 'OLED', resolution: '2560x1600', refresh: 165, weight: 1.35, battery: 75 },
  { name: 'TUF Gaming A16', years: [2024], cpus: ['Ryzen 9', 'Ryzen 7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1390000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, weight: 2.2, battery: 90 },
  { name: 'TUF Gaming A15', years: [2022, 2023, 2024], cpus: ['Ryzen 9', 'Ryzen 7', 'Ryzen 5'], gpus: ['RTX4070', 'RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 90 },
  { name: 'TUF Gaming F15', years: [2022, 2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 90 },
  { name: 'ExpertBook B9 OLED', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2190000, category: '비즈니스', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 60, weight: 0.99, battery: 63 },
];

function generateASUSLaptops() {
  const generated = [];

  asusModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `ASUS ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'ASUS',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Ryzen') ? `AMD ${cpu}` : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Ryzen') ? 'AMD' : 'Intel',
                ramGb: ram,
                ramType: 'DDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || (cpu.startsWith('Ryzen') ? 'AMD Radeon' : 'Intel Iris Xe'),
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['에이수스', 'ASUS', model.name.includes('ZenBook') ? '젠북' : model.name.includes('ROG') ? 'ROG' : model.name.includes('TUF') ? 'TUF' : '비보북'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// ===== Acer =====
const acerModels = [
  { name: 'Swift Go 14', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512, 1000], basePrice: 1090000, category: '프리미엄', useCases: ['office', 'student'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.25, battery: 65 },
  { name: 'Swift X 14', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7'], gpus: ['RTX4050', 'RTX3050'], ramOptions: [16], storageOptions: [512, 1000], basePrice: 1390000, category: '프리미엄', useCases: ['developer', 'content-creation'], displayInch: 14.5, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.63, battery: 76 },
  { name: 'Swift 14 OLED', years: [2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1490000, category: '프리미엄', useCases: ['office', 'travel', 'developer'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 90, weight: 1.2, battery: 65 },
  { name: 'Aspire 5', years: [2022, 2023, 2024], cpus: ['i7', 'i5', 'i3', 'Ryzen 7', 'Ryzen 5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 690000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.8, battery: 50 },
  { name: 'Aspire 3', years: [2022, 2023, 2024], cpus: ['i5', 'i3', 'Ryzen 5', 'Ryzen 3'], ramOptions: [8], storageOptions: [256, 512], basePrice: 490000, category: '가성비', useCases: ['student', 'office'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.9, battery: 45 },
  { name: 'Aspire Vero', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '일반', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.8, battery: 57 },
  { name: 'Predator Helios 16', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [16, 32], storageOptions: [512, 1000, 2000], basePrice: 2590000, category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.5, battery: 90 },
  { name: 'Predator Helios Neo 16', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1790000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 165, weight: 2.55, battery: 76 },
  { name: 'Nitro 5', years: [2021, 2022, 2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7', 'Ryzen 5'], gpus: ['RTX4060', 'RTX4050', 'RTX3060', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.2, battery: 57 },
  { name: 'Nitro 16', years: [2023, 2024], cpus: ['i7', 'i5', 'Ryzen 7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1290000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, weight: 2.5, battery: 90 },
  { name: 'Nitro V 15', years: [2024], cpus: ['i5', 'Ryzen 5'], gpus: ['RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.1, battery: 57 },
];

function generateAcerLaptops() {
  const generated = [];

  acerModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `Acer ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'Acer',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: cpu.startsWith('Ryzen') ? `AMD ${cpu}` : `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: cpu.startsWith('Ryzen') ? 'AMD' : 'Intel',
                ramGb: ram,
                ramType: 'DDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || (cpu.startsWith('Ryzen') ? 'AMD Radeon' : 'Intel Iris Xe'),
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['에이서', 'Acer', model.name.includes('Swift') ? '스위프트' : model.name.includes('Predator') ? '프레데터' : model.name.includes('Nitro') ? '니트로' : '아스파이어'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// ===== MSI =====
const msiModels = [
  { name: 'Stealth 16 Studio', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4090', 'RTX4080', 'RTX4070'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 3290000, category: '게이밍', useCases: ['gaming', '3d-modeling', 'video-editing'], displayInch: 16, displayType: 'OLED', resolution: '3840x2400', refresh: 240, weight: 2.0, battery: 99 },
  { name: 'Stealth 14 Studio', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2390000, category: '게이밍', useCases: ['gaming', 'developer', 'travel'], displayInch: 14, displayType: 'OLED', resolution: '2880x1800', refresh: 120, weight: 1.7, battery: 72 },
  { name: 'Raider GE78 HX', years: [2023, 2024], cpus: ['i9'], gpus: ['RTX4090', 'RTX4080'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 4290000, category: '게이밍', useCases: ['gaming', '3d-modeling'], displayInch: 17, displayType: 'Mini LED', resolution: '2560x1600', refresh: 240, weight: 3.1, battery: 99 },
  { name: 'Raider GE68 HX', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4080', 'RTX4070', 'RTX4060'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 2790000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 240, weight: 2.7, battery: 90 },
  { name: 'Vector GP77 13V', years: [2023], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1890000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 17.3, displayType: 'IPS', resolution: '2560x1440', refresh: 240, weight: 2.8, battery: 65 },
  { name: 'Vector GP68 12V', years: [2023], cpus: ['i7'], gpus: ['RTX4060', 'RTX4050'], ramOptions: [16], storageOptions: [512, 1000], basePrice: 1490000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 16, displayType: 'IPS', resolution: '1920x1200', refresh: 165, weight: 2.4, battery: 53 },
  { name: 'Katana 17 B13V', years: [2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4070', 'RTX4060', 'RTX4050'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1390000, category: '게이밍', useCases: ['gaming', 'developer'], displayInch: 17.3, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.6, battery: 53 },
  { name: 'Katana 15 B13V', years: [2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4070', 'RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 1090000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 2.25, battery: 53 },
  { name: 'Cyborg 15 A12V', years: [2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4060', 'RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 990000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 1.98, battery: 53 },
  { name: 'Thin 15 B12U', years: [2023, 2024], cpus: ['i7', 'i5'], gpus: ['RTX4050', 'RTX3050'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 890000, category: '게이밍', useCases: ['gaming', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 144, weight: 1.86, battery: 53 },
  { name: 'Prestige 14 Evo', years: [2023, 2024], cpus: ['i7', 'i5'], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1590000, category: '프리미엄', useCases: ['office', 'developer', 'travel'], displayInch: 14, displayType: 'IPS', resolution: '1920x1200', refresh: 60, weight: 1.4, battery: 72 },
  { name: 'Prestige 16 Evo', years: [2023, 2024], cpus: ['i7'], gpus: ['RTX4060', 'RTX4050', null], ramOptions: [16, 32], storageOptions: [512, 1000], basePrice: 1890000, category: '프리미엄', useCases: ['office', 'developer', 'content-creation'], displayInch: 16, displayType: 'IPS', resolution: '2560x1600', refresh: 60, weight: 1.9, battery: 82 },
  { name: 'Creator Z16 HX Studio', years: [2023, 2024], cpus: ['i9', 'i7'], gpus: ['RTX4070', 'RTX4060'], ramOptions: [32, 64], storageOptions: [1000, 2000], basePrice: 3490000, category: '프리미엄', useCases: ['video-editing', '3d-modeling', 'graphic-design'], displayInch: 16, displayType: 'Mini LED', resolution: '3840x2400', refresh: 120, weight: 2.4, battery: 90 },
  { name: 'Modern 14 C12M', years: [2023, 2024], cpus: ['i7', 'i5', 'i3'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000, category: '가성비', useCases: ['office', 'student'], displayInch: 14, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.4, battery: 46 },
  { name: 'Modern 15 B13M', years: [2023, 2024], cpus: ['i7', 'i5', 'i3'], ramOptions: [8, 16], storageOptions: [256, 512], basePrice: 790000, category: '가성비', useCases: ['office', 'student'], displayInch: 15.6, displayType: 'IPS', resolution: '1920x1080', refresh: 60, weight: 1.7, battery: 53 },
];

function generateMSILaptops() {
  const generated = [];

  msiModels.forEach(model => {
    const gpuList = model.gpus || [null];

    model.years.forEach(year => {
      model.cpus.forEach(cpu => {
        gpuList.forEach(gpu => {
          model.ramOptions.forEach(ram => {
            model.storageOptions.forEach(storage => {
              const newPrice = calculateGenericPrice(model.basePrice, cpu, gpu, ram, storage);
              const usedPrice = calculateUsedPrice(newPrice, year);

              const gpuStr = gpu ? ` ${gpu}` : '';
              const fullName = `MSI ${model.name} ${year} ${cpu}${gpuStr} ${ram}GB ${storage >= 1000 ? (storage/1000) + 'TB' : storage + 'GB'}`;
              const slug = createSlug(fullName) + '-' + id;

              generated.push({
                id: String(id++),
                brand: 'MSI',
                model: `${cpu}${gpuStr} ${ram}GB`,
                fullName,
                slug,
                year,
                cpu: `Intel Core ${cpu}`,
                cpuSeries: cpu,
                cpuBrand: 'Intel',
                ramGb: ram,
                ramType: 'DDR5',
                storageGb: storage,
                storageType: 'SSD',
                gpu: gpu || 'Intel Iris Xe',
                gpuType: gpu ? '외장' : '내장',
                displayInch: model.displayInch,
                displayType: model.displayType,
                displayResolution: model.resolution,
                displayRefreshRate: model.refresh,
                weightKg: model.weight,
                batteryWh: model.battery,
                os: 'Windows 11',
                priceKrw: usedPrice,
                category: model.category,
                useCases: model.useCases,
                tags: ['MSI', model.name.includes('Stealth') ? '스텔스' : model.name.includes('Raider') ? '레이더' : model.name.includes('Katana') ? '카타나' : 'MSI노트북'],
                metaTitle: `${fullName} 중고 가격, 스펙 비교`,
                metaDescription: `${fullName} 중고 가격 ${Math.round(usedPrice/10000)}만원. ${model.category} 노트북.`
              });
            });
          });
        });
      });
    });
  });

  return generated;
}

// 일반 가격 계산 함수
function calculateGenericPrice(basePrice, cpu, gpu, ram, storage) {
  let price = basePrice;

  // CPU 보정
  if (cpu === 'i9' || cpu === 'Ryzen 9') price += 400000;
  else if (cpu === 'i7' || cpu === 'Ryzen 7') price += 200000;
  else if (cpu === 'i3' || cpu === 'Ryzen 3') price -= 100000;

  // GPU 보정
  if (gpu) {
    if (gpu.includes('4090')) price += 800000;
    else if (gpu.includes('4080')) price += 600000;
    else if (gpu.includes('4070')) price += 400000;
    else if (gpu.includes('4060')) price += 300000;
    else if (gpu.includes('4050')) price += 200000;
    else if (gpu.includes('3070')) price += 300000;
    else if (gpu.includes('3060')) price += 200000;
    else if (gpu.includes('3050')) price += 100000;
  }

  // RAM 보정
  if (ram > 16) price += (ram - 16) * 15000;
  else if (ram < 16) price -= (16 - ram) * 10000;

  // Storage 보정
  if (storage > 512) price += (storage - 512) * 250;
  else if (storage < 512) price -= (512 - storage) * 200;

  return Math.max(price, 400000);
}

// 모든 노트북 생성
const appleLaptops = generateAppleLaptops();
const samsungLaptops = generateSamsungLaptops();
const lgLaptops = generateLGLaptops();
const lenovoLaptops = generateLenovoLaptops();
const hpLaptops = generateHPLaptops();
const dellLaptops = generateDellLaptops();
const asusLaptops = generateASUSLaptops();
const acerLaptops = generateAcerLaptops();
const msiLaptops = generateMSILaptops();

laptops.push(...appleLaptops, ...samsungLaptops, ...lgLaptops, ...lenovoLaptops, ...hpLaptops, ...dellLaptops, ...asusLaptops, ...acerLaptops, ...msiLaptops);

// JSON 파일로 저장
fs.writeFileSync('./data/laptops.json', JSON.stringify(laptops, null, 2), 'utf-8');

console.log(`총 ${laptops.length}개 노트북 생성 완료!`);
console.log(`- Apple: ${appleLaptops.length}개`);
console.log(`- Samsung: ${samsungLaptops.length}개`);
console.log(`- LG: ${lgLaptops.length}개`);
console.log(`- Lenovo: ${lenovoLaptops.length}개`);
console.log(`- HP: ${hpLaptops.length}개`);
console.log(`- Dell: ${dellLaptops.length}개`);
console.log(`- ASUS: ${asusLaptops.length}개`);
console.log(`- Acer: ${acerLaptops.length}개`);
console.log(`- MSI: ${msiLaptops.length}개`);
