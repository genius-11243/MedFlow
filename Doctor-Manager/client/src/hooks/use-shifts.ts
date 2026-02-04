import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertDoctorShift, InsertShiftCount } from "@shared/schema";

export function useShifts(dashboardId: number) {
  const path = buildUrl(api.shifts.list.path, { dashboardId });
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to fetch shifts");
      return api.shifts.list.responses[200].parse(await res.json());
    },
    enabled: !!dashboardId,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDoctorShift) => {
      const res = await fetch(api.shifts.create.path, {
        method: api.shifts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to create shift");
      return api.shifts.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      const path = buildUrl(api.shifts.list.path, { dashboardId: data.dashboardId });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dashboardId }: { id: number; dashboardId: number }) => {
      const url = buildUrl(api.shifts.delete.path, { id });
      const res = await fetch(url, { method: api.shifts.delete.method });
      if (!res.ok) throw new Error("Failed to delete shift");
      return dashboardId;
    },
    onSuccess: (dashboardId) => {
      const path = buildUrl(api.shifts.list.path, { dashboardId });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
  });
}

export function useUpdateShiftCounts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ shiftId, dashboardId, counts }: { shiftId: number; dashboardId: number; counts: Partial<InsertShiftCount> }) => {
      const url = buildUrl(api.counts.update.path, { shiftId });
      const res = await fetch(url, {
        method: api.counts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(counts),
      });
      
      if (!res.ok) throw new Error("Failed to update counts");
      return api.counts.update.responses[200].parse(await res.json());
    },
    onMutate: async ({ shiftId, dashboardId, counts }) => {
      const path = buildUrl(api.shifts.list.path, { dashboardId });
      await queryClient.cancelQueries({ queryKey: [path] });
      const previousShifts = queryClient.getQueryData([path]);
      
      queryClient.setQueryData([path], (old: any) => {
        if (!old) return old;
        return old.map((shift: any) => {
          if (shift.id === shiftId) {
            return {
              ...shift,
              counts: { ...(shift.counts || {}), ...counts }
            };
          }
          return shift;
        });
      });
      
      return { previousShifts };
    },
    onError: (err, newTodo, context) => {
      const path = buildUrl(api.shifts.list.path, { dashboardId: newTodo.dashboardId });
      queryClient.setQueryData([path], context?.previousShifts);
    },
    onSettled: (data, error, variables) => {
      const path = buildUrl(api.shifts.list.path, { dashboardId: variables.dashboardId });
      queryClient.invalidateQueries({ queryKey: [path] });
    },
  });
}
