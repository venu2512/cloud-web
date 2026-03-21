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
} from "lucide-react";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VM {
  id: string;
  name: string;
  status: "running" | "stopped";
  cpu: string;
  ram: string;
  ip: string;
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("token");

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Request failed (${res.status})`);
  }

  return res.json();
};

// ─── API ─────────────────────────────────────────────────────────────────────

const fetchVMs = async (): Promise<VM[]> => {
  return authFetch(`${API_BASE_URL}/api/vms`);
};

const toggleVMStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "running" | "stopped";
}) => {
  const action = status === "running" ? "stop" : "start";
  return authFetch(`${API_BASE_URL}/api/vms/${id}/${action}`, {
    method: "PUT",
  });
};

const deleteVM = async (id: string) => {
  return authFetch(`${API_BASE_URL}/api/vms/${id}`, {
    method: "DELETE",
  });
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
      className="relative z-10 rounded-xl border border-border bg-card p-6 shadow-2xl w-full max-w-sm"
    >
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
        <AlertTriangle className="text-red-400" /> Delete VM
      </h3>

      <p className="text-sm text-gray-300 mb-4">
        Delete <span className="font-semibold text-white">{vmName}</span>? This cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={onConfirm}>
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
  <div className="text-center py-20">
    <AlertCircle className="mx-auto mb-3 text-red-400" />
    <p className="font-semibold text-white">Failed to load VMs</p>
    <p className="text-sm text-gray-400">{message}</p>

    <Button onClick={() => onRetry()} className="mt-4">
      <RefreshCw className="mr-1 h-4 w-4" />
      Retry
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const VirtualMachines = () => {
  const queryClient = useQueryClient();

  const [confirmDelete, setConfirmDelete] = useState<VM | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: vms, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vms"],
    queryFn: fetchVMs,
    staleTime: 15000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

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
    onSettled: () => {
      setLoadingId(null);
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
  });

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
    onSettled: () => {
      setLoadingId(null);
      setConfirmDelete(null);
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
  });

  if (isLoading) return <TableSkeleton />;

  if (isError)
    return (
      <ErrorState
        message={(error as Error)?.message}
        onRetry={() => refetch()}
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

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Virtual Machines ({vms?.length ?? 0})
          </h2>

          <div className="flex gap-2">
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button asChild>
              <Link to="/dashboard/vms/create">
                <Plus className="mr-1 h-4 w-4" />
                Create
              </Link>
            </Button>
          </div>
        </div>

        {/* List */}
        {vms?.map((vm) => (
          <div
            key={vm.id}
            className="flex justify-between items-center border border-border bg-card p-4 rounded-lg hover:bg-muted/20 transition"
          >
            <div>
              <p className="text-white font-semibold">{vm.name}</p>
              <p className="text-sm text-gray-400">
                {vm.cpu} • {vm.ram} • {vm.ip}
              </p>
              <p
                className={`text-xs mt-1 ${
                  vm.status === "running"
                    ? "text-green-400"
                    : "text-gray-500"
                }`}
              >
                ● {vm.status}
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
                {vm.status === "running" ? (
                  <Square className="text-yellow-400" />
                ) : (
                  <Play className="text-green-400" />
                )}
              </Button>

              <Button
                size="icon"
                disabled={loadingId === vm.id}
                onClick={() => setConfirmDelete(vm)}
              >
                <Trash2 className="text-red-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VirtualMachines;