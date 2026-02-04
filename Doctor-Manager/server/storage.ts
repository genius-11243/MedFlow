import { db } from "./db";
import {
  users,
  dashboards,
  doctorShifts,
  shiftCounts,
  type User,
  type InsertUser,
  type Dashboard,
  type InsertDashboard,
  type DoctorShift,
  type InsertDoctorShift,
  type ShiftCount,
  type InsertShiftCount,
  type DoctorShiftWithCounts,
  type UpdateAccountRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateAccountRequest): Promise<User>;

  // Dashboards
  getDashboards(): Promise<Dashboard[]>;
  createDashboard(dashboard: InsertDashboard): Promise<Dashboard>;
  deleteDashboard(id: number): Promise<void>;

  // Shifts
  getShiftsByDashboardId(dashboardId: number): Promise<DoctorShiftWithCounts[]>;
  createShift(shift: InsertDoctorShift): Promise<DoctorShiftWithCounts>;
  deleteShift(id: number): Promise<void>;

  // Counts
  updateShiftCounts(shiftId: number, counts: Partial<InsertShiftCount>): Promise<ShiftCount>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: UpdateAccountRequest): Promise<User> {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getDashboards(): Promise<Dashboard[]> {
    return await db.select().from(dashboards).orderBy(desc(dashboards.createdAt));
  }

  async createDashboard(dashboard: InsertDashboard): Promise<Dashboard> {
    const [newDashboard] = await db.insert(dashboards).values(dashboard).returning();
    return newDashboard;
  }

  async deleteDashboard(id: number): Promise<void> {
    const shifts = await db.select().from(doctorShifts).where(eq(doctorShifts.dashboardId, id));
    for (const shift of shifts) {
      await db.delete(shiftCounts).where(eq(shiftCounts.shiftId, shift.id));
    }
    await db.delete(doctorShifts).where(eq(doctorShifts.dashboardId, id));
    await db.delete(dashboards).where(eq(dashboards.id, id));
  }

  async getShiftsByDashboardId(dashboardId: number): Promise<DoctorShiftWithCounts[]> {
    const shifts = await db.select().from(doctorShifts).where(eq(doctorShifts.dashboardId, dashboardId));
    const results: DoctorShiftWithCounts[] = [];
    for (const shift of shifts) {
      const [counts] = await db.select().from(shiftCounts).where(eq(shiftCounts.shiftId, shift.id));
      results.push({ ...shift, counts: counts || null });
    }
    return results;
  }

  async createShift(shift: InsertDoctorShift): Promise<DoctorShiftWithCounts> {
    const [newShift] = await db.insert(doctorShifts).values(shift).returning();
    const [counts] = await db.insert(shiftCounts).values({
      shiftId: newShift.id,
      member1: 0, 
      member2: 0, 
      member3: 0, 
      privateCount: 0
    }).returning();
    return { ...newShift, counts };
  }

  async deleteShift(id: number): Promise<void> {
    await db.delete(shiftCounts).where(eq(shiftCounts.shiftId, id));
    await db.delete(doctorShifts).where(eq(doctorShifts.id, id));
  }

  async updateShiftCounts(shiftId: number, updates: Partial<InsertShiftCount>): Promise<ShiftCount> {
    const [updated] = await db.update(shiftCounts).set(updates).where(eq(shiftCounts.shiftId, shiftId)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
