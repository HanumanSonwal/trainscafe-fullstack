"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getMe } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (pathname === "/login") return;

    const fetchUser = async () => {
      try {
        const res = await getMe();

        if (res.success) {
          setUser(res.data);
        }
      } catch {
        clearUser();
      }
    };

    fetchUser();
  }, [pathname]);

  return children;
}
