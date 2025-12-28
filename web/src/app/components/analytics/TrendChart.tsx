interface DataPoint {
  date: string;
  amount: number;
}

interface TrendChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export default function TrendChart({
  data,
  color = "#8b5cf6",
  height = 200,
}: TrendChartProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.amount));
  const min = Math.min(...data.map((d) => d.amount));
  const range = max - min || 1;
  const padding = 20;

  const width = 800; // Viewbox width
  const effectiveHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((d.amount - min) / range) * effectiveHeight;
    return { x, y };
  });

  const linePath = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${
    points[0].x
  } ${height} Z`;

  return (
    <div className="w-full h-full min-h-[200px] relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Support Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <line
            key={v}
            x1="0"
            y1={padding + v * effectiveHeight}
            x2={width}
            y2={padding + v * effectiveHeight}
            className="stroke-border/30"
            strokeWidth="1"
          />
        ))}

        <path
          d={areaPath}
          fill="url(#gradient)"
          className="transition-all duration-500"
        />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {/* Highlight points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#fff"
            stroke={color}
            strokeWidth="2"
            className="opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          />
        ))}
      </svg>
    </div>
  );
}
