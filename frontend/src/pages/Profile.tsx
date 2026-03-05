import { useState } from "react";

const PrimaryButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-colors"
  >
    {children}
  </button>
);

const DangerButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-red-400 border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-colors">
    {children}
  </button>
);

const SectionCard = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-700/60">
      <h3 className="text-sm font-semibold text-slate-100 tracking-wide">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-0.5 font-mono">{description}</p>}
    </div>
    <div className="px-6 py-5 space-y-5">{children}</div>
  </div>
);

const Input = ({ defaultValue, placeholder, type = "text" }: { defaultValue?: string; placeholder?: string; type?: string }) => (
  <input
    type={type}
    defaultValue={defaultValue}
    placeholder={placeholder}
    className="w-full bg-slate-900/80 border border-slate-600/60 rounded-md px-3 py-1.5 text-sm text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
  />
);

const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-5 py-4">
    <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">{label}</p>
    <p className="text-2xl font-semibold text-slate-100 mt-1">{value}</p>
    {sub && <p className="text-xs font-mono text-cyan-500/70 mt-0.5">{sub}</p>}
  </div>
);

const activityLog = [
  { action: "VM Created", target: "prod-server-01", time: "2 hours ago", color: "text-emerald-400" },
  { action: "VM Stopped", target: "staging-02", time: "5 hours ago", color: "text-yellow-400" },
  { action: "API Key Generated", target: "Dev Key", time: "1 day ago", color: "text-cyan-400" },
  { action: "Password Changed", target: "account security", time: "3 days ago", color: "text-slate-400" },
  { action: "VM Deleted", target: "test-node-04", time: "5 days ago", color: "text-red-400" },
  { action: "Billing Updated", target: "Pro Plan renewed", time: "1 week ago", color: "text-slate-400" },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-widest uppercase text-slate-100">Profile</h1>
        <p className="text-xs font-mono text-cyan-500/80 mt-0.5">/dashboard/profile</p>
      </div>

      {/* Profile Hero */}
      <div className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-6 py-6 mb-4 flex items-center gap-6">
        {/* Avatar */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-900/40">
            JD
          </div>
          {avatarHover && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <span className="text-xs font-mono text-white">Change</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-100">John Doe</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              PRO PLAN
            </span>
          </div>
          <p className="text-sm font-mono text-slate-400 mt-0.5">john@example.com</p>
          <p className="text-xs text-slate-500 mt-1">Member since January 2025 · CloudNova Labs</p>
        </div>

        <PrimaryButton onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit Profile"}
        </PrimaryButton>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="VMs Running" value="6" sub="across 2 regions" />
        <StatCard label="Storage Used" value="1.2 TB" sub="of 5 TB limit" />
        <StatCard label="Uptime" value="99.8%" sub="last 30 days" />
        <StatCard label="API Calls" value="84.2k" sub="this month" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Edit Form */}
        <div className="space-y-4">
          {editing ? (
            <SectionCard title="Edit Profile" description="// update your information">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">Display Name</label>
                  <Input defaultValue="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">Email</label>
                  <Input defaultValue="john@example.com" type="email" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">Organization</label>
                  <Input defaultValue="CloudNova Labs" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Cloud infrastructure engineer building scalable systems."
                    className="w-full bg-slate-900/80 border border-slate-600/60 rounded-md px-3 py-1.5 text-sm text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <PrimaryButton onClick={() => setEditing(false)}>Save Changes</PrimaryButton>
                  <DangerButton>Discard</DangerButton>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title="Account Details" description="// profile information">
              {[
                ["Name", "John Doe"],
                ["Email", "john@example.com"],
                ["Organization", "CloudNova Labs"],
                ["Role", "Admin"],
                ["Plan", "Pro — $49/month"],
                ["Member Since", "January 15, 2025"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400">{label}</span>
                  <span className="text-sm text-slate-200">{value}</span>
                </div>
              ))}
            </SectionCard>
          )}

          <SectionCard title="Connected Accounts" description="// oauth & integrations">
            {[
              { name: "GitHub", connected: true, handle: "@johndoe" },
              { name: "Google", connected: true, handle: "john@gmail.com" },
              { name: "Slack", connected: false, handle: "" },
            ].map((acc) => (
              <div key={acc.name} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-200">{acc.name}</span>
                  {acc.connected && <p className="text-xs font-mono text-slate-500 mt-0.5">{acc.handle}</p>}
                </div>
                {acc.connected ? (
                  <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/5">
                    Connected
                  </span>
                ) : (
                  <PrimaryButton>Connect</PrimaryButton>
                )}
              </div>
            ))}
          </SectionCard>
        </div>

        {/* Activity Log */}
        <SectionCard title="Recent Activity" description="// last 30 days of account events">
          <div className="space-y-3">
            {activityLog.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${item.color}`}>{item.action}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{item.target}</p>
                  <p className="text-xs text-slate-500 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}