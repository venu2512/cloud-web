// src/pages/dashboard/CreateServer.tsx
import API from "@/config/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ArrowLeft, Loader2, Rocket } from "lucide-react";
import { FormSkeleton } from "@/components/dashboard/DashboardSkeleton";


// ─── Types ─────────────────────────────────────────────────────

interface CreateServerPayload {
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  region: string;
  os: string;
}

interface CreateServerResponse {
  id: string;
  name: string;
  status: string;
}


// ─── API Call ──────────────────────────────────────────────────

const createServer = async (payload: CreateServerPayload) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/servers/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create server");
  }

  return res.json() as Promise<CreateServerResponse>;
};


// ─── Pricing helper ────────────────────────────────────────────

const PRICES: Record<string, number> = {
  cpu_1: 5,
  cpu_2: 10,
  cpu_4: 20,
  cpu_8: 40,
  ram_2: 4,
  ram_4: 8,
  ram_8: 16,
  ram_16: 32,
  storage_25: 2.5,
  storage_50: 5,
  storage_100: 10,
  storage_200: 20,
};

const estimatePrice = (cpu: string, ram: string, storage: string) =>
  (PRICES[`cpu_${cpu}`] ?? 0) +
  (PRICES[`ram_${ram}`] ?? 0) +
  (PRICES[`storage_${storage}`] ?? 0);


// ─── Component ─────────────────────────────────────────────────

const CreateServer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [cpu, setCpu] = useState("2");
  const [ram, setRam] = useState("4");
  const [storage, setStorage] = useState("50");
  const [region, setRegion] = useState("us-east");
  const [os, setOs] = useState("ubuntu-22");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);


  const { mutate: deploy, isPending } = useMutation<
    CreateServerResponse,
    Error,
    CreateServerPayload
  >({
    mutationFn: createServer,

    onSuccess: (data) => {
      toast.success("Server deploying!", {
        description: `${data.name ?? name} is being provisioned.`,
      });

      navigate("/dashboard/vms");
    },

    onError: (err: Error) => {
      toast.error("Failed to create server", {
        description: err.message,
      });
    },
  });


  const handleDeploy = () => {
    if (!name.trim()) {
      toast.error("Server name is required");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(name.trim())) {
      toast.error("Invalid server name");
      return;
    }

    deploy({
      name: name.trim(),
      cpu,
      ram,
      storage,
      region,
      os,
    });
  };


  const estimatedPrice = estimatePrice(cpu, ram, storage);

  if (loading) return <FormSkeleton />;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl space-y-6"
    >

      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard/vms")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Virtual Machines
      </button>


      {/* Title */}
      <div>
        <h2 className="text-xl font-bold">Create Server</h2>
        <p className="text-sm text-muted-foreground">
          Configure and deploy a new virtual machine
        </p>
      </div>


      {/* Form */}
      <div className="rounded-xl border p-6 space-y-5">

        {/* Server Name */}
        <div className="space-y-2">
          <Label>Server name</Label>
          <Input
            placeholder="my-server-01"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
        </div>


        {/* Operating System */}
        <div className="space-y-2">
          <Label>Operating System</Label>
          <Select value={os} onValueChange={setOs}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ubuntu-22">Ubuntu 22.04</SelectItem>
              <SelectItem value="ubuntu-20">Ubuntu 20.04</SelectItem>
              <SelectItem value="debian-12">Debian 12</SelectItem>
              <SelectItem value="centos-9">CentOS Stream 9</SelectItem>
            </SelectContent>

          </Select>
        </div>


        {/* CPU */}
        <div className="space-y-2">
          <Label>CPU</Label>
          <Select value={cpu} onValueChange={setCpu}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="1">1 vCPU</SelectItem>
              <SelectItem value="2">2 vCPU</SelectItem>
              <SelectItem value="4">4 vCPU</SelectItem>
              <SelectItem value="8">8 vCPU</SelectItem>
            </SelectContent>

          </Select>
        </div>


        {/* RAM */}
        <div className="space-y-2">
          <Label>RAM</Label>
          <Select value={ram} onValueChange={setRam}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2">2 GB</SelectItem>
              <SelectItem value="4">4 GB</SelectItem>
              <SelectItem value="8">8 GB</SelectItem>
              <SelectItem value="16">16 GB</SelectItem>
            </SelectContent>

          </Select>
        </div>


        {/* Storage */}
        <div className="space-y-2">
          <Label>Storage</Label>
          <Select value={storage} onValueChange={setStorage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="25">25 GB SSD</SelectItem>
              <SelectItem value="50">50 GB SSD</SelectItem>
              <SelectItem value="100">100 GB SSD</SelectItem>
              <SelectItem value="200">200 GB SSD</SelectItem>
            </SelectContent>

          </Select>
        </div>


        {/* Region */}
        <div className="space-y-2">
          <Label>Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="us-east">US East</SelectItem>
              <SelectItem value="us-west">US West</SelectItem>
              <SelectItem value="eu-west">EU West</SelectItem>
              <SelectItem value="ap-south">Asia Pacific</SelectItem>
            </SelectContent>

          </Select>
        </div>


        {/* Price */}
        <div className="flex justify-between text-sm">
          <span>Estimated Cost</span>
          <span className="font-bold">${estimatedPrice}/month</span>
        </div>


        {/* Deploy Button */}
        <Button
          onClick={handleDeploy}
          className="w-full"
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