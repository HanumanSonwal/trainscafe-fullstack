export interface ModulePermission {
  read: boolean
  write: boolean
  update: boolean
  delete: boolean
}

export interface Permissions {
  station?: ModulePermission
  vendor?: ModulePermission
  menu?: ModulePermission
  order?: ModulePermission
  user?: ModulePermission
}