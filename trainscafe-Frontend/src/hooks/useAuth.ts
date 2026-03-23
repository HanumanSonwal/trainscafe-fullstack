"use client"

import { useEffect } from "react"
import { getMe } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"

export const useAuth = () => {

  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await getMe()

        if (res.success) {
          setUser(res.data)
        } else {
          clearUser()
        }

      } catch {

        clearUser()

      }

    }

    fetchUser()

  }, [])

}