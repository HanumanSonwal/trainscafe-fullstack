
import { Permissions } from "./permission.types"
import { Role } from "./role.types"

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  permissions: Permissions
  isEmailVerified: boolean
  isMobileVerified: boolean
  createdAt: string
  updatedAt: string
}