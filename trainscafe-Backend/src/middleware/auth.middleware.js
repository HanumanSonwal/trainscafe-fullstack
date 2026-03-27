import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import { sendError } from "../utils/ApiResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) {
      return sendError(res, "Unauthorized - No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendError(res, "User not found", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
};
