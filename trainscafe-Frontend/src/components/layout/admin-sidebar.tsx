"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarItems } from "@/config/sidebar.config";
import { useAuthStore } from "@/store/auth.store";
import { canRead } from "@/utils/permissions";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="w-64 border-r bg-card min-h-screen">
      <div className="p-6 text-lg font-semibold">TrainsCafe</div>

      <nav className="px-3 space-y-1">
        {sidebarItems.map((item) => {
          if (item.permission && !canRead(user, item.permission)) {
            return null;
          }

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition",
                pathname === item.href && "bg-muted font-medium",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
