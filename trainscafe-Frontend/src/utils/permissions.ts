import { User } from "@/types/user.types";
import { Permissions } from "@/types/permission.types";

type Action = "read" | "write" | "update" | "delete";

export const can = (
  user: User | null,
  module: keyof Permissions,
  action: Action,
): boolean => {
  if (!user) return false;

  if (user.role === "admin") return true;

  return user.permissions?.[module]?.[action] ?? false;
};

export const canRead = (user: User | null, module: keyof Permissions) => {
  return can(user, module, "read");
};

export const canWrite = (user: User | null, module: keyof Permissions) => {
  return can(user, module, "write");
};

export const canUpdate = (user: User | null, module: keyof Permissions) => {
  return can(user, module, "update");
};

export const canDelete = (user: User | null, module: keyof Permissions) => {
  return can(user, module, "delete");
};
