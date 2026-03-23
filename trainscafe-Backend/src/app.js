import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import stationRoutes from "./modules/station/station.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stations", stationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vendors", vendorRoutes);

app.use(errorHandler);

export default app;
