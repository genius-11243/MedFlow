import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertDashboard } from "@shared/schema";

export function useDashboards() {
  return useQuery({
    queryKey: [api.dashboards.list.path],
    queryFn: async () => {
      const res = await fetch(api.dashboards.list.path);
      if (!res.ok) throw new Error("Failed to fetch dashboards");
      return api.dashboards.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDashboard) => {
      const res = await fetch(api.dashboards.create.path, {
        method: api.dashboards.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to create dashboard");
      return api.dashboards.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboards.list.path] });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.dashboards.delete.path, { id });
      const res = await fetch(url, { method: api.dashboards.delete.method });
      if (!res.ok) throw new Error("Failed to delete dashboard");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboards.list.path] });
    },
  });
}
