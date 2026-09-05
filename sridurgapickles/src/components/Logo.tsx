interface LogoProps {
  className?: string;
}

export function Logo({ className = 'h-12 w-12' }: LogoProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative ring */}
      <circle cx="60" cy="60" r="58" fill="#7c2d12" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.5" />

      {/* Halo / sun rays behind goddess */}
      <g opacity="0.3">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 60 + Math.cos(angle) * 28;
          const y1 = 60 + Math.sin(angle) * 28;
          const x2 = 60 + Math.cos(angle) * 44;
          const y2 = 60 + Math.sin(angle) * 44;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1.5" />;
        })}
      </g>
      <circle cx="60" cy="44" r="24" fill="#fbbf24" opacity="0.15" />

      {/* Crown */}
      <path d="M50 24 L60 14 L70 24 L66 27 L60 20 L54 27 Z" fill="#fbbf24" />
      <circle cx="60" cy="14" r="2" fill="#fde68a" />

      {/* Head */}
      <circle cx="60" cy="34" r="7" fill="#fde68a" />

      {/* Hair / shoulders */}
      <path d="M52 38 Q60 36 68 38 L70 42 Q60 40 50 42 Z" fill="#92400e" />

      {/* Body / sari - red and orange */}
      <path d="M52 42 Q60 40 68 42 L72 68 Q60 72 48 68 Z" fill="#dc2626" />
      <path d="M52 42 Q60 40 68 42 L70 60 Q60 62 50 60 Z" fill="#f97316" />
      {/* Sari border detail */}
      <path d="M52 42 Q60 40 68 42 L68 46 Q60 48 52 46 Z" fill="#fbbf24" opacity="0.6" />

      {/* Multiple arms (Durga has many) */}
      {/* Left arms */}
      <line x1="52" y1="46" x2="40" y2="38" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="50" x2="38" y2="50" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="52" y1="54" x2="40" y2="60" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Right arms */}
      <line x1="68" y1="46" x2="80" y2="38" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="50" x2="82" y2="50" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="54" x2="80" y2="60" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Trident in top hand */}
      <line x1="60" y1="42" x2="60" y2="14" stroke="#fbbf24" strokeWidth="2" />
      <path d="M56 16 L60 10 L64 16" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <line x1="58" y1="14" x2="58" y2="10" stroke="#fbbf24" strokeWidth="1.5" />
      <line x1="62" y1="14" x2="62" y2="10" stroke="#fbbf24" strokeWidth="1.5" />

      {/* Small weapons in other hands */}
      <circle cx="40" cy="38" r="2" fill="#fbbf24" />
      <circle cx="80" cy="38" r="2" fill="#fbbf24" />
      <circle cx="38" cy="50" r="2" fill="#fbbf24" />
      <circle cx="82" cy="50" r="2" fill="#fbbf24" />

      {/* Lotus base */}
      <path d="M44 70 Q60 66 76 70 Q72 80 60 80 Q48 80 44 70 Z" fill="#f97316" />
      <path d="M48 72 Q60 69 72 72" fill="none" stroke="#fbbf24" strokeWidth="1" />
      {/* Lotus petals */}
      <path d="M50 70 Q52 76 56 74" fill="none" stroke="#fbbf24" strokeWidth="1" />
      <path d="M60 70 Q60 78 60 78" fill="none" stroke="#fbbf24" strokeWidth="1" />
      <path d="M70 70 Q68 76 64 74" fill="none" stroke="#fbbf24" strokeWidth="1" />

      {/* Decorative dots */}
      <circle cx="60" cy="88" r="2.5" fill="#fbbf24" />
      <circle cx="50" cy="90" r="1.5" fill="#fbbf24" />
      <circle cx="70" cy="90" r="1.5" fill="#fbbf24" />

      {/* Shop initials */}
      <text x="60" y="102" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fbbf24" fontFamily="serif">
        SD
      </text>
    </svg>
  );
}
