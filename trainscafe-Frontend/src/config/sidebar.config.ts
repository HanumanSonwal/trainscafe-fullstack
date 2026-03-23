import {
  LayoutDashboard,
  Store,
  Users,
  MapPin,
  ClipboardList,
} from "lucide-react"

import { SidebarItem } from "@/types/sidebar.types"

export const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/control",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    label: "Stations",
    href: "/control/stations",
    icon: MapPin,
    permission: "station",
  },
  {
    label: "Vendors",
    href: "/control/vendors",
    icon: Store,
    permission: "vendor",
  },
  {
    label: "Orders",
    href: "/control/orders",
    icon: ClipboardList,
    permission: "order",
  },
  {
    label: "Users",
    href: "/control/users",
    icon: Users,
    permission: "user",
  },
]