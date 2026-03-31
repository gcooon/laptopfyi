"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  activeNav?: "laptops" | "compare" | "brand" | "use-case" | "glossary";
}

export default function Header({ activeNav }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/laptops", label: "노트북", key: "laptops" },
    { href: "/compare", label: "비교하기", key: "compare" },
    { href: "/brand", label: "브랜드", key: "brand" },
    { href: "/use-case", label: "용도별", key: "use-case" },
    { href: "/glossary", label: "용어사전", key: "glossary" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu Button + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button - Left side */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? (
                // X icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="text-xl font-bold text-gray-900">
                Laptop<span className="text-blue-600">FYI</span>
              </span>
            </Link>
          </div>

          {/* Right: Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={
                  activeNav === item.key
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-1 pt-4 pb-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  activeNav === item.key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Search Link for Mobile */}
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              검색
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
