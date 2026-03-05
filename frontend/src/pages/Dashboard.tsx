import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Server, Activity, HardDrive, Cpu, AlertCircle, RefreshCw } from "lucide-react";
import {
  DashboardStatsSkeleton,
  ChartSkeleton,
} from "@/components/dashboard/DashboardSkeleton";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalServers: number;
  runningServers: number;
  avgCpu: number;
  storageUsed: string;
}

interface MetricPoint {
  time: string;
  value: number;
}

interface DashboardMetrics {
  stats: DashboardStats;
  cpuHistory: MetricPoint[];
  ramHistory: MetricPoint[];
}

// ─── API ─────────────────────────────────────────────────────────────────────

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await fetch("http://localhost:5000/api/dashboard/metrics", {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch metrics (${res.status})`);
  return res.json();
};

// ─── Animation configs ───────────────────────────────────────────────────────

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const tooltipStyle = {
  backgroundColor: "hsl(220 18% 10%)",
  border: "1px solid hsl(220 13% 18%)",
  borderRadius: "8px",
  color: "hsl(210 20% 92%)",
  fontSize: 12,
};

// ─── Error State ─────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-6 w-6 text-destructive" />
    </div>
    <div>
      <p className="font-semibold text-foreground">Failed to load dashboard</p>
      <p className="text-sm text-muted-foreground mt-1">{message}</p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
      <RefreshCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {

  const navigate = useNavigate();

  // ✅ Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: fetchDashboardMetrics,
    refetchInterval: 30000,
    staleTime: 20000,
    retry: 2,
  });
  // ── Loading ──
  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardStatsSkeleton />
        <div className="grid lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <ErrorState
        message={(error as Error)?.message ?? "Unknown error"}
        onRetry={() => refetch()}
      />
    );
  }

  const { stats, cpuHistory, ramHistory } = data!;

  const statCards = [
    { icon: Server,    label: "Total Servers",  value: String(stats.totalServers),   color: "text-primary" },
    { icon: Activity,  label: "Running",         value: String(stats.runningServers), color: "text-success" },
    { icon: Cpu,       label: "Avg CPU",         value: `${stats.avgCpu}%`,           color: "text-warning" },
    { icon: HardDrive, label: "Storage Used",    value: stats.storageUsed,            color: "text-primary" },
  ];

  const lastUpdated = new Date(dataUpdatedAt).toLocaleTimeString();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header row with last-updated indicator */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last updated: {lastUpdated} · auto-refreshes every 30s
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* CPU Chart */}
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">CPU Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={cpuHistory}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 18%)" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                interval={3}
                tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CPU"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(199 89% 48%)"
                fill="url(#cpuGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* RAM Chart */}
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">RAM Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ramHistory}>
              <defs>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 18%)" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                interval={3}
                tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "RAM"]} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(142 71% 45%)"
                fill="url(#ramGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;