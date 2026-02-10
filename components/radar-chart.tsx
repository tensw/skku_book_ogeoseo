"use client"

interface RadarDataPoint {
  label: string
  value: number
  shortLabel: string
}

export function KDCRadarChart({ data }: { data: RadarDataPoint[] }) {
  const size = 260
  const center = size / 2
  const maxRadius = 100
  const levels = 5

  const angleStep = (2 * Math.PI) / data.length

  function polarToCartesian(angle: number, radius: number) {
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2),
    }
  }

  // Grid lines
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * maxRadius
    return data
      .map((_, idx) => {
        const p = polarToCartesian(idx * angleStep, r)
        return `${p.x},${p.y}`
      })
      .join(" ")
  })

  // Axis lines
  const axes = data.map((_, idx) => {
    const p = polarToCartesian(idx * angleStep, maxRadius)
    return { x1: center, y1: center, x2: p.x, y2: p.y }
  })

  // Data polygon
  const dataPoints = data.map((d, idx) => {
    const r = (d.value / 100) * maxRadius
    const p = polarToCartesian(idx * angleStep, r)
    return `${p.x},${p.y}`
  })

  // Label positions
  const labels = data.map((d, idx) => {
    const p = polarToCartesian(idx * angleStep, maxRadius + 22)
    return { ...d, x: p.x, y: p.y }
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridLevels.map((points, i) => (
        <polygon
          key={`grid-${i}`}
          points={points}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          opacity={0.6}
        />
      ))}

      {/* Axes */}
      {axes.map((axis, i) => (
        <line
          key={`axis-${i}`}
          x1={axis.x1}
          y1={axis.y1}
          x2={axis.x2}
          y2={axis.y2}
          stroke="hsl(var(--border))"
          strokeWidth="0.5"
          opacity={0.4}
        />
      ))}

      {/* Data area */}
      <polygon
        points={dataPoints.join(" ")}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
      />

      {/* Data points */}
      {data.map((d, idx) => {
        const r = (d.value / 100) * maxRadius
        const p = polarToCartesian(idx * angleStep, r)
        return (
          <circle
            key={`point-${d.shortLabel}`}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#064E3B"
            stroke="hsl(var(--card))"
            strokeWidth="2"
          />
        )
      })}

      {/* Labels */}
      {labels.map((label) => (
        <text
          key={`label-${label.shortLabel}`}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground"
          fontSize="8"
          fontWeight="600"
        >
          {label.shortLabel}
        </text>
      ))}
    </svg>
  )
}
