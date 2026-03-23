import { LucideIcon } from "lucide-react"
import { Permissions } from "./permission.types"

export type SidebarItem = {
  label: string
  href: string
  icon: LucideIcon
  permission: keyof Permissions | null
}