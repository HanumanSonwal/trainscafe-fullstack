import { sendError } from "../utils/ApiResponse.js";

export const checkPermission = (module, action) => {
  return (req, res, next) => {
    if (req.user?.role === "admin") return next();

    const hasPermission = req.user?.permissions?.[module]?.[action];

    if (!hasPermission) {
      return sendError(res, "You do not have permission for this action", 403);
    }

    next();
  };
};
