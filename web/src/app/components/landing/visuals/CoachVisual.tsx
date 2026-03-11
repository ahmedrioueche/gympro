interface CoachVisualProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function CoachVisual({
  primaryColor,
  secondaryColor,
  accentColor,
}: CoachVisualProps) {
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
            id="coachGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id="cardGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Dashboard/Tablet Frame */}
        <rect
          x="30"
          y="40"
          width="140"
          height="120"
          rx="12"
          stroke="url(#coachGradient)"
          strokeWidth="2"
          className="animate-pulse opacity-40"
        />
        <rect
          x="35"
          y="45"
          width="130"
          height="110"
          rx="8"
          fill="white"
          fillOpacity="0.03"
        />

        {/* 2. Success Chart (Small) */}
        <g transform="translate(45, 120)">
          <rect
            x="0"
            y="0"
            width="10"
            height="0"
            rx="2"
            fill={primaryColor}
            className="animate-bar-grow-1"
          />
          <rect
            x="15"
            y="0"
            width="10"
            height="0"
            rx="2"
            fill={primaryColor}
            className="animate-bar-grow-2"
          />
          <rect
            x="30"
            y="0"
            width="10"
            height="0"
            rx="2"
            fill={accentColor}
            className="animate-bar-grow-3"
          />
        </g>

        {/* 3. Program Builder Cards (Floating/Moving) */}
        {/* Card 1: Squat */}
        <g className="animate-card-float-slow">
          <rect
            x="110"
            y="60"
            width="50"
            height="20"
            rx="4"
            fill="white"
            fillOpacity="0.1"
            stroke={primaryColor}
            strokeWidth="1"
            filter="url(#cardGlow)"
          />
          <rect
            x="115"
            y="66"
            width="20"
            height="2"
            rx="1"
            fill={primaryColor}
          />
          <rect
            x="115"
            y="72"
            width="12"
            height="2"
            rx="1"
            fill={primaryColor}
            opacity="0.5"
          />
        </g>

        {/* Card 2: Bench Press */}
        <g className="animate-card-float-medium">
          <rect
            x="50"
            y="65"
            width="50"
            height="20"
            rx="4"
            fill="white"
            fillOpacity="0.1"
            stroke={secondaryColor}
            strokeWidth="1"
            filter="url(#cardGlow)"
          />
          <rect
            x="55"
            y="71"
            width="20"
            height="2"
            rx="1"
            fill={secondaryColor}
          />
          <rect
            x="55"
            y="77"
            width="12"
            height="2"
            rx="1"
            fill={secondaryColor}
            opacity="0.5"
          />
        </g>

        {/* Card 3: Deadlift (Connecting to "Workout") */}
        <g className="animate-card-fly-in">
          <rect
            x="80"
            y="90"
            width="60"
            height="24"
            rx="6"
            fill="url(#coachGradient)"
            filter="url(#cardGlow)"
          />
          <circle cx="92" cy="102" r="5" fill="white" fillOpacity="0.4" />
          <rect
            x="102"
            y="98"
            width="25"
            height="3"
            rx="1.5"
            fill="white"
            fillOpacity="0.8"
          />
          <rect
            x="102"
            y="105"
            width="15"
            height="2"
            rx="1"
            fill="white"
            fillOpacity="0.5"
          />
        </g>

        {/* 5. Connections / Nodes */}
        <g opacity="0.4">
          <circle cx="40" cy="140" r="3" fill={primaryColor} />
          <path
            d="M40 140 L70 125"
            stroke={primaryColor}
            strokeWidth="1"
            strokeDasharray="4 2"
          />
        </g>
      </svg>

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute size-1.5 rounded-full animate-ping"
            style={{
              backgroundColor: i % 2 === 0 ? accentColor : primaryColor,
              left: `${15 + i * 18}%`,
              top: `${80 - i * 10}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
