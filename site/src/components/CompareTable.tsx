import type { Laptop } from "@/types/laptop";
import Link from "next/link";

interface CompareTableProps {
  laptop1: Laptop;
  laptop2: Laptop;
}

type CompareResult = "better" | "worse" | "equal";

function compareValues(
  val1: number,
  val2: number,
  higherIsBetter: boolean = true
): CompareResult {
  if (val1 === val2) return "equal";
  if (higherIsBetter) {
    return val1 > val2 ? "better" : "worse";
  }
  return val1 < val2 ? "better" : "worse";
}

function getResultClass(result: CompareResult): string {
  switch (result) {
    case "better":
      return "text-green-600 font-semibold";
    case "worse":
      return "text-gray-500";
    default:
      return "text-gray-900";
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export default function CompareTable({ laptop1, laptop2 }: CompareTableProps) {
  const specs = [
    {
      label: "가격",
      value1: formatPrice(laptop1.priceKrw),
      value2: formatPrice(laptop2.priceKrw),
      result1: compareValues(laptop1.priceKrw, laptop2.priceKrw, false),
      result2: compareValues(laptop2.priceKrw, laptop1.priceKrw, false),
    },
    {
      label: "CPU",
      value1: laptop1.cpu,
      value2: laptop2.cpu,
      result1: "equal" as CompareResult,
      result2: "equal" as CompareResult,
    },
    {
      label: "RAM",
      value1: `${laptop1.ramGb}GB`,
      value2: `${laptop2.ramGb}GB`,
      result1: compareValues(laptop1.ramGb, laptop2.ramGb),
      result2: compareValues(laptop2.ramGb, laptop1.ramGb),
    },
    {
      label: "저장공간",
      value1: `${laptop1.storageGb}GB ${laptop1.storageType}`,
      value2: `${laptop2.storageGb}GB ${laptop2.storageType}`,
      result1: compareValues(laptop1.storageGb, laptop2.storageGb),
      result2: compareValues(laptop2.storageGb, laptop1.storageGb),
    },
    {
      label: "디스플레이",
      value1: `${laptop1.displayInch}" ${laptop1.displayType}`,
      value2: `${laptop2.displayInch}" ${laptop2.displayType}`,
      result1: compareValues(laptop1.displayInch, laptop2.displayInch),
      result2: compareValues(laptop2.displayInch, laptop1.displayInch),
    },
    {
      label: "해상도",
      value1: laptop1.displayResolution,
      value2: laptop2.displayResolution,
      result1: "equal" as CompareResult,
      result2: "equal" as CompareResult,
    },
    {
      label: "주사율",
      value1: laptop1.displayRefreshRate
        ? `${laptop1.displayRefreshRate}Hz`
        : "-",
      value2: laptop2.displayRefreshRate
        ? `${laptop2.displayRefreshRate}Hz`
        : "-",
      result1: compareValues(
        laptop1.displayRefreshRate || 60,
        laptop2.displayRefreshRate || 60
      ),
      result2: compareValues(
        laptop2.displayRefreshRate || 60,
        laptop1.displayRefreshRate || 60
      ),
    },
    {
      label: "GPU",
      value1: laptop1.gpu,
      value2: laptop2.gpu,
      result1: "equal" as CompareResult,
      result2: "equal" as CompareResult,
    },
    {
      label: "GPU 타입",
      value1: laptop1.gpuType,
      value2: laptop2.gpuType,
      result1: "equal" as CompareResult,
      result2: "equal" as CompareResult,
    },
    {
      label: "배터리",
      value1: laptop1.batteryWh ? `${laptop1.batteryWh}Wh` : "-",
      value2: laptop2.batteryWh ? `${laptop2.batteryWh}Wh` : "-",
      result1: compareValues(laptop1.batteryWh || 0, laptop2.batteryWh || 0),
      result2: compareValues(laptop2.batteryWh || 0, laptop1.batteryWh || 0),
    },
    {
      label: "무게",
      value1: `${laptop1.weightKg}kg`,
      value2: `${laptop2.weightKg}kg`,
      result1: compareValues(laptop1.weightKg, laptop2.weightKg, false),
      result2: compareValues(laptop2.weightKg, laptop1.weightKg, false),
    },
    {
      label: "OS",
      value1: laptop1.os,
      value2: laptop2.os,
      result1: "equal" as CompareResult,
      result2: "equal" as CompareResult,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50">
        <div className="p-4"></div>
        <div className="border-l border-gray-200 p-4 text-center">
          <Link
            href={`/laptops/${laptop1.slug}`}
            className="font-semibold text-gray-900 hover:text-blue-600"
          >
            {laptop1.fullName}
          </Link>
          <p className="mt-1 text-sm text-gray-500">{laptop1.brand}</p>
        </div>
        <div className="border-l border-gray-200 p-4 text-center">
          <Link
            href={`/laptops/${laptop2.slug}`}
            className="font-semibold text-gray-900 hover:text-blue-600"
          >
            {laptop2.fullName}
          </Link>
          <p className="mt-1 text-sm text-gray-500">{laptop2.brand}</p>
        </div>
      </div>

      {/* Specs */}
      {specs.map((spec, index) => (
        <div
          key={spec.label}
          className={`grid grid-cols-3 ${index !== specs.length - 1 ? "border-b border-gray-100" : ""}`}
        >
          <div className="bg-gray-50 p-4 font-medium text-gray-700">
            {spec.label}
          </div>
          <div
            className={`border-l border-gray-100 p-4 text-center ${getResultClass(spec.result1)}`}
          >
            {spec.value1}
          </div>
          <div
            className={`border-l border-gray-100 p-4 text-center ${getResultClass(spec.result2)}`}
          >
            {spec.value2}
          </div>
        </div>
      ))}

      {/* CTA Buttons */}
      <div className="grid grid-cols-3 border-t border-gray-200 bg-gray-50">
        <div className="p-4"></div>
        <div className="border-l border-gray-200 p-4 text-center">
          <a
            href="https://refurlab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            중고 매물 보기
          </a>
        </div>
        <div className="border-l border-gray-200 p-4 text-center">
          <a
            href="https://refurlab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            중고 매물 보기
          </a>
        </div>
      </div>
    </div>
  );
}
