import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Play, Square, Trash2, AlertCircle, RefreshCw, AlertTriangle, Server } from "lucide-react";
import { TableSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { toast } from "sonner";

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

const API = "https://cloud-nova.onrender.com";

const fetchVMs = async (): Promise<VM[]> => {
const res = await fetch(`${API}/api/vms`);
  if (!res.ok) throw new Error(`Failed to fetch VMs (${res.status})`);
  return res.json();
};

const toggleVMStatus = async ({ id, status }: { id: string; status: "running" | "stopped" }) => {
  const action = status === "running" ? "stop" : "start";
  const res = await fetch(`${API}/api/vms/${id}/${action}`, { method: "PUT" });
  if (!res.ok) throw new Error(`Failed to ${action} VM`);
  return res.json();
};

const deleteVM = async (id: string) => {
  const res = await fetch(`${API}/api/vms/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete VM");
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
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Dialog */}
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
        Are you sure you want to delete{" "}
        <span className="font-mono font-semibold text-foreground">{vmName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </motion.div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-6 w-6 text-destructive" />
    </div>
    <div>
      <p className="font-semibold text-foreground">Failed to load virtual machines</p>
      <p className="text-sm text-muted-foreground mt-1">{message}</p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
      <RefreshCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

// ─── VirtualMachines ──────────────────────────────────────────────────────────

const VirtualMachines = () => {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState<VM | null>(null);

  // ── Fetch VMs ──
  const { data: vms, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vms"],
    queryFn: fetchVMs,
    staleTime: 15_000,
    retry: 2,
  });

  // ── Toggle status mutation ──
  const toggleMutation = useMutation({
    mutationFn: toggleVMStatus,
    onMutate: async ({ id, status }) => {
      // Optimistic update
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
    onError: (_err, { status }, context) => {
      // Rollback on error
      queryClient.setQueryData(["vms"], context?.previous);
      toast.error(`Failed to ${status === "running" ? "stop" : "start"} VM`, {
        description: "Please try again.",
      });
    },
    onSuccess: (_data, { status }) => {
      toast.success(`VM ${status === "running" ? "stopped" : "started"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
  });

  // ── Delete mutation ──
  const deleteMutation = useMutation({
    mutationFn: deleteVM,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["vms"] });
      const previous = queryClient.getQueryData<VM[]>(["vms"]);
      queryClient.setQueryData<VM[]>(["vms"], (old) =>
        old?.filter((vm) => vm.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["vms"], context?.previous);
      toast.error("Failed to delete VM", { description: "Please try again." });
    },
    onSuccess: () => {
      toast.success("VM deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vms"] });
    },
    onSettled: () => setConfirmDelete(null),
  });

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-9 w-32 rounded-md bg-muted animate-pulse" />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <ErrorState
        message={(error as Error)?.message ?? "Unknown error"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      {/* Confirm delete dialog */}
      {confirmDelete && (
        <ConfirmDeleteDialog
          vmName={confirmDelete.name}
          onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Virtual Machines</h2>
            <p className="text-sm text-muted-foreground">{vms?.length ?? 0} instances</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/dashboard/vms/create">
                <Plus className="h-4 w-4 mr-1" /> Create Server
              </Link>
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {vms?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-xl border border-border bg-card">
            <Server className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">No virtual machines yet</p>
            <p className="text-sm text-muted-foreground">Create your first server to get started.</p>
            <Button variant="hero" size="sm" asChild className="mt-2">
              <Link to="/dashboard/vms/create">
                <Plus className="h-4 w-4 mr-1" /> Create Server
              </Link>
            </Button>
          </div>
        )}

        {/* Table */}
        {vms && vms.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">CPU</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">RAM</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">IP Address</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vms.map((vm) => (
                    <tr
                      key={vm.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground font-mono text-xs">{vm.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${vm.status === "running" ? "text-success" : "text-muted-foreground"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${vm.status === "running" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                          {vm.status === "running" ? "Running" : "Stopped"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{vm.cpu}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{vm.ram}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">{vm.ip}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle start/stop */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={toggleMutation.isPending}
                            onClick={() => toggleMutation.mutate({ id: vm.id, status: vm.status })}
                            title={vm.status === "running" ? "Stop VM" : "Start VM"}
                          >
                            {vm.status === "running" ? (
                              <Square className="h-3.5 w-3.5 text-warning" />
                            ) : (
                              <Play className="h-3.5 w-3.5 text-success" />
                            )}
                          </Button>
                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={deleteMutation.isPending}
                            onClick={() => setConfirmDelete(vm)}
                            title="Delete VM"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </motion.div>
    </>
  );
};

export default VirtualMachines;
