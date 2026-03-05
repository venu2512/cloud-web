// ─── Shared shimmer skeleton block ───────────────────────────────────────────

const Shimmer = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={className}
    style={{
      background:
        "linear-gradient(90deg, rgba(0,200,255,0.04) 0%, rgba(0,200,255,0.1) 50%, rgba(0,200,255,0.04) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s ease-in-out infinite",
      borderRadius: 8,
      border: "1px solid rgba(0,200,255,0.06)",
      ...style,
    }}
  />
);

// Inject keyframes once
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

const StyleTag = () => (
  <style>{shimmerStyle}</style>
);

// ─── Card wrapper matching dark card style ────────────────────────────────────

const SkeletonCard = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={className}
    style={{
      borderRadius: 12,
      border: "1px solid rgba(0,200,255,0.08)",
      background: "rgba(4,20,40,0.6)",
      padding: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── DashboardStatsSkeleton ───────────────────────────────────────────────────

export function DashboardStatsSkeleton() {
  return (
    <>
      <StyleTag />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-center gap-3">
              {/* Icon placeholder */}
              <Shimmer style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
              <div className="flex flex-col gap-2 flex-1">
                {/* Value */}
                <Shimmer style={{ height: 24, width: "50%" }} />
                {/* Label */}
                <Shimmer style={{ height: 12, width: "80%" }} />
              </div>
            </div>
          </SkeletonCard>
        ))}
      </div>
    </>
  );
}

// ─── ChartSkeleton ────────────────────────────────────────────────────────────

export function ChartSkeleton() {
  return (
    <>
      <StyleTag />
      <SkeletonCard>
        {/* Chart title */}
        <Shimmer style={{ height: 14, width: 140, marginBottom: 16 }} />
        {/* Chart area with fake bars to suggest a chart */}
        <div style={{ height: 240, position: "relative", overflow: "hidden", borderRadius: 8 }}>
          <Shimmer style={{ width: "100%", height: "100%", borderRadius: 8 }} />
          {/* Fake chart lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              padding: "12px 8px 8px",
              opacity: 0.15,
            }}
          >
            {[55, 70, 45, 80, 60, 75, 50, 85, 65, 72, 48, 78].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: "linear-gradient(180deg, #00C8FF, transparent)",
                  borderRadius: "3px 3px 0 0",
                }}
              />
            ))}
          </div>
        </div>
      </SkeletonCard>
    </>
  );
}

// ─── TableSkeleton ────────────────────────────────────────────────────────────

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      <StyleTag />
      <div
        style={{
          borderRadius: 12,
          border: "1px solid rgba(0,200,255,0.08)",
          background: "rgba(4,20,40,0.6)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            borderBottom: "1px solid rgba(0,200,255,0.06)",
            background: "rgba(0,200,255,0.02)",
            padding: "12px 16px",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          {[120, 80, 60, 60, 96].map((w, i) => (
            <Shimmer key={i} style={{ height: 12, width: w }} />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              borderBottom: i < rows - 1 ? "1px solid rgba(0,200,255,0.05)" : "none",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Shimmer style={{ height: 13, width: 110 }} />
            <Shimmer style={{ height: 13, width: 64 }} />
            <Shimmer style={{ height: 13, width: 56, display: "none" }} className="sm:block" />
            <Shimmer style={{ height: 13, width: 56, display: "none" }} className="sm:block" />
            <Shimmer style={{ height: 13, width: 96, display: "none" }} className="md:block" />
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <Shimmer style={{ height: 32, width: 32, borderRadius: 6 }} />
              <Shimmer style={{ height: 32, width: 32, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── FormSkeleton ─────────────────────────────────────────────────────────────

export function FormSkeleton() {
  return (
    <>
      <StyleTag />
      <div style={{ maxWidth: 520 }} className="space-y-6">
        {/* Back link */}
        <Shimmer style={{ height: 13, width: 160 }} />

        {/* Page title */}
        <div className="space-y-2">
          <Shimmer style={{ height: 22, width: 160 }} />
          <Shimmer style={{ height: 12, width: 260 }} />
        </div>

        {/* Form card */}
        <SkeletonCard className="space-y-5" style={{ padding: 24 } as React.CSSProperties}>
          {/* Name field */}
          <div className="space-y-2">
            <Shimmer style={{ height: 12, width: 80 }} />
            <Shimmer style={{ height: 42, width: "100%" }} />
          </div>

          {/* OS field */}
          <div className="space-y-2">
            <Shimmer style={{ height: 12, width: 120 }} />
            <Shimmer style={{ height: 42, width: "100%" }} />
          </div>

          {/* Two-col row */}
          <div className="grid grid-cols-2 gap-4">
            {["CPU", "RAM"].map((label) => (
              <div key={label} className="space-y-2">
                <Shimmer style={{ height: 12, width: 40 }} />
                <Shimmer style={{ height: 42, width: "100%" }} />
              </div>
            ))}
          </div>

          {/* Two-col row */}
          <div className="grid grid-cols-2 gap-4">
            {["Storage", "Region"].map((label) => (
              <div key={label} className="space-y-2">
                <Shimmer style={{ height: 12, width: 52 }} />
                <Shimmer style={{ height: 42, width: "100%" }} />
              </div>
            ))}
          </div>

          {/* Price estimate */}
          <Shimmer style={{ height: 48, width: "100%", borderRadius: 8 }} />

          {/* Submit button */}
          <Shimmer style={{ height: 44, width: "100%", borderRadius: 10 }} />
        </SkeletonCard>
      </div>
    </>
  );
}

// ─── MonitoringSkeleton ───────────────────────────────────────────────────────

export function MonitoringSkeleton() {
  return (
    <>
      <StyleTag />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer style={{ height: 20, width: 120 }} />
            <Shimmer style={{ height: 12, width: 220 }} />
          </div>
          <Shimmer style={{ height: 34, width: 90, borderRadius: 8 }} />
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i}>
              <Shimmer style={{ height: 11, width: 80, marginBottom: 8 }} />
              <Shimmer style={{ height: 28, width: 70 }} />
            </SkeletonCard>
          ))}
        </div>

        {/* CPU & RAM charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Network chart */}
        <SkeletonCard>
          <div className="flex items-center justify-between mb-4">
            <Shimmer style={{ height: 14, width: 140 }} />
            <div style={{ display: "flex", gap: 16 }}>
              <Shimmer style={{ height: 12, width: 64 }} />
              <Shimmer style={{ height: 12, width: 72 }} />
            </div>
          </div>
          <div style={{ height: 280, position: "relative", overflow: "hidden", borderRadius: 8 }}>
            <Shimmer style={{ width: "100%", height: "100%", borderRadius: 8 }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                gap: 0,
                padding: "16px 8px",
                opacity: 0.12,
              }}
            >
              {/* Fake two-line network chart */}
              <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                <polyline
                  points="0,100 40,80 80,120 120,60 160,90 200,70 240,110 280,50 320,85 360,65 400,90"
                  fill="none"
                  stroke="#00C8FF"
                  strokeWidth="2"
                />
                <polyline
                  points="0,140 40,120 80,150 120,110 160,130 200,115 240,145 280,100 320,125 360,110 400,130"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </SkeletonCard>
      </div>
    </>
  );
}