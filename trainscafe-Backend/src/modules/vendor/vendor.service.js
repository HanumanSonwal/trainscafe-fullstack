import Vendor from "./vendor.model.js";
import VendorOutlet from "./vendorOutlet.model.js";

/* ======================================================
   CREATE
====================================================== */

export const createVendor = async (data) => {
  return await Vendor.create(data);
};

export const createVendorOutlet = async (data) => {
  return await VendorOutlet.create(data);
};

/* ======================================================
   UPDATE
====================================================== */

export const updateVendor = async (id, body) => {
  const vendor = await Vendor.findByIdAndUpdate(id, body, { new: true });
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
};

export const updateVendorOutlet = async (id, body) => {
  const outlet = await VendorOutlet.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!outlet) throw new Error("Vendor outlet not found");
  return outlet;
};

/* ======================================================
   APPROVE
====================================================== */

export const approveVendor = async (id) => {
  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
};

/* ======================================================
   DELETE (Soft + Cascade)
====================================================== */

export const deleteVendor = async (id) => {
  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!vendor) throw new Error("Vendor not found");

  await VendorOutlet.updateMany(
    { vendor: id },
    { isActive: false }
  );

  return vendor;
};

export const deleteVendorOutlet = async (id) => {
  const outlet = await VendorOutlet.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!outlet) throw new Error("Vendor outlet not found");

  return outlet;
};

/* ======================================================
   GET ADMIN - BRAND LEVEL
====================================================== */

export const getAdminVendors = async ({ search, page, limit }) => {
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

  return {
    data,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   GET ADMIN - OUTLET LEVEL
====================================================== */

export const getAdminVendorOutlets = async ({
  search,
  station,
  page,
  limit,
}) => {
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
    .populate({
      path: "vendor",
      match: vendorMatch,
    })
    .populate("station", "name code")
    .skip(skip)
    .limit(limit)
    .lean();

  const filtered = outlets.filter((o) => o.vendor !== null);

  const total = await VendorOutlet.countDocuments(outletQuery);

  return {
    data: filtered,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   GET PUBLIC (Station Wise)
====================================================== */

export const getPublicVendors = async ({
  search,
  station,
  page,
  limit,
}) => {
  const skip = (page - 1) * limit;

  const outletQuery = {
    isActive: true,
  };

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
    .populate({
      path: "vendor",
      match: vendorMatch,
    })
    .populate("station", "name code")
    .skip(skip)
    .limit(limit)
    .lean();

  const filtered = outlets.filter((o) => o.vendor !== null);

  const total = await VendorOutlet.countDocuments(outletQuery);

  return {
    data: filtered,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   GET SINGLE VENDOR (Admin)
====================================================== */

export const getSingleVendor = async (id) => {
  const vendor = await Vendor.findById(id).lean();
  if (!vendor) throw new Error("Vendor not found");

  const outlets = await VendorOutlet.find({ vendor: id })
    .populate("station", "name code")
    .lean();

  return { vendor, outlets };
};