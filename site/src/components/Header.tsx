import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  activeNav?: "laptops" | "compare" | "brand" | "use-case" | "glossary";
}

export default function Header({ activeNav }: HeaderProps) {
  const navItems = [
    { href: "/laptops", label: "노트북", key: "laptops" },
    { href: "/compare", label: "비교하기", key: "compare" },
    { href: "/brand", label: "브랜드", key: "brand" },
    { href: "/use-case", label: "용도별", key: "use-case" },
    { href: "/glossary", label: "용어사전", key: "glossary" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-gray-900">
              Laptop<span className="text-blue-600">FYI</span>
            </span>
          </Link>
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
      </div>
    </header>
  );
}
