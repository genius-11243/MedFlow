import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.auth.login.path, async (req, res) => {
    const { email, password } = req.body;
    
    // Check specific editor credentials
    const editors = [
      { email: 'dr.merna.ayoub@gmail.com', pass: 'Mernamina@11' },
      { email: 'arsany.mina.nile@gmail.com', pass: 'Arsanymina@11' }
    ];

    const editorMatch = editors.find(e => e.email === email && e.pass === password);
    
    let user = await storage.getUserByEmail(email);
    
    if (editorMatch) {
      if (!user) {
        user = await storage.createUser({
          email,
          password,
          name: email.split('@')[0],
          role: 'editor',
          theme: 'light',
          language: 'ar'
        });
      }
      return res.json(user);
    }

    // For viewers, any other login works (simple for MVP)
    if (!user) {
      user = await storage.createUser({
        email,
        password,
        name: email.split('@')[0],
        role: 'viewer',
        theme: 'light',
        language: 'ar'
      });
    }
    res.json(user);
  });

  app.patch(api.auth.updateAccount.path, async (req, res) => {
    // In a real app we'd get userId from session. For now, assume it's passed or use a mock.
    // The frontend should send the userId or we use the logged in state.
    const { userId, ...updates } = req.body;
    const user = await storage.updateUser(userId, updates);
    res.json(user);
  });

  app.get(api.dashboards.list.path, async (req, res) => {
    const dashboards = await storage.getDashboards();
    res.json(dashboards);
  });

  app.post(api.dashboards.create.path, async (req, res) => {
    const dashboard = await storage.createDashboard(req.body);
    res.status(201).json(dashboard);
  });

  app.delete(api.dashboards.delete.path, async (req, res) => {
    await storage.deleteDashboard(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.shifts.list.path, async (req, res) => {
    const shifts = await storage.getShiftsByDashboardId(Number(req.params.dashboardId));
    res.json(shifts);
  });

  app.post(api.shifts.create.path, async (req, res) => {
    const shift = await storage.createShift(req.body);
    res.status(201).json(shift);
  });

  app.delete(api.shifts.delete.path, async (req, res) => {
    await storage.deleteShift(Number(req.params.id));
    res.status(204).send();
  });

  app.put(api.counts.update.path, async (req, res) => {
    const updated = await storage.updateShiftCounts(Number(req.params.shiftId), req.body);
    res.json(updated);
  });

  return httpServer;
}
