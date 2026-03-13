import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonitoringSkeleton } from "@/components/dashboard/DashboardSkeleton";
import API_BASE_URL from "@/config/api";
interface MetricPoint { time: string; value: number; }
interface NetworkPoint { time: string; inbound: number; outbound: number; }
interface VMMetric { id: string; name: string; region: string; cpu: number; ram: number; network: number; uptime: string; }
interface MonitoringData {
  summary: { runningVMs: number; avgCpu: number; avgRam: number; alerts: number; };
  vmMetrics: VMMetric[];
  cpuHistory: MetricPoint[];
  networkHistory: NetworkPoint[];
}

const generateMockData = (): MonitoringData => ({
  summary: { runningVMs: 3, avgCpu: 52, avgRam: 61, alerts: 0 },
  vmMetrics: [],
  cpuHistory: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: Math.round(25 + Math.random() * 50) })),
  networkHistory: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, inbound: Math.round(10 + Math.random() * 80), outbound: Math.round(5 + Math.random() * 40) })),
});

const MOCK_DATA = generateMockData();

const fetchMonitoringData = async (): Promise<MonitoringData> => {
  try {
   const token = localStorage.getItem("token");
const res = await fetch(`${API_BASE_URL}/api/monitoring/metrics`, {
  headers: { "Authorization": `Bearer ${token}` },
});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch {
    return MOCK_DATA;
  }
};

const tooltipStyle = { backgroundColor: "hsl(220 18% 10%)", border: "1px solid hsl(220 13% 18%)", borderRadius: "8px", color: "hsl(210 20% 92%)", fontSize: 12 };
const axisTickStyle = { fontSize: 10, fill: "hsl(215 15% 55%)" };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Monitoring = () => {
  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["monitoring-metrics"],
    queryFn: fetchMonitoringData,
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: false,
  });

  if (isLoading) return <MonitoringSkeleton />;

  const { summary, cpuHistory, networkHistory, vmMetrics } = data ?? MOCK_DATA;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";

  const summaryCards = [
    { label: "Running VMs",   value: String(summary.runningVMs), color: "hsl(199 89% 48%)" },
    { label: "Avg CPU",       value: `${summary.avgCpu}%`,       color: "hsl(199 89% 48%)" },
    { label: "Avg RAM",       value: `${summary.avgRam}%`,       color: "hsl(142 71% 45%)" },
    { label: "Active Alerts", value: String(summary.alerts),     color: summary.alerts > 0 ? "hsl(0 84% 60%)" : "hsl(142 71% 45%)" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Monitoring</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Last updated: {lastUpdated} · auto-refreshes every 15s</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <motion.div key={card.label} variants={item} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">CPU Usage (24h)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={cpuHistory}>
              <defs>
                <linearGradient id="mcpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 18%)" />
              <XAxis dataKey="time" tick={axisTickStyle} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={axisTickStyle} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "CPU"]} />
              <Area type="monotone" dataKey="value" stroke="hsl(199 89% 48%)" fill="url(#mcpu)" strokeWidth={2} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">VM Metrics</h3>
          {vmMetrics.length > 0 ? (
            <div className="space-y-3">
              {vmMetrics.map((vm) => (
                <div key={vm.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <div>
                    <p className="font-mono text-xs text-foreground">{vm.name}</p>
                    <p className="text-xs text-muted-foreground">{vm.region}</p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>CPU <span className="text-foreground font-medium">{vm.cpu}%</span></span>
                    <span>RAM <span className="text-foreground font-medium">{vm.ram}%</span></span>
                    <span className="text-emerald-400">{vm.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-mono">// no VMs running</p>
          )}
        </motion.div>
      </div>

      <motion.div variants={item} className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Network Traffic (24h)</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full" style={{ background: "hsl(199 89% 48%)" }} />Inbound</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full" style={{ background: "hsl(38 92% 50%)" }} />Outbound</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={networkHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 18%)" />
            <XAxis dataKey="time" tick={axisTickStyle} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={axisTickStyle} tickLine={false} axisLine={false} unit=" Mb" />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${v} Mb`, name]} />
            <Line type="monotone" dataKey="inbound"  stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} name="Inbound"  isAnimationActive={false} />
            <Line type="monotone" dataKey="outbound" stroke="hsl(38 92% 50%)"  strokeWidth={2} dot={false} name="Outbound" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default Monitoring;
