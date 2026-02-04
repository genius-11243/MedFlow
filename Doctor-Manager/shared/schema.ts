import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("viewer"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").notNull().default("light"),
  language: text("language").notNull().default("ar"),
});

export const dashboards = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  shareData: boolean("share_data").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctorShifts = pgTable("doctor_shifts", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  shiftTime: text("shift_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shiftCounts = pgTable("shift_counts", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id").notNull(),
  member1: integer("member1").default(0),
  member2: integer("member2").default(0),
  member3: integer("member3").default(0),
  privateCount: integer("private_count").default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDashboardSchema = createInsertSchema(dashboards).omit({ id: true, createdAt: true });
export const insertDoctorShiftSchema = createInsertSchema(doctorShifts).omit({ id: true, createdAt: true });
export const insertShiftCountSchema = createInsertSchema(shiftCounts).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDashboard = z.infer<typeof insertDashboardSchema>;
export type Dashboard = typeof dashboards.$inferSelect;
export type DoctorShift = typeof doctorShifts.$inferSelect;
export type InsertDoctorShift = z.infer<typeof insertDoctorShiftSchema>;
export type ShiftCount = typeof shiftCounts.$inferSelect;
export type InsertShiftCount = z.infer<typeof insertShiftCountSchema>;

export type DoctorShiftWithCounts = DoctorShift & {
  counts: ShiftCount | null;
};

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const updateAccountSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  avatarUrl: z.string().optional(),
  theme: z.enum(["light", "dark"]).optional(),
  language: z.enum(["ar", "en"]).optional(),
});

export type UpdateAccountRequest = z.infer<typeof updateAccountSchema>;
