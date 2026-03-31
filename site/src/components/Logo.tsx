interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Laptop screen - L shape */}
      <rect
        x="4"
        y="6"
        width="32"
        height="26"
        rx="3"
        fill="#2563EB"
      />
      {/* L letter inside */}
      <path
        d="M12 14V28H24V24H16V14H12Z"
        fill="white"
      />
      {/* Laptop base */}
      <path
        d="M2 36C2 34.8954 2.89543 34 4 34H44C45.1046 34 46 34.8954 46 36V38C46 40.2091 44.2091 42 42 42H6C3.79086 42 2 40.2091 2 38V36Z"
        fill="#1E40AF"
      />
      {/* Touchpad hint */}
      <rect
        x="18"
        y="36"
        width="12"
        height="4"
        rx="1"
        fill="#3B82F6"
      />
    </svg>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={32} />
      <span className="text-xl font-bold text-gray-900">
        Laptop<span className="text-blue-600">FYI</span>
      </span>
    </div>
  );
}
