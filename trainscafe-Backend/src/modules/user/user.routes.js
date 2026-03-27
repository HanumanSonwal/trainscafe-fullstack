import express from "express";
import {
  createSubAdminController,
  deleteCustomerController,
  deleteSubAdminController,
  getAllCustomersController,
  getAllSubAdminsController,
  getSingleCustomerController,
  getSingleSubAdminController,
  updateSubAdminController,
} from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createSubAdminValidation,
  updateSubAdminValidation,
} from "./user.validation.js";

const router = express.Router();

router.post(
  "/sub-admin",
  protect,
  authorizeRoles("admin"),
  validate(createSubAdminValidation),
  createSubAdminController,
);

router.get(
  "/sub-admin",
  protect,
  authorizeRoles("admin"),
  getAllSubAdminsController,
);

router.get(
  "/sub-admin/:id",
  protect,
  authorizeRoles("admin"),
  getSingleSubAdminController,
);

router.put(
  "/sub-admin/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateSubAdminValidation),
  updateSubAdminController,
);

router.delete(
  "/sub-admin/:id",
  protect,
  authorizeRoles("admin"),
  deleteSubAdminController,
);

router.get(
  "/user",
  protect,
  authorizeRoles("admin", "sub-admin"),
  getAllCustomersController,
);
router.get(
  "/user/:id",
  protect,
  authorizeRoles("admin", "sub-admin"),
  getSingleCustomerController,
);
router.delete(
  "/user/:id",
  protect,
  authorizeRoles("admin", "sub-admin"),
  deleteCustomerController,
);

export default router;
