"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useAuthStore } from "@/store/auth.store"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/services/auth.service"
import { useRouter } from "next/navigation"

export function AdminHeader() {

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const router = useRouter()

  const handleLogout = async () => {

    await logoutUser()

    logout()

    router.replace("/login")

  }

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-background">

      <div className="font-medium">
        Dashboard
      </div>

      <div className="flex items-center gap-4">

        <span className="text-sm text-muted-foreground">
          {user?.name}
        </span>

        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>

      </div>

    </header>
  )
}