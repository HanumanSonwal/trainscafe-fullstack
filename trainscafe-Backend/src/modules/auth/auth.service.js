import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.util.js";

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }
  if (user.role === "sub-admin" && !user.isEmailVerified) {
  throw new Error("Please verify your email first");
}

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (
    ["admin", "sub-admin"].includes(user.role) &&
    !user.isEmailVerified
  ) {
    throw new Error("Email not verified");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new Error("Refresh token missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user._id);

  return { accessToken };
};


export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};

export const verifyEmailService = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) throw new Error("Invalid token");

  user.isEmailVerified = true;
  await user.save();
};

