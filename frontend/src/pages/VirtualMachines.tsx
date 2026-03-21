import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Plus,
  Play,
  Square,
  Trash2,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Server,
} from "lucide-react";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api"; // ✅ FIXED IMPORT

// ─── Types ───────────────────────────────────────────────────────────────────

interface VM {
  id: string;
  name: string;
  status: "running" | "stopped";
  cpu: string;
  ram: string;
  ip: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

const fetchVMs = async (): Promise<VM[]> => {
  const res = await fetch(`${API_BASE_URL}/api/vms`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Failed to fetch VMs (${res.status})`);
  }

  return res.json();
};

const toggleVMStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "running" | "stopped";
}) => {
  const action = status === "running" ? "stop" : "start";

  const res = await fetch(`${API_BASE_URL}/api/vms/${id}/${action}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Failed to ${action} VM`);
  }

  return res.json();
};

const deleteVM = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/api/vms/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to delete VM");
  }

  return res.json();
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

const ConfirmDeleteDialog = ({
  vmName,
  onConfirm,
  onCancel,
}: {
  vmName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 rounded-xl border border-border bg-card p-6 shadow-2xl w-full max-w-sm mx-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <h3 className="font-semibold text-foreground">Delete VM</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        Delete{" "}
        <span className="font-mono font-semibold text-foreground">
          {vmName}
        </span>
        ? This cannot be undone.
      </p>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-destructive text-destructive-foreground"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-6 w-6 text-destructive" />
    </div>
    <div>
      <p className="font-semibold text-foreground">Failed to load VMs</p>
      <p className="text-sm text-muted-foreground mt-1">
        {message || "Server unreachable"}
      </p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RefreshCw className="h-4 w-4 mr-1" /> Retry
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const VirtualMachines = () => {
  const queryClient = useQueryClient();

  const [confirmDelete, setConfirmDelete] = useState<VM | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null); // ✅ per-row loading

  // ── Fetch ──
  const { data: vms, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vms"],
    queryFn: fetchVMs,
    staleTime: 15000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // ── Toggle ──
  const toggleMutation = useMutation({
    mutationFn: toggleVMStatus,
    onMutate: async ({ id, status }) => {
      setLoadingId(id);

      await queryClient.cancelQueries({ queryKey: ["vms"] });
      const previous = queryClient.getQueryData<VM[]>(["vms"]);

      queryClient.setQueryData<VM[]>(["vms"], (old) =>
        old?.map((vm) =>
          vm.id === id
            ? { ...vm, status: status === "running" ? "stopped" : "running" }
            : vm
        )
      );

      return { previous };
    },
    onError: (err: Error, _vars, context) => {
      queryClient.setQueryData(["vms"], context?.previous);
      toast.error(err.message);
    },
    onSuccess: (_data, { status }) => {
      toast.success(
        `VM ${status === "running" ? "stopped" : "started"} successfully`
      );
    },
    onSettled: () => {
      setLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
  });

  // ── Delete ──
  const deleteMutation = useMutation({
    mutationFn: deleteVM,
    onMutate: async (id) => {
      setLoadingId(id);

      await queryClient.cancelQueries({ queryKey: ["vms"] });
      const previous = queryClient.getQueryData<VM[]>(["vms"]);

      queryClient.setQueryData<VM[]>(["vms"], (old) =>
        old?.filter((vm) => vm.id !== id)
      );

      return { previous };
    },
    onError: (err: Error, _id, context) => {
      queryClient.setQueryData(["vms"], context?.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("VM deleted successfully");
    },
    onSettled: () => {
      setLoadingId(null);
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
  });

  // ── Loading ──
  if (isLoading) return <TableSkeleton />;

  // ── Error ──
  if (isError)
    return (
      <ErrorState
        message={(error as Error)?.message}
        onRetry={refetch}
      />
    );

  return (
    <>
      {confirmDelete && (
        <ConfirmDeleteDialog
          vmName={confirmDelete.name}
          onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">
            Virtual Machines ({vms?.length ?? 0})
          </h2>

          <div className="flex gap-2">
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button asChild size="sm">
              <Link to="/dashboard/vms/create">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        {vms?.map((vm) => (
          <div key={vm.id} className="flex justify-between border p-3 rounded">
            <div>
              <p>{vm.name}</p>
              <p className="text-xs text-muted-foreground">
                {vm.cpu} • {vm.ram} • {vm.ip}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                disabled={loadingId === vm.id}
                onClick={() =>
                  toggleMutation.mutate({ id: vm.id, status: vm.status })
                }
              >
                {vm.status === "running" ? <Square /> : <Play />}
              </Button>

              <Button
                size="icon"
                disabled={loadingId === vm.id}
                onClick={() => setConfirmDelete(vm)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VirtualMachines;