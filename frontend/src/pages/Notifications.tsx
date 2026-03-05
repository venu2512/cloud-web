import { useState } from "react";

type Notification = {
  id: number;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: "vm" | "billing" | "security" | "system";
};

const typeStyles = {
  alert: { dot: "bg-red-400", badge: "text-red-400 border-red-500/30 bg-red-500/5" },
  warning: { dot: "bg-yellow-400", badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5" },
  success: { dot: "bg-emerald-400", badge: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" },
  info: { dot: "bg-cyan-400", badge: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5" },
};

const categoryLabels: Record<string, string> = {
  vm: "VIRTUAL MACHINE",
  billing: "BILLING",
  security: "SECURITY",
  system: "SYSTEM",
};

const allNotifications: Notification[] = [
  { id: 1, type: "alert", title: "VM CPU Critical", message: "prod-server-01 CPU usage at 97% for 10+ minutes. Immediate action recommended.", time: "2 min ago", read: false, category: "vm" },
  { id: 2, type: "warning", title: "High Memory Usage", message: "staging-02 memory at 88%. Consider scaling or optimizing workload.", time: "18 min ago", read: false, category: "vm" },
  { id: 3, type: "success", title: "VM Started Successfully", message: "dev-node-03 is now running in us-east-1.", time: "1 hour ago", read: false, category: "vm" },
  { id: 4, type: "info", title: "Invoice Generated", message: "Your February invoice of $49.00 is ready for download.", time: "3 hours ago", read: true, category: "billing" },
  { id: 5, type: "warning", title: "Storage at 80%", message: "You've used 4 TB of your 5 TB storage limit. Consider upgrading.", time: "5 hours ago", read: true, category: "system" },
  { id: 6, type: "alert", title: "New Login Detected", message: "Sign-in from Chrome on Windows · IP 192.168.1.44 · New York, US.", time: "1 day ago", read: true, category: "security" },
  { id: 7, type: "success", title: "Payment Successful", message: "Pro Plan renewal confirmed. Next billing: March 23, 2026.", time: "2 days ago", read: true, category: "billing" },
  { id: 8, type: "info", title: "Scheduled Maintenance", message: "CloudNova us-west-2 maintenance window: Feb 28, 02:00–04:00 UTC.", time: "3 days ago", read: true, category: "system" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "vm" | "billing" | "security" | "system">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.category === filter;
  });

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filters: { key: typeof filter; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "unread", label: "UNREAD" },
    { key: "vm", label: "VM" },
    { key: "billing", label: "BILLING" },
    { key: "security", label: "SECURITY" },
    { key: "system", label: "SYSTEM" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-widest uppercase text-slate-100">Notifications</h1>
          <p className="text-xs font-mono text-cyan-500/80 mt-0.5">/dashboard/notifications</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 rounded-md text-xs font-mono text-cyan-300 border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/15 transition-colors"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-slate-700/60 pb-0">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-xs font-mono tracking-wide transition-colors border-b-2 -mb-px ${
              filter === f.key
                ? "text-cyan-400 border-cyan-500"
                : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="max-w-2xl space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            // no notifications
          </div>
        )}

        {filtered.map((n) => (
          <div
            key={n.id}
            className={`rounded-lg border px-5 py-4 transition-colors ${
              n.read
                ? "border-slate-700/40 bg-slate-800/20"
                : "border-slate-700/60 bg-slate-800/50"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Unread dot */}
              <div className="flex-shrink-0 mt-1.5">
                {!n.read ? (
                  <div className={`w-2 h-2 rounded-full ${typeStyles[n.type].dot}`} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${typeStyles[n.type].badge}`}>
                    {categoryLabels[n.category]}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{n.time}</span>
                </div>
                <p className={`text-sm font-medium ${n.read ? "text-slate-300" : "text-slate-100"}`}>{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="text-xs font-mono text-slate-500 hover:text-cyan-400 px-2 py-1 transition-colors"
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => dismiss(n.id)}
                  className="text-xs font-mono text-slate-600 hover:text-red-400 px-2 py-1 transition-colors"
                  title="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}