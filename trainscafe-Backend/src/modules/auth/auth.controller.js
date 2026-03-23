import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmailService,
} from "./auth.service.js";

import { sendSuccess } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

// ================= LOGIN =================
export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  // ACCESS TOKEN COOKIE
  res.cookie("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  // REFRESH TOKEN COOKIE
  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, "Login successful", {
    user: data.user,
  });
});

// ================= REFRESH TOKEN =================
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  const { accessToken } = await refreshAccessToken(token);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  sendSuccess(res, "Access token refreshed", {});
});

// ================= GET ME =================
export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, "Profile fetched", req.user);
});

// ================= LOGOUT =================
export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  sendSuccess(res, "Logged out successfully");
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  await verifyEmailService(token);

  sendSuccess(res, "Email verified successfully");
});