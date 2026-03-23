import * as service from "./vendor.service.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

/* ================= PUBLIC ================= */

export const getPublicVendors = asyncHandler(async (req, res) => {
  const { search = "", station, page = 1, limit = 10 } = req.query;

  const result = await service.getPublicVendors({
    search,
    station,
    page: Number(page),
    limit: Number(limit),
  });

  return sendSuccess(res, "Vendors fetched", result.data, result.meta);
});

/* ================= ADMIN ================= */

export const getAdminVendors = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const result = await service.getAdminVendors({
    search,
    page: Number(page),
    limit: Number(limit),
  });

  return sendSuccess(res, "Vendor brands fetched", result.data, result.meta);
});

export const getAdminVendorOutlets = asyncHandler(async (req, res) => {
  const { search = "", station, page = 1, limit = 10 } = req.query;

  const result = await service.getAdminVendorOutlets({
    search,
    station,
    page: Number(page),
    limit: Number(limit),
  });

  return sendSuccess(res, "Vendor outlets fetched", result.data, result.meta);
});

export const getSingleVendor = asyncHandler(async (req, res) => {
  const data = await service.getSingleVendor(req.params.id);
  return sendSuccess(res, "Vendor details fetched", data);
});

export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await service.createVendor(req.body);
  return sendSuccess(res, "Vendor created", vendor, null, 201);
});

export const createVendorOutlet = asyncHandler(async (req, res) => {
  const outlet = await service.createVendorOutlet(req.body);
  return sendSuccess(res, "Vendor outlet created", outlet, null, 201);
});

export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await service.updateVendor(req.params.id, req.body);
  return sendSuccess(res, "Vendor updated", vendor);
});

export const updateVendorOutlet = asyncHandler(async (req, res) => {
  const outlet = await service.updateVendorOutlet(req.params.id, req.body);
  return sendSuccess(res, "Vendor outlet updated", outlet);
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await service.approveVendor(req.params.id);
  return sendSuccess(res, "Vendor approved", vendor);
});

export const deleteVendor = asyncHandler(async (req, res) => {
  await service.deleteVendor(req.params.id);
  return sendSuccess(res, "Vendor deactivated");
});

export const deleteVendorOutlet = asyncHandler(async (req, res) => {
  await service.deleteVendorOutlet(req.params.id);
  return sendSuccess(res, "Vendor outlet deactivated");
});