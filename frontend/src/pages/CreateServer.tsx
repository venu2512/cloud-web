import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CreateServerPayload {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  region: string;
  os: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

const createServer = async (payload: CreateServerPayload) => {
  const res = await fetch("https://cloud-nova.onrender.com/api/vms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to create server (${res.status})`);
  }

  return res.json();
};

// ─── Pricing helper ──────────────────────────────────────────────────────────

const PRICES: Record<string, number> = {
  cpu_1: 5, cpu_2: 10, cpu_4: 20, cpu_8: 40,
  ram_2: 4, ram_4: 8, ram_8: 16, ram_16: 32, ram_32: 64,
  storage_25: 2.5, storage_50: 5, storage_100: 10, storage_200: 20,
};

const estimatePrice = (cpu: string, ram: string, storage: string) =>
  (PRICES[`cpu_${cpu}`] ?? 0) +
  (PRICES[`ram_${ram}`] ?? 0) +
  (PRICES[`storage_${storage}`] ?? 0);

// ─── CreateServer ─────────────────────────────────────────────────────────────

const CreateServer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName]       = useState("");
  const [cpu, setCpu]         = useState("2");
  const [ram, setRam]         = useState("4");
  const [storage, setStorage] = useState("50");
  const [region, setRegion]   = useState("us-east");
  const [os, setOs]           = useState("ubuntu-22");

  // Simulate skeleton delay (replace with real data fetch if needed)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const estimatedPrice = estimatePrice(cpu, ram, storage);

  const { mutate: deploy, isPending } = useMutation({
    mutationFn: createServer,
    onSuccess: (data) => {
      toast.success("Server deploying!", {
        description: `${data.name ?? name} is being provisioned. This may take a minute.`,
        duration: 4000,
      });
      navigate("/dashboard/vms");
    },
    onError: (err: Error) => {
      toast.error("Failed to create server", {
        description: err.message,
        duration: 5000,
      });
    },
  });

  const handleDeploy = () => {
    // Basic validation
    if (!name.trim()) {
      toast.error("Server name is required", {
        description: "Please enter a name for your server.",
      });
      return;
    }
    if (!/^[a-z0-9-]+$/.test(name.trim())) {
      toast.error("Invalid server name", {
        description: "Only lowercase letters, numbers, and hyphens are allowed.",
      });
      return;
    }
    deploy({ name: name.trim(), cpu, ram, storage, region, os });
  };

  if (loading) return <FormSkeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl space-y-6">

      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/vms")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Virtual Machines
      </button>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Create Server</h2>
        <p className="text-sm text-muted-foreground">Configure and deploy a new virtual machine</p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">

        {/* Server name */}
        <div className="space-y-2">
          <Label>Server name</Label>
          <Input
            placeholder="my-server-01"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        {/* OS */}
        <div className="space-y-2">
          <Label>Operating System</Label>
          <Select value={os} onValueChange={setOs} disabled={isPending}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ubuntu-22">Ubuntu 22.04 LTS</SelectItem>
              <SelectItem value="ubuntu-20">Ubuntu 20.04 LTS</SelectItem>
              <SelectItem value="debian-12">Debian 12</SelectItem>
              <SelectItem value="centos-9">CentOS Stream 9</SelectItem>
              <SelectItem value="windows-2022">Windows Server 2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CPU & RAM */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CPU</Label>
            <Select value={cpu} onValueChange={setCpu} disabled={isPending}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 vCPU</SelectItem>
                <SelectItem value="2">2 vCPU</SelectItem>
                <SelectItem value="4">4 vCPU</SelectItem>
                <SelectItem value="8">8 vCPU</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>RAM</Label>
            <Select value={ram} onValueChange={setRam} disabled={isPending}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 GB</SelectItem>
                <SelectItem value="4">4 GB</SelectItem>
                <SelectItem value="8">8 GB</SelectItem>
                <SelectItem value="16">16 GB</SelectItem>
                <SelectItem value="32">32 GB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Storage & Region */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Storage</Label>
            <Select value={storage} onValueChange={setStorage} disabled={isPending}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 GB SSD</SelectItem>
                <SelectItem value="50">50 GB SSD</SelectItem>
                <SelectItem value="100">100 GB SSD</SelectItem>
                <SelectItem value="200">200 GB SSD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <Select value={region} onValueChange={setRegion} disabled={isPending}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east">US East (Virginia)</SelectItem>
                <SelectItem value="us-west">US West (Oregon)</SelectItem>
                <SelectItem value="eu-west">EU West (Ireland)</SelectItem>
                <SelectItem value="ap-south">Asia Pacific (Mumbai)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price estimate */}
        <div className="rounded-lg bg-muted/40 border border-border px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Estimated cost</p>
          <p className="text-sm font-bold text-foreground">
            ${estimatedPrice.toFixed(2)}{" "}
            <span className="font-normal text-muted-foreground text-xs">/ month</span>
          </p>
        </div>

        {/* Deploy button */}
        <Button
          variant="hero"
          className="w-full"
          onClick={handleDeploy}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Server
            </>
          )}
        </Button>

      </div>
    </motion.div>
  );
};

export default CreateServer;