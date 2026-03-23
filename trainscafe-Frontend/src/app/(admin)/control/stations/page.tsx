"use client";

import { useAuthStore } from "@/store/auth.store";
import { canRead } from "@/utils/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StationPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // if (!canRead(user?.permissions, "station")) {
    //   router.replace("/control")
    // }
  }, [user]);

  return <div>Station Management</div>;
}
