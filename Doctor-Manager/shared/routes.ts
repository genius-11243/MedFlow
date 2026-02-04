import { z } from 'zod';
import { 
  insertDashboardSchema, 
  insertDoctorShiftSchema, 
  insertShiftCountSchema,
  loginSchema,
  updateAccountSchema,
  users,
  dashboards,
  doctorShifts,
  shiftCounts
} from './schema';

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    updateAccount: {
      method: 'PATCH' as const,
      path: '/api/account',
      input: updateAccountSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    }
  },
  dashboards: {
    list: {
      method: 'GET' as const,
      path: '/api/dashboards',
      responses: {
        200: z.array(z.custom<typeof dashboards.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/dashboards',
      input: insertDashboardSchema,
      responses: {
        201: z.custom<typeof dashboards.$inferSelect>(),
        403: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/dashboards/:id',
      responses: {
        204: z.void(),
        403: z.object({ message: z.string() }),
      },
    },
  },
  shifts: {
    list: {
      method: 'GET' as const,
      path: '/api/dashboards/:dashboardId/shifts',
      responses: {
        200: z.array(z.custom<typeof doctorShifts.$inferSelect & { counts: typeof shiftCounts.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/shifts',
      input: insertDoctorShiftSchema,
      responses: {
        201: z.custom<typeof doctorShifts.$inferSelect & { counts: typeof shiftCounts.$inferSelect }>(),
        403: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/shifts/:id',
      responses: {
        204: z.void(),
        403: z.object({ message: z.string() }),
      },
    },
  },
  counts: {
    update: {
      method: 'PUT' as const,
      path: '/api/shifts/:shiftId/counts',
      input: insertShiftCountSchema.partial(),
      responses: {
        200: z.custom<typeof shiftCounts.$inferSelect>(),
        403: z.object({ message: z.string() }),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
