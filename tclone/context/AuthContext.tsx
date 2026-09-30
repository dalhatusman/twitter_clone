"use client";
import api from "@/lib/api";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useState } from "react";

interface IUser {
  username: string;
  full_name: string;
  bio: string;
  profile_picture: string | null;
}

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("access_token");
        const username = sessionStorage.getItem("username");

        if (token && username) {
          try {
            const { data } = await api.get(`/profiles/${username}/`);
            setUser(data);
          } catch {
            sessionStorage.clear();
          }
        }
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  async function login(usernameOrEmail: string, password: string) {
    try {
      const { data } = await api.post("/token/", {
        username: usernameOrEmail,
        password,
      });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("access_token", data.access);
        sessionStorage.setItem("refresh_token", data.refresh);

        const payload = JSON.parse(atob(data.access.split(".")[1]));
        const profileRes = await api.get(
          `/profiles/${payload.username ?? usernameOrEmail}/`,
        );

        sessionStorage.setItem("username", profileRes.data.username);
        setUser(profileRes.data);
      }
    } catch (error) {
      throw error;
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      await api.post("/register/", {
        username,
        email,
        password,
      });
      await login(username, password);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    if (typeof window !== "undefined") {
      const refresh_token = sessionStorage.getItem("refresh_token");
      try {
        await api.post("/logout/", {
          refresh: refresh_token,
        });
      } catch {}
      sessionStorage.clear();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used within AuthProvider");
  }
  return context;
}
