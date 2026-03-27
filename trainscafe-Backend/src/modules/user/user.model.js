import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true ,index: true},

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

  

    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "sub-admin", "customer"],
      default: "customer",

    },

  permissions: {
  type: Object,
  default: {},

},

    googleId: String,

    isEmailVerified: { type: Boolean, default: false ,index: true, sparse: true },
    isMobileVerified: { type: Boolean, default: false , index: true, sparse: true },

    refreshToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

