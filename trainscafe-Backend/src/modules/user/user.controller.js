import {
  createSubAdmin,
  deleteSubAdmin,
  getAllSubAdmins,
  getSingleSubAdmin,
  updateSubAdmin,
} from "./user.service.js";

import { sendSuccess } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export const createSubAdminController = asyncHandler(async (req, res) => {
  const user = await createSubAdmin(req.body);

  sendSuccess(res, "Sub-admin created successfully", user, null, 201);
});

export const getAllSubAdminsController = asyncHandler(async (req, res) => {
  const result = await getAllSubAdmins(req.query);

  sendSuccess(res, "Sub-admin list fetched", result.data, result.pagination);
});

export const getSingleSubAdminController = asyncHandler(async (req, res) => {
  const user = await getSingleSubAdmin(req.params.id);

  sendSuccess(res, "Sub-admin fetched", user);
});

export const updateSubAdminController = asyncHandler(async (req, res) => {
  const user = await updateSubAdmin(req.params.id, req.body);

  sendSuccess(res, "Sub-admin updated successfully", user);
});

export const deleteSubAdminController = asyncHandler(async (req, res) => {
  await deleteSubAdmin(req.params.id, req.user._id);

  sendSuccess(res, "Sub-admin deleted successfully");
});
