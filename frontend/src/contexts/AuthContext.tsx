"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email?: string };

type AuthContextType = {
  user: User | null;
  login: (name: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const STORAGE_KEY = "it_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to restore auth state", e);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (name: string, password: string) => {
    // Minimal / mock auth: accept any non-empty name/password
    if (!name || !password) return false;
    const u: User = { id: Date.now().toString(), name };
    setUser(u);
    return true;
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) return false;
    const u: User = { id: Date.now().toString(), name, email };
    setUser(u);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
