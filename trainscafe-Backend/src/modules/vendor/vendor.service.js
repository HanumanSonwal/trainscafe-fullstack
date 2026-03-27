import Vendor from "./vendor.model.js";
import VendorOutlet from "./vendorOutlet.model.js";
import ApiError from "../../utils/ApiError.js";

import {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern,
} from "../../utils/cache.js";

export const createVendor = async (data) => {
  const vendor = await Vendor.create(data);

  await deleteByPattern("adminVendors:*");
  await deleteByPattern("publicVendors:*");

  return vendor;
};

export const createVendorOutlet = async (data) => {
  const outlet = await VendorOutlet.create(data);

  await deleteByPattern("adminVendorOutlets:*");
  await deleteByPattern("publicVendors:*");

  return outlet;
};

export const updateVendor = async (id, body) => {
  const vendor = await Vendor.findByIdAndUpdate(id, body, { new: true });

  if (!vendor) throw new ApiError(404, "Vendor not found");

  await deleteByPattern("adminVendors:*");
  await deleteByPattern("publicVendors:*");

  return vendor;
};

export const updateVendorOutlet = async (id, body) => {
  const outlet = await VendorOutlet.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!outlet) throw new ApiError(404, "Vendor outlet not found");

  await deleteByPattern("adminVendorOutlets:*");
  await deleteByPattern("publicVendors:*");

  return outlet;
};


export const approveVendor = async (id) => {
  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true },
  );

  if (!vendor) throw new ApiError(404, "Vendor not found");

  await deleteByPattern("adminVendors:*");
  await deleteByPattern("publicVendors:*");

  return vendor;
};

export const deleteVendor = async (id) => {
  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!vendor) throw new ApiError(404, "Vendor not found");

  await VendorOutlet.updateMany({ vendor: id }, { isActive: false });

  await deleteByPattern("adminVendors:*");
  await deleteByPattern("publicVendors:*");

  return vendor;
};

export const deleteVendorOutlet = async (id) => {
  const outlet = await VendorOutlet.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!outlet) throw new ApiError(404, "Vendor outlet not found");

  await deleteByPattern("adminVendorOutlets:*");
  await deleteByPattern("publicVendors:*");

  return outlet;
};

export const getAdminVendors = async ({ search, page, limit }) => {
  const cacheKey = `adminVendors:${search || "all"}:${page}:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { vendorCode: { $regex: search, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Vendor.find(query).skip(skip).limit(limit).lean(),
    Vendor.countDocuments(query),
  ]);

  const result = {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 300);

  return result;
};

export const getAdminVendorOutlets = async ({
  search,
  station,
  page,
  limit,
}) => {
  const cacheKey = `adminVendorOutlets:${search || "all"}:${
    station || "all"
  }:${page}:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;

  const outletQuery = {};
  if (station) outletQuery.station = station;

  const vendorMatch = {};
  if (search) {
    vendorMatch.$or = [
      { name: { $regex: search, $options: "i" } },
      { vendorCode: { $regex: search, $options: "i" } },
    ];
  }

  const outlets = await VendorOutlet.find(outletQuery)
    .populate({ path: "vendor", match: vendorMatch })
    .populate("station", "name code")
    .skip(skip)
    .limit(limit)
    .lean();

  const filtered = outlets.filter((o) => o.vendor !== null);

  const total = await VendorOutlet.countDocuments(outletQuery);

  const result = {
    data: filtered,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 300);

  return result;
};

export const getPublicVendors = async ({ search, station, page, limit }) => {
  const cacheKey = `publicVendors:${search || "all"}:${
    station || "all"
  }:${page}:${limit}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const skip = (page - 1) * limit;

  const outletQuery = { isActive: true };
  if (station) outletQuery.station = station;

  const vendorMatch = {
    isActive: true,
    isApproved: true,
  };

  if (search) {
    vendorMatch.$or = [
      { name: { $regex: search, $options: "i" } },
      { vendorCode: { $regex: search, $options: "i" } },
    ];
  }

  const outlets = await VendorOutlet.find(outletQuery)
    .populate({ path: "vendor", match: vendorMatch })
    .populate("station", "name code")
    .skip(skip)
    .limit(limit)
    .lean();

  const filtered = outlets.filter((o) => o.vendor !== null);

  const total = await VendorOutlet.countDocuments(outletQuery);

  const result = {
    data: filtered,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };

  await setCache(cacheKey, result, 300);

  return result;
};

export const getSingleVendor = async (id) => {
  const vendor = await Vendor.findById(id).lean();

  if (!vendor) throw new ApiError(404, "Vendor not found");

  const outlets = await VendorOutlet.find({ vendor: id })
    .populate("station", "name code")
    .lean();

  return { vendor, outlets };
};
