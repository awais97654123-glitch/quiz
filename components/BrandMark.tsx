'use client';

/**
 * Custom animated CodeQuiz brand mark.
 * A rounded hexagon "chip" holding a code-bracket + spark glyph.
 * `animated` drives the intro draw/pop used on the boarding splash;
 * without it the mark is static for navbar/footer usage.
 */
export function BrandMark({
  size = 40,
  animated = false,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="CodeQuiz logo"
    >
      <defs>
        <linearGradient id="cq-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0891b2" />
          <stop offset="0.55" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="cq-stroke" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>

      {/* Chip body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="16"
        fill="url(#cq-grad)"
        className={animated ? 'brand-badge-pop' : ''}
      />
      <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#cq-grad)" opacity="0.0" />

      {/* Left bracket */}
      <path
        d="M26 22 L17 32 L26 42"
        stroke="url(#cq-stroke)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'brand-stroke' : ''}
        style={animated ? ({ '--dash': 44 } as React.CSSProperties) : undefined}
      />
      {/* Right bracket */}
      <path
        d="M38 22 L47 32 L38 42"
        stroke="url(#cq-stroke)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'brand-stroke' : ''}
        style={animated ? ({ '--dash': 44, animationDelay: '0.12s' } as React.CSSProperties) : undefined}
      />
      {/* Center spark / question slash */}
      <path
        d="M35 20 L29 44"
        stroke="url(#cq-stroke)"
        strokeWidth="3.4"
        strokeLinecap="round"
        className={animated ? 'brand-stroke' : ''}
        style={animated ? ({ '--dash': 26, animationDelay: '0.24s' } as React.CSSProperties) : undefined}
      />
      {/* Spark dot */}
      <circle
        cx="46"
        cy="18"
        r="3.2"
        fill="#ffffff"
        className={animated ? 'brand-spark' : ''}
      />
    </svg>
  );
}
