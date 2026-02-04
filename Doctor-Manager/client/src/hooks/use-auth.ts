import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useLocation } from "wouter";
import type { LoginRequest, User as SchemaUser } from "@shared/schema";
import { z } from "zod";

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'editor' | 'viewer';
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  avatarUrl?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check local storage on mount
    const stored = localStorage.getItem("doctor_app_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("doctor_app_user");
      }
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("بيانات الدخول غير صحيحة");
        throw new Error("حدث خطأ أثناء تسجيل الدخول");
      }
      
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data: SchemaUser) => {
      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: (data.role === 'editor' || data.role === 'viewer') ? data.role : 'viewer',
        theme: (data.theme === 'light' || data.theme === 'dark') ? data.theme : 'light',
        language: (data.language === 'ar' || data.language === 'en') ? data.language : 'ar',
        avatarUrl: data.avatarUrl || null,
      };
      setUser(user);
      localStorage.setItem("doctor_app_user", JSON.stringify(user));
      setLocation("/dashboards");
    },
  });

  const loginWithoutRedirectMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("بيانات الدخول غير صحيحة");
        throw new Error("حدث خطأ أثناء تسجيل الدخول");
      }
      
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data: SchemaUser) => {
      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: (data.role === 'editor' || data.role === 'viewer') ? data.role : 'viewer',
        theme: (data.theme === 'light' || data.theme === 'dark') ? data.theme : 'light',
        language: (data.language === 'ar' || data.language === 'en') ? data.language : 'ar',
        avatarUrl: data.avatarUrl || null,
      };
      setUser(user);
      localStorage.setItem("doctor_app_user", JSON.stringify(user));
    },
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("doctor_app_user");
    setLocation("/login");
  };

  const updateUserLocally = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem("doctor_app_user", JSON.stringify(newUser));
    }
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    loginWithoutRedirect: loginWithoutRedirectMutation.mutate,
    isLoggingIn: loginMutation.isPending || loginWithoutRedirectMutation.isPending,
    loginError: loginMutation.error || loginWithoutRedirectMutation.error,
    logout,
    updateUserLocally,
    isEditor: user?.role === 'editor',
  };
}
