import bcrypt from "bcryptjs";
import User from "./user.model.js";
import { sendVerificationEmail } from "../email/email.service.js";

export const createSubAdmin = async (data) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("Email already exists");
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
 setImmediate(() => {
  sendVerificationEmail(subAdmin);
});

  subAdmin.password = undefined;

  return subAdmin;
};


export const getAllSubAdmins = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";

  const searchQuery = {
    role: "sub-admin",
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };

  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    User.find(searchQuery)
      .select("-password -refreshToken")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),

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

export const getSingleSubAdmin = async (id) => {
  const user = await User.findOne({
    _id: id,
    role: "sub-admin",
  }).select("-password -refreshToken");

  if (!user) throw new Error("Sub-admin not found");

  return user;
};


export const updateSubAdmin = async (id, data) => {
  const user = await User.findById(id);

  if (!user || user.role !== "sub-admin") {
    throw new Error("Sub-admin not found");
  }

  if (data.email) {
    const emailExists = await User.findOne({ email: data.email });
    if (emailExists && emailExists._id.toString() !== id) {
      throw new Error("Email already in use");
    }
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(user, data);

  await user.save();

  user.password = undefined;

  return user;
};

export const deleteSubAdmin = async (id, currentAdminId) => {
  const user = await User.findById(id);

  if (!user || user.role !== "sub-admin") {
    throw new Error("Sub-admin not found");
  }

  if (id === currentAdminId) {
    throw new Error("You cannot delete yourself");
  }

  await user.deleteOne();
};