"use client";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.replace("/control");
    }
  }, [user, router]);
  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center bg-background p-6">
      {/* Logo */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        <Image
          src="/images/logo.svg"
          alt="TrainsCafe Logo"
          width={48}
          height={48}
          priority
          className="h-12 w-auto"
        />

        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold text-primary">TrainsCafe</span>

          <span className="text-xs text-muted-foreground">
            Admin & Subadmin Panel
          </span>

          <ThemeToggle />
        </div>
      </div>

      <LoginForm />
    </div>
  );
}
