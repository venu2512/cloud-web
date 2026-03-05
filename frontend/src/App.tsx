import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import VirtualMachines from "./pages/VirtualMachines";
import CreateServer from "./pages/CreateServer";
import Monitoring from "./pages/Monitoring";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Storage from "./pages/Storage";
import Networking from "./pages/Networking";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardPage><Dashboard /></DashboardPage>} />
            <Route path="/dashboard/vms" element={<DashboardPage><VirtualMachines /></DashboardPage>} />
            <Route path="/dashboard/vms/create" element={<DashboardPage><CreateServer /></DashboardPage>} />
            <Route path="/dashboard/monitoring" element={<DashboardPage><Monitoring /></DashboardPage>} />
            <Route path="/dashboard/storage" element={<DashboardPage><Storage /></DashboardPage>} />
            <Route path="/dashboard/networking" element={<DashboardPage><Networking /></DashboardPage>} />
            <Route path="/dashboard/settings" element={<DashboardPage><Settings /></DashboardPage>} />
            <Route path="/dashboard/notifications" element={<DashboardPage><Notifications /></DashboardPage>} />
            <Route path="/dashboard/profile" element={<DashboardPage><Profile /></DashboardPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;