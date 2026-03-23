"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";

export default function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "vendor") {
      router.replace("/supplier");
    }
  }, [user]);

  return <AdminLayout>{children}</AdminLayout>;
}
