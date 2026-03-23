"use client"

import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.role !== "vendor") {
      router.replace("/control")
    }

  }, [user])

  return children
}