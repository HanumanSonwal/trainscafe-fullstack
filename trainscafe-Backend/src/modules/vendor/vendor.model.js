import mongoose from "mongoose";
import { generatePrefixedId } from "../../utils/idGenerator.util.js";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: Number,
      unique: true,
      index: true,
    },

    vendorCode: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    businessName: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      trim: true,
      unique: true,
    },

    fssaiNumber: {
      type: String,
      trim: true,
      unique: true,
    },

    contactNo: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      index: true,
      match: /^\d{10}$/,
      message: "Contact number must be 10 digits",
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      match: /^\S+@\S+\.\S+$/,
      message: "Invalid email format",
    },
    logo: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dxfq3iotg/image/upload/v1697050867/default_vendor_logo.png",
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
      message: "Description can be max 500 characters",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

vendorSchema.pre("save", async function () {
  if (!this.isNew) return;

  const idData = await generatePrefixedId("vendorId", "V");

  this.vendorId = idData.numeric;
  this.vendorCode = idData.formatted;
});

export default mongoose.model("Vendor", vendorSchema);
