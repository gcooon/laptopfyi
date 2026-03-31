"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Laptop } from "@/types/laptop";

interface CompareSelectorProps {
  laptops: Laptop[];
  initialLaptop1?: string;
  initialLaptop2?: string;
}

export default function CompareSelector({
  laptops,
  initialLaptop1 = "",
  initialLaptop2 = "",
}: CompareSelectorProps) {
  const router = useRouter();
  const [laptop1, setLaptop1] = useState(initialLaptop1);
  const [laptop2, setLaptop2] = useState(initialLaptop2);

  const handleCompare = () => {
    if (laptop1 && laptop2 && laptop1 !== laptop2) {
      const slugs = [laptop1, laptop2].sort();
      router.push(`/compare/${slugs[0]}-vs-${slugs[1]}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Laptop 1 Selector */}
        <div>
          <label
            htmlFor="laptop1"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            첫 번째 노트북
          </label>
          <select
            id="laptop1"
            value={laptop1}
            onChange={(e) => setLaptop1(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">노트북 선택...</option>
            {laptops.map((laptop) => (
              <option
                key={laptop.id}
                value={laptop.slug}
                disabled={laptop.slug === laptop2}
              >
                {laptop.fullName} ({formatPrice(laptop.priceKrw)})
              </option>
            ))}
          </select>
        </div>

        {/* Laptop 2 Selector */}
        <div>
          <label
            htmlFor="laptop2"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            두 번째 노트북
          </label>
          <select
            id="laptop2"
            value={laptop2}
            onChange={(e) => setLaptop2(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">노트북 선택...</option>
            {laptops.map((laptop) => (
              <option
                key={laptop.id}
                value={laptop.slug}
                disabled={laptop.slug === laptop1}
              >
                {laptop.fullName} ({formatPrice(laptop.priceKrw)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Compare Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleCompare}
          disabled={!laptop1 || !laptop2 || laptop1 === laptop2}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          비교하기
        </button>
      </div>
    </div>
  );
}
