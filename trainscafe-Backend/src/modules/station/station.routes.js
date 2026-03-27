import express from "express";
import {
  getPublicStations,
  getAdminStations,
  createStation,
  updateStation,
  deleteStation,
  getSingleStation,
} from "./station.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  checkPermission("station", "read"),
  getAdminStations,
);

router.get(
  "/admin/:id",
  protect,
  checkPermission("station", "read"),
  getSingleStation,
);

router.post(
  "/admin",
  protect,
  checkPermission("station", "create"),
  createStation,
);

router.patch(
  "/admin/:id",
  protect,
  checkPermission("station", "update"),
  updateStation,
);

router.delete(
  "/admin/:id",
  protect,
  checkPermission("station", "delete"),
  deleteStation,
);

router.get("/", getPublicStations);
router.get("/:id", getSingleStation);

export default router;
