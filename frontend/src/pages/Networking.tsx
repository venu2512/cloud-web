import { useState } from "react";

const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/15 transition-colors">
    {children}
  </button>
);

const DangerButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-red-400 border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-colors">
    {children}
  </button>
);

const StatusDot = ({ status }: { status: string }) => {
  const color = status === "active" ? "bg-emerald-400" : status === "pending" ? "bg-yellow-400" : "bg-red-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${color} mr-1.5`} />;
};

const vpcs = [
  { name: "prod-vpc", cidr: "10.0.0.0/16", region: "us-east-1", subnets: 4, status: "active" },
  { name: "staging-vpc", cidr: "10.1.0.0/16", region: "eu-west-1", subnets: 2, status: "active" },
  { name: "dev-vpc", cidr: "10.2.0.0/16", region: "us-west-2", subnets: 1, status: "active" },
];

const firewallRules = [
  { name: "allow-http", direction: "Inbound", protocol: "TCP", port: "80", source: "0.0.0.0/0", action: "ALLOW" },
  { name: "allow-https", direction: "Inbound", protocol: "TCP", port: "443", source: "0.0.0.0/0", action: "ALLOW" },
  { name: "allow-ssh", direction: "Inbound", protocol: "TCP", port: "22", source: "192.168.1.0/24", action: "ALLOW" },
  { name: "block-telnet", direction: "Inbound", protocol: "TCP", port: "23", source: "0.0.0.0/0", action: "DENY" },
  { name: "allow-all-out", direction: "Outbound", protocol: "ALL", port: "ALL", source: "0.0.0.0/0", action: "ALLOW" },
];

const loadBalancers = [
  { name: "prod-lb-01", type: "Application", region: "us-east-1", ip: "52.14.22.198", targets: 3, status: "active" },
  { name: "staging-lb", type: "Network", region: "eu-west-1", ip: "34.240.11.77", targets: 1, status: "active" },
];

const ips = [
  { address: "52.14.22.198", type: "Elastic", region: "us-east-1", attached: "prod-lb-01" },
  { address: "34.240.11.77", type: "Elastic", region: "eu-west-1", attached: "staging-lb" },
  { address: "18.234.55.102", type: "Elastic", region: "us-east-1", attached: "—" },
];

export default function Networking() {
  const [activeTab, setActiveTab] = useState<"vpc" | "firewall" | "loadbalancer" | "ips">("vpc");

  const tabs = [
    { key: "vpc", label: "VPC" },
    { key: "firewall", label: "FIREWALL" },
    { key: "loadbalancer", label: "LOAD BALANCERS" },
    { key: "ips", label: "IP ADDRESSES" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-widest uppercase text-slate-100">Networking</h1>
          <p className="text-xs font-mono text-cyan-500/80 mt-0.5">/dashboard/networking</p>
        </div>
        <PrimaryButton>+ New Resource</PrimaryButton>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "VPCs", value: "3", sub: "across 3 regions" },
          { label: "Firewall Rules", value: `${firewallRules.length}`, sub: `${firewallRules.filter(r => r.action === "DENY").length} deny rules` },
          { label: "Load Balancers", value: `${loadBalancers.length}`, sub: "all healthy" },
          { label: "Elastic IPs", value: `${ips.length}`, sub: `${ips.filter(i => i.attached === "—").length} unattached` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-700/50 bg-slate-800/40 px-5 py-4">
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</p>
            <p className="text-2xl font-semibold text-slate-100 mt-1">{s.value}</p>
            <p className="text-xs font-mono text-cyan-500/70 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-700/60 pb-0 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-xs font-mono tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === t.key ? "text-cyan-400 border-cyan-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* VPC Tab */}
      {activeTab === "vpc" && (
        <div className="space-y-3">
          {vpcs.map((vpc) => (
            <div key={vpc.name} className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{vpc.name}</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{vpc.cidr}</p>
                </div>
                <div className="text-xs font-mono text-slate-400">{vpc.region}</div>
                <div className="text-xs text-slate-400">{vpc.subnets} subnets</div>
                <div className="text-xs font-mono">
                  <StatusDot status={vpc.status} />
                  <span className="text-emerald-400">{vpc.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <PrimaryButton>Manage Subnets</PrimaryButton>
                <DangerButton>Delete</DangerButton>
              </div>
            </div>
          ))}
          <button className="w-full rounded-lg border border-dashed border-slate-700/50 py-4 text-xs font-mono text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors">
            + Create VPC
          </button>
        </div>
      )}

      {/* Firewall Tab */}
      {activeTab === "firewall" && (
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/60 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">// inbound & outbound rules</span>
            <PrimaryButton>+ Add Rule</PrimaryButton>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {["Name", "Direction", "Protocol", "Port", "Source/Dest", "Action", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-400 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {firewallRules.map((r, i) => (
                <tr key={r.name} className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${i === firewallRules.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3 text-sm font-mono text-slate-200">{r.name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.direction}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">{r.protocol}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">{r.port}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{r.source}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      r.action === "ALLOW"
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                        : "text-red-400 border-red-500/30 bg-red-500/5"
                    }`}>
                      {r.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DangerButton>Remove</DangerButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Load Balancers Tab */}
      {activeTab === "loadbalancer" && (
        <div className="space-y-3">
          {loadBalancers.map((lb) => (
            <div key={lb.name} className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{lb.name}</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{lb.ip}</p>
                </div>
                <div className="text-xs font-mono px-2 py-0.5 rounded border border-slate-600/50 text-slate-400">{lb.type}</div>
                <div className="text-xs font-mono text-slate-400">{lb.region}</div>
                <div className="text-xs text-slate-400">{lb.targets} targets</div>
                <div className="text-xs font-mono">
                  <StatusDot status={lb.status} />
                  <span className="text-emerald-400">{lb.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <PrimaryButton>Configure</PrimaryButton>
                <DangerButton>Delete</DangerButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IP Addresses Tab */}
      {activeTab === "ips" && (
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/60 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">// elastic ip addresses</span>
            <PrimaryButton>+ Allocate IP</PrimaryButton>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/60">
                {["IP Address", "Type", "Region", "Attached To", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-mono text-slate-400 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ips.map((ip, i) => (
                <tr key={ip.address} className={`border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors ${i === ips.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3 text-sm font-mono text-cyan-300">{ip.address}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{ip.type}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{ip.region}</td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {ip.attached === "—"
                      ? <span className="text-slate-500">Unattached</span>
                      : <span className="text-slate-300">{ip.attached}</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {ip.attached === "—" ? <PrimaryButton>Attach</PrimaryButton> : <PrimaryButton>Detach</PrimaryButton>}
                      <DangerButton>Release</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}