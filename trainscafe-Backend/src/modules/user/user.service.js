import bcrypt from "bcryptjs";
import User from "./user.model.js";
import { sendVerificationEmail } from "../email/email.service.js";
import ApiError from "../../utils/ApiError.js";
import {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern,
} from "../../utils/cache.js";

const buildSearchQuery = (role, search, extraFields = []) => {
  const fields = ["name", "email", ...extraFields];

  return {
    role,
    $or: fields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
};

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  return { page, limit, skip, sortBy, order };
};

const getUsersByRole = async ({
  role,
  query,
  extraSearchFields = [],
  excludeFields = "-password -refreshToken",
}) => {
  const { page, limit, skip, sortBy, order } = getPagination(query);
  const search = query.search || "";

  const searchQuery = buildSearchQuery(role, search, extraSearchFields);

  const [data, total] = await Promise.all([
    User.find(searchQuery)
      .select(excludeFields)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(searchQuery),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createSubAdmin = async (data) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const subAdmin = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "sub-admin",
    permissions: data.permissions,
    isEmailVerified: false,
  });

  await deleteByPattern("subadmins:*");

  setImmediate(() => {
    sendVerificationEmail(subAdmin);
  });

  subAdmin.password = undefined;

  return subAdmin;
};

export const getAllSubAdmins = async (query) => {
  const cacheKey = `subadmins:${JSON.stringify(query)}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await getUsersByRole({
    role: "sub-admin",
    query,
  });

  await setCache(cacheKey, result, 300);

  return result;
};

export const getSingleSubAdmin = async (id) => {
  const cacheKey = `subadmin:${id}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const user = await User.findOne({
    _id: id,
    role: "sub-admin",
  }).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "Sub-admin not found");

  await setCache(cacheKey, user, 300);

  return user;
};

export const updateSubAdmin = async (id, data) => {
  const user = await User.findById(id);

  if (!user || user.role !== "sub-admin") {
    throw new ApiError(404, "Sub-admin not found");
  }

  if (data.email) {
    const emailExists = await User.findOne({ email: data.email });

    if (emailExists && emailExists._id.toString() !== id) {
      throw new ApiError(400, "Email already in use");
    }
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(user, data);

  await user.save();

  await deleteByPattern("subadmins:*");
  await deleteCache(`subadmin:${id}`);

  user.password = undefined;

  return user;
};

export const deleteSubAdmin = async (id, currentAdminId) => {
  const user = await User.findById(id);

  if (!user || user.role !== "sub-admin") {
    throw new ApiError(404, "Sub-admin not found");
  }

  if (id === currentAdminId) {
    throw new ApiError(400, "You cannot delete yourself");
  }

  await user.deleteOne();

  await deleteByPattern("subadmins:*");
  await deleteCache(`subadmin:${id}`);
};

export const getAllCustomers = async (query) => {
  const cacheKey = `customers:${JSON.stringify(query)}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await getUsersByRole({
    role: "customer",
    query,
    extraSearchFields: ["mobile"],
    excludeFields: "-password",
  });

  await setCache(cacheKey, result, 300);

  return result;
};

export const getSingleCustomer = async (id) => {
  const cacheKey = `customer:${id}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const user = await User.findOne({
    _id: id,
    role: "customer",
  }).select("-password");

  if (!user) throw new ApiError(404, "Customer not found");

  await setCache(cacheKey, user, 300);

  return user;
};

export const deleteCustomer = async (id) => {
  const user = await User.findById(id);

  if (!user || user.role !== "customer") {
    throw new ApiError(404, "Customer not found");
  }

  await user.deleteOne();

  await deleteByPattern("customers:*");
  await deleteCache(`customer:${id}`);
};
