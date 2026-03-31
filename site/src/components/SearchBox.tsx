"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  priceKrw: number;
  cpu: string;
  ramGb: number;
  displayInch: number;
  displayType: string;
  category: string;
}

interface SearchBoxProps {
  initialQuery?: string;
  showSuggestions?: boolean;
}

export default function SearchBox({
  initialQuery = "",
  showSuggestions = true,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 검색 API 호출
  useEffect(() => {
    if (!showSuggestions || query.length < 1) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.results.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, showSuggestions]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="노트북 모델명을 검색하세요 (예: 맥북 프로, 그램)"
            className="flex-1 rounded-l-lg px-4 py-3 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-r-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "검색"
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((laptop) => (
            <Link
              key={laptop.id}
              href={`/laptops/${laptop.slug}`}
              onClick={() => setShowDropdown(false)}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{laptop.fullName}</p>
                <p className="text-sm text-gray-500">
                  {laptop.cpu} · {laptop.ramGb}GB · {laptop.displayInch}"
                </p>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatPrice(laptop.priceKrw)}
              </span>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setShowDropdown(false)}
            className="block border-t border-gray-100 px-4 py-3 text-center text-sm text-blue-600 hover:bg-gray-50"
          >
            &quot;{query}&quot; 전체 검색 결과 보기 →
          </Link>
        </div>
      )}
    </div>
  );
}
