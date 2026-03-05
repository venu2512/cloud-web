import { useState } from "react";

const tabs = ["General", "Security", "Notifications", "Billing", "API Keys"];

const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? "bg-cyan-500" : "bg-slate-600"
    }`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
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

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-6">
    <div className="min-w-0">
      <p className="text-sm text-slate-200">{label}</p>
      {hint && <p className="text-xs text-slate-500 font-mono mt-0.5">{hint}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Input = ({ defaultValue, type = "text", placeholder }: { defaultValue?: string; type?: string; placeholder?: string }) => (
  <input
    type={type}
    defaultValue={defaultValue}
    placeholder={placeholder}
    className="w-56 bg-slate-900/80 border border-slate-600/60 rounded-md px-3 py-1.5 text-sm text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
  />
);

const DangerButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-red-400 border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 hover:border-red-400/60 transition-colors">
    {children}
  </button>
);

const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <button className="px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-colors">
    {children}
  </button>
);

function GeneralTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Profile" description="// personal information">
        <Field label="Display Name" hint="shown across the dashboard">
          <Input defaultValue="John Doe" />
        </Field>
        <Field label="Email Address" hint="login & notifications">
          <Input defaultValue="john@example.com" type="email" />
        </Field>
        <Field label="Organization" hint="team workspace name">
          <Input defaultValue="CloudNova Labs" />
        </Field>
        <div className="flex justify-end pt-1">
          <PrimaryButton>Save Changes</PrimaryButton>
        </div>
      </SectionCard>

      <SectionCard title="Preferences" description="// interface & regional">
        <Field label="Timezone" hint="affects monitoring timestamps">
          <select className="w-56 bg-slate-900/80 border border-slate-600/60 rounded-md px-3 py-1.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-colors">
            <option>UTC+00:00 — London</option>
            <option>UTC−05:00 — New York</option>
            <option>UTC−08:00 — Los Angeles</option>
            <option>UTC+05:30 — Mumbai</option>
            <option>UTC+08:00 — Singapore</option>
          </select>
        </Field>
        <Field label="Date Format" hint="displayed in logs & reports">
          <select className="w-56 bg-slate-900/80 border border-slate-600/60 rounded-md px-3 py-1.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition-colors">
            <option>YYYY-MM-DD</option>
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
          </select>
        </Field>
      </SectionCard>

      <SectionCard title="Danger Zone" description="// irreversible actions">
        <Field label="Delete Account" hint="permanently removes all data & VMs">
          <DangerButton>Delete Account</DangerButton>
        </Field>
      </SectionCard>
    </div>
  );
}

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(false);

  return (
    <div className="space-y-4">
      <SectionCard title="Password" description="// authentication credentials">
        <Field label="Current Password">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="New Password">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="Confirm Password">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <div className="flex justify-end pt-1">
          <PrimaryButton>Update Password</PrimaryButton>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="// 2FA via authenticator app">
        <Field label="Enable 2FA" hint="adds an extra layer of login security">
          <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
        </Field>
        {twoFA && (
          <Field label="Recovery Codes" hint="backup access codes">
            <PrimaryButton>View Codes</PrimaryButton>
          </Field>
        )}
      </SectionCard>

      <SectionCard title="Sessions" description="// active login sessions">
        <Field label="New Login Alerts" hint="email alert on new device sign-in">
          <Toggle enabled={sessionAlerts} onToggle={() => setSessionAlerts(!sessionAlerts)} />
        </Field>
        <Field label="Active Sessions" hint="2 devices currently logged in">
          <DangerButton>Revoke All</DangerButton>
        </Field>
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  const [state, setState] = useState({
    vmAlerts: true,
    billing: true,
    uptime: false,
    weekly: true,
    security: true,
    maintenance: false,
  });

  const toggle = (key: keyof typeof state) => setState((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-4">
      <SectionCard title="Infrastructure Alerts" description="// real-time VM & resource events">
        <Field label="VM Status Changes" hint="start, stop, crash events">
          <Toggle enabled={state.vmAlerts} onToggle={() => toggle("vmAlerts")} />
        </Field>
        <Field label="Uptime Monitoring" hint="alerts when uptime drops below threshold">
          <Toggle enabled={state.uptime} onToggle={() => toggle("uptime")} />
        </Field>
        <Field label="Scheduled Maintenance" hint="advance notice of planned downtime">
          <Toggle enabled={state.maintenance} onToggle={() => toggle("maintenance")} />
        </Field>
      </SectionCard>

      <SectionCard title="Account Notifications" description="// billing & security updates">
        <Field label="Billing Alerts" hint="invoices, payment failures, plan changes">
          <Toggle enabled={state.billing} onToggle={() => toggle("billing")} />
        </Field>
        <Field label="Security Events" hint="logins, API key usage, 2FA changes">
          <Toggle enabled={state.security} onToggle={() => toggle("security")} />
        </Field>
        <Field label="Weekly Summary" hint="usage digest every Monday">
          <Toggle enabled={state.weekly} onToggle={() => toggle("weekly")} />
        </Field>
      </SectionCard>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Current Plan" description="// subscription & usage">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">Pro Plan</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">$49/month · renews March 23, 2026</p>
          </div>
          <PrimaryButton>Upgrade</PrimaryButton>
        </div>
      </SectionCard>

      <SectionCard title="Payment Method" description="// saved card on file">
        <Field label="Card" hint="used for monthly billing">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-300">•••• •••• •••• 4242</span>
            <PrimaryButton>Update</PrimaryButton>
          </div>
        </Field>
      </SectionCard>

      <SectionCard title="Billing History" description="// past invoices">
        {[
          { date: "2026-02-01", amount: "$49.00", status: "Paid" },
          { date: "2026-01-01", amount: "$49.00", status: "Paid" },
          { date: "2025-12-01", amount: "$49.00", status: "Paid" },
        ].map((inv) => (
          <div key={inv.date} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-400">{inv.date}</span>
              <span className="text-sm text-slate-200">{inv.amount}</span>
              <span className="text-xs font-mono text-emerald-400">{inv.status}</span>
            </div>
            <PrimaryButton>Download</PrimaryButton>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function ApiKeysTab() {
  const [keys] = useState([
    { name: "Production Key", prefix: "cn_live_4xK2...", created: "2026-01-15", last: "2 hours ago" },
    { name: "Dev Key", prefix: "cn_test_9mP1...", created: "2025-12-03", last: "5 days ago" },
  ]);

  return (
    <div className="space-y-4">
      <SectionCard title="API Keys" description="// authenticate API requests">
        <div className="flex justify-end">
          <PrimaryButton>+ Generate New Key</PrimaryButton>
        </div>
        <div className="space-y-3">
          {keys.map((k) => (
            <div
              key={k.name}
              className="flex items-center justify-between rounded-md border border-slate-700/50 bg-slate-900/50 px-4 py-3"
            >
              <div>
                <p className="text-sm text-slate-200">{k.name}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {k.prefix} · created {k.created} · used {k.last}
                </p>
              </div>
              <DangerButton>Revoke</DangerButton>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Permissions" description="// key scope reference">
        {[
          ["read:vms", "List and view virtual machines"],
          ["write:vms", "Create, modify, delete VMs"],
          ["read:monitoring", "Access metrics and logs"],
          ["read:billing", "View invoices and usage"],
        ].map(([scope, desc]) => (
          <div key={scope} className="flex items-center gap-4">
            <span className="text-xs font-mono text-cyan-400 w-36 flex-shrink-0">{scope}</span>
            <span className="text-xs text-slate-400">{desc}</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");

  const tabContent: Record<string, React.ReactNode> = {
    General: <GeneralTab />,
    Security: <SecurityTab />,
    Notifications: <NotificationsTab />,
    Billing: <BillingTab />,
    "API Keys": <ApiKeysTab />,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-widest uppercase text-slate-100">Settings</h1>
        <p className="text-xs font-mono text-cyan-500/80 mt-0.5">/dashboard/settings</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-slate-700/60 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "text-cyan-400 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-2xl">{tabContent[activeTab]}</div>
    </div>
  );
}