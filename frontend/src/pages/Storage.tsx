import { useState } from "react";

const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-colors">
    {children}
  </button>
);

const DangerButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-red-400 border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-colors">
    {children}
  </button>
);

const UsageBar = ({ used, total, color = "bg-cyan-500" }: { used: number; total: number; color?: string }) => {
  const pct = Math.round((used / total) * 100);
  const barColor = pct > 85 ? "bg-red-500" : pct > 65 ? "bg-yellow-500" : color;
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
        <span>{used} GB used</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const volumes = [
  { name: "prod-vol-01", type: "SSD", size: 500, used: 412, region: "us-east-1", attached: "prod-server-01", status: "mounted" },
  { name: "prod-vol-02", type: "SSD", size: 250, used: 88, region: "us-east-1", attached: "prod-server-02", status: "mounted" },
  { name: "staging-vol", type: "HDD", size: 1000, used: 340, region: "eu-west-1", attached: "staging-02", status: "mounted" },
  { name: "backup-vol-01", type: "HDD", size: 2000, used: 1650, region: "us-east-1", attached: "—", status: "unmounted" },
  { name: "dev-scratch", type: "SSD", size: 100, used: 22, region: "us-west-2", attached: "dev-node-03", status: "mounted" },
];

const snapshots = [
  { name: "prod-snap-20260222", source: "prod-vol-01", size: "47 GB", created: "Feb 22, 2026", status: "available" },
  { name: "prod-snap-20260215", source: "prod-vol-01", size: "44 GB", created: "Feb 15, 2026", status: "available" },
  { name: "staging-snap-20260220", source: "staging-vol", size: "31 GB", created: "Feb 20, 2026", status: "available" },
];

export default function Storage() {
  const [activeTab, setActiveTab] = useState<"volumes" | "snapshots" | "buckets">("volumes");

  const totalUsed = volumes.reduce((acc, v) => acc + v.used, 0);
  const totalSize = 5120; // 5TB in GB

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-widest uppercase text-slate-100">Storage</h1>
          <p className="text-xs font-mono text-cyan-500/80 mt-0.5">/dashboard/storage</p>
        </div>
        <PrimaryButton>+ New Volume</PrimaryButton>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Capacity", value: "5.0 TB", sub: "plan limit" },
          { label: "Used", value: `${(totalUsed / 1024).toFixed(1)} TB`, sub: `${Math.round((totalUsed / totalSize) * 100)}% of quota` },
          { label: "Volumes", value: `${volumes.length}`, sub: `${volumes.filter(v => v.status === "mounted").length} mounted` },
          { label: "Snapshots", value: `${snapshots.length}`, sub: "total backups" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-700/50 bg-slate-800/40 px-5 py-4">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">{s.value}</p>
            <p className="text-xs font-mono text-cyan-500/70 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Overall usage bar */}
      <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-6 py-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-slate-100">Overall Usage</span>
          <span className="text-xs font-mono text-slate-400">{totalUsed} GB / {totalSize} GB</span>
        </div>
        <UsageBar used={totalUsed} total={totalSize} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-700/60 pb-0 mb-5">
        {(["volumes", "snapshots", "buckets"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-xs font-mono tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === t ? "text-cyan-400 border-cyan-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Volumes Tab */}
      {activeTab === "volumes" && (
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {["Name", "Type", "Size / Used", "Region", "Attached To", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-400 tracking-widest uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volumes.map((v, i) => (
                <tr key={v.name} className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${i === volumes.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3 text-sm font-mono text-slate-200">{v.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-slate-600/50 text-slate-400 bg-slate-900/40">
                      {v.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-40">
                    <UsageBar used={v.used} total={v.size} />
                    <p className="text-xs font-mono text-slate-500 mt-1">{v.size} GB total</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{v.region}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{v.attached}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono ${v.status === "mounted" ? "text-emerald-400" : "text-slate-500"}`}>
                      ● {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <PrimaryButton>Snapshot</PrimaryButton>
                      <DangerButton>Delete</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Snapshots Tab */}
      {activeTab === "snapshots" && (
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {["Snapshot Name", "Source Volume", "Size", "Created", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-400 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {snapshots.map((s, i) => (
                <tr key={s.name} className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${i === snapshots.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3 text-sm font-mono text-slate-200">{s.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{s.source}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">{s.size}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{s.created}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-emerald-400">● {s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <PrimaryButton>Restore</PrimaryButton>
                      <DangerButton>Delete</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buckets Tab */}
      {activeTab === "buckets" && (
        <div className="text-center py-16 text-slate-500 font-mono text-sm">
          <p className="text-2xl mb-3">🗄</p>
          <p>// object storage coming soon</p>
          <p className="text-xs text-slate-600 mt-1">S3-compatible buckets will appear here</p>
        </div>
      )}
    </div>
  );
}