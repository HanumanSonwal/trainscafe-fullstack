import express from "express";
import {
  getPublicVendors,
  getAdminVendors,
  getAdminVendorOutlets,
  getSingleVendor,
  createVendor,
  createVendorOutlet,
  updateVendor,
  updateVendorOutlet,
  approveVendor,
  deleteVendor,
  deleteVendorOutlet,
} from "./vendor.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import {
  createVendorSchema,
  updateVendorSchema,
  createVendorOutletSchema,
  updateVendorOutletSchema,
} from "./vendor.validation.js";

import { protect } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";

const router = express.Router();

/* =========================================================
   🌍 PUBLIC ROUTES
   ========================================================= */

router.get("/", getPublicVendors);

/* =========================================================
   👑 ADMIN / SUBADMIN ROUTES
   ========================================================= */

/* ================= BRAND LEVEL ================= */

// ⚠️ Specific routes first (avoid route conflict)

router.get(
  "/admin/outlets",
  protect,
  checkPermission("vendor", "read"),
  getAdminVendorOutlets
);

router.patch(
  "/admin/:id/approve",
  protect,
  checkPermission("vendor", "approve"),
  approveVendor
);

// -------- Vendor Brand CRUD --------

router.get(
  "/admin",
  protect,
  checkPermission("vendor", "read"),
  getAdminVendors
);

router.get(
  "/admin/:id",
  protect,
  checkPermission("vendor", "read"),
  getSingleVendor
);

router.post(
  "/admin",
  protect,
  checkPermission("vendor", "create"),
  validate(createVendorSchema),
  createVendor
);

router.patch(
  "/admin/:id",
  protect,
  checkPermission("vendor", "update"),
  validate(updateVendorSchema),
  updateVendor
);

router.delete(
  "/admin/:id",
  protect,
  checkPermission("vendor", "delete"),
  deleteVendor
);

/* ================= OUTLET LEVEL ================= */

router.post(
  "/admin/outlet",
  protect,
  checkPermission("vendor", "create"),
  validate(createVendorOutletSchema),
  createVendorOutlet
);

router.patch(
  "/admin/outlet/:id",
  protect,
  checkPermission("vendor", "update"),
  validate(updateVendorOutletSchema),
  updateVendorOutlet
);

router.delete(
  "/admin/outlet/:id",
  protect,
  checkPermission("vendor", "delete"),
  deleteVendorOutlet
);

export default router;