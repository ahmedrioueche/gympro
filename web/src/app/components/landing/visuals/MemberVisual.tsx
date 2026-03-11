interface MemberVisualProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function MemberVisual({
  primaryColor,
  secondaryColor,
  accentColor,
}: MemberVisualProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-4/5 h-4/5 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="lifterGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Legs (Connected to ground and tracking the body) */}
        <g
          className="animate-squat-legs"
          style={{ transformOrigin: "100px 175px" }}
        >
          {/* Left Leg */}
          <path
            d="M85 110 L70 145 L80 175"
            stroke={primaryColor}
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Right Leg */}
          <path
            d="M115 110 L130 145 L120 175"
            stroke={primaryColor}
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* 2. Upper Body (Moving up and down) */}
        <g className="animate-squat-upper">
          {/* Barbell - with subtle weighted bend */}
          <g className="animate-barbell-weighted">
            <path
              d="M20 80 Q100 85 180 80"
              stroke="url(#lifterGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* Left Plates */}
            <rect
              x="15"
              y="65"
              width="10"
              height="30"
              rx="3"
              fill={secondaryColor}
            />
            <rect
              x="5"
              y="70"
              width="10"
              height="20"
              rx="2"
              fill={secondaryColor}
              opacity="0.7"
            />
            {/* Right Plates */}
            <rect
              x="175"
              y="65"
              width="10"
              height="30"
              rx="3"
              fill={secondaryColor}
            />
            <rect
              x="185"
              y="70"
              width="10"
              height="20"
              rx="2"
              fill={secondaryColor}
              opacity="0.7"
            />
          </g>

          {/* Character Body */}
          <g className="animate-body-tilt">
            {/* Torso */}
            <path
              d="M88 110 L112 110 L115 75 L85 75 Z"
              fill="url(#lifterGradient)"
              opacity="0.95"
            />
            {/* Head */}
            <circle
              cx="100"
              cy="62"
              r="11"
              fill="url(#lifterGradient)"
              className="animate-head-nod"
            />

            {/* Arms */}
            <path
              d="M85 80 L65 82"
              stroke={primaryColor}
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M115 80 L135 82"
              stroke={primaryColor}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Shadow */}
        <ellipse
          cx="100"
          cy="182"
          rx="50"
          ry="6"
          fill="black"
          opacity="0.15"
          className="animate-shadow-morph"
        />
      </svg>

      {/* Background dynamic elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute blur-xl rounded-full animate-pulse"
            style={{
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
