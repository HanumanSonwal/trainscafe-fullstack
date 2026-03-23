import mongoose from "mongoose";

const vendorOutletSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
      index: true,
    },

    commissionPercent: {
      type: Number,
      required: true,
      min: [0, "Commission cannot be negative"],
      max: [100, "Commission cannot exceed 100%"],
    },

    deliveryCharges: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },

    minOrderValue: {
      type: Number,
      min: 0,
      default: 0,
      required: true,
    },

    workingHours: {
      type: String,
      trim: true,
    },

    weeklyOff: [{
      type: String,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    }],

    address: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate outlet per station
vendorOutletSchema.index(
  { vendor: 1, station: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

vendorOutletSchema.index({ station: 1, isActive: 1 });
vendorOutletSchema.index({ vendor: 1, isActive: 1 });

export default mongoose.model("VendorOutlet", vendorOutletSchema);