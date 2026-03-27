import {
  createSubAdmin,
  deleteSubAdmin,
  getAllSubAdmins,
  getSingleSubAdmin,
  updateSubAdmin,
  getAllCustomers,
  getSingleCustomer,
  deleteCustomer,
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

export const getAllCustomersController = asyncHandler(async (req, res) => {
  const result = await getAllCustomers(req.query);

  sendSuccess(res, "Customer list fetched", result.data, result.pagination);
});

export const getSingleCustomerController = asyncHandler(async (req, res) => {
  const user = await getSingleCustomer(req.params.id);

  sendSuccess(res, "Customer fetched", user);
});

export const deleteCustomerController = asyncHandler(async (req, res) => {
  await deleteCustomer(req.params.id);

  sendSuccess(res, "Customer deleted successfully");
});

export const getProfileController = asyncHandler(async (req, res) => {
  sendSuccess(res, "Profile fetched", req.user);
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const updatedUser = await updateSubAdmin(req.user._id, req.body);

  sendSuccess(res, "Profile updated successfully", updatedUser);
});

export const deleteProfileController = asyncHandler(async (req, res) => {
  await deleteSubAdmin(req.user._id, req.user._id);

  sendSuccess(res, "Profile deleted successfully");
});
