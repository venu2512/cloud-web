import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import {
  LayoutDashboard,
  Server,
  HardDrive,
  Network,
  Activity,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",        path: "/dashboard" },
  { icon: Server,          label: "Virtual Machines", path: "/dashboard/vms" },
  { icon: HardDrive,       label: "Storage",          path: "/dashboard/storage" },
  { icon: Network,         label: "Networking",       path: "/dashboard/networking" },
  { icon: Activity,        label: "Monitoring",       path: "/dashboard/monitoring" },
  { icon: Settings,        label: "Settings",         path: "/dashboard/settings" },
];

const LogoMark = ({ size = 28 }: { size?: number }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center rounded-lg"
    style={{
      width: size, height: size,
      background: "linear-gradient(135deg, #0a1f3d, #0d2a54)",
      border: "1px solid rgba(0,200,255,0.25)",
      boxShadow: "0 0 10px rgba(0,200,255,0.1)",
    }}
  >
    <svg width={size * 0.5} height={size * 0.4} viewBox="0 0 38 28" fill="none">
      <path
        d="M30.5 12.5C30.5 12 30.5 11.5 30.5 11.5C30.5 7.36 27.14 4 23 4C19.96 4 17.36 5.76 16.08 8.32C15.24 7.84 14.26 7.5 13.2 7.5C9.97 7.5 7.35 10.12 7.35 13.35C7.35 13.57 7.37 13.79 7.4 14H7C4.24 14 2 16.24 2 19C2 21.76 4.24 24 7 24H30.5C33.54 24 36 21.54 36 18.5C36 15.72 33.96 13.44 31.28 13.02C31.1 12.84 30.82 12.64 30.5 12.5Z"
        fill="url(#dl-grad)"
      />
      <defs>
        <linearGradient id="dl-grad" x1="2" y1="4" x2="36" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C8FF" />
          <stop offset="1" stopColor="#0080FF" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [collapsed, setCollapsed]             = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Auth guard — redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // ✅ Load real user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ✅ Sign out — clear token and redirect
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const allLabels: Record<string, string> = {
    "/dashboard/notifications": "Notifications",
    "/dashboard/profile":       "Profile",
    ...Object.fromEntries(menuItems.map((m) => [m.path, m.label])),
  };
  const currentLabel = allLabels[location.pathname] ?? "Dashboard";

  const isNotificationsActive = location.pathname === "/dashboard/notifications";
  const isProfileActive       = location.pathname === "/dashboard/profile";

  return (
    <div className="min-h-screen flex" style={{ background: "#020B18" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 lg:relative",
          collapsed ? "w-16" : "w-60",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          background: "rgba(2, 11, 24, 0.98)",
          borderRight: "1px solid rgba(0,200,255,0.08)",
        }}
      >
        {/* Sidebar header */}
        <div
          className={cn("flex h-16 items-center px-4 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}
          style={{ borderBottom: "1px solid rgba(0,200,255,0.06)" }}
        >
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", fontWeight: "bold", letterSpacing: "0.2em", background: "linear-gradient(90deg, #fff, #00C8FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                CLOUDNOVA
              </span>
            </Link>
          )}
          {collapsed && <LogoMark size={28} />}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center rounded-md transition-all duration-200"
            style={{ width: 24, height: 24, color: "rgba(0,200,255,0.4)", border: "1px solid rgba(0,200,255,0.1)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00C8FF"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(0,200,255,0.4)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.1)"; }}
          >
            <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-300", collapsed && "rotate-180")} />
          </button>

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 mb-3" style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(0,200,255,0.35)" }}>
              NAVIGATION
            </p>
          )}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 group relative", collapsed && "justify-center px-2")}
                style={{
                  background: isActive ? "rgba(0,200,255,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(0,200,255,0.15)" : "1px solid transparent",
                  color: isActive ? "#00C8FF" : "rgba(255,255,255,0.4)",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "12px",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; } }}
                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; } }}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ width: 3, height: "60%", background: "#00C8FF", boxShadow: "0 0 8px #00C8FF" }} />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ✅ Sign out button — now clears token */}
        <div className="p-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,200,255,0.06)" }}>
          <button
            onClick={handleSignOut}
            className={cn("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150", collapsed && "justify-center px-2")}
            style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,80,80,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,100,100,0.8)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0"
          style={{ background: "rgba(2,11,24,0.95)", borderBottom: "1px solid rgba(0,200,255,0.06)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center rounded-lg transition-colors"
              style={{ width: 34, height: 34, border: "1px solid rgba(0,200,255,0.12)", color: "rgba(0,200,255,0.6)" }}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h1 style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", fontWeight: "bold", letterSpacing: "0.1em", color: "#fff" }}>
                {currentLabel.toUpperCase()}
              </h1>
              <p style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", color: "rgba(0,200,255,0.4)", letterSpacing: "0.08em" }}>
                {location.pathname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Bell */}
            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="relative flex items-center justify-center rounded-lg transition-all duration-200"
              style={{
                width: 34, height: 34,
                border: isNotificationsActive ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,200,255,0.1)",
                color: isNotificationsActive ? "#00C8FF" : "rgba(0,200,255,0.5)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "#00C8FF"; }}
              onMouseLeave={(e) => {
                if (!isNotificationsActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.1)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(0,200,255,0.5)";
                }
              }}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 rounded-full" style={{ width: 6, height: 6, background: "#00C8FF", boxShadow: "0 0 6px #00C8FF" }} />
            </button>

            {/* ✅ Avatar — shows real user name from localStorage */}
            <div
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 cursor-pointer transition-all duration-200"
              style={{ border: isProfileActive ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,200,255,0.1)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.25)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = isProfileActive ? "rgba(0,200,255,0.4)" : "rgba(0,200,255,0.1)")}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 28, height: 28, background: "linear-gradient(135deg, #0050FF, #00C8FF)", fontFamily: "'Courier New', monospace", fontSize: "10px", fontWeight: "bold", color: "#fff", letterSpacing: "0.05em" }}
              >
                {userInitials}
              </div>
              <div className="hidden sm:block">
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{userName}</p>
                <p style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", color: "rgba(0,200,255,0.4)", letterSpacing: "0.04em" }}>Pro Plan</p>
              </div>
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6" style={{ background: "#020B18" }}>
          <AnimatePresence mode="wait">
            {!isTransitioning && (
              <PageTransition key={location.pathname}>{children}</PageTransition>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
