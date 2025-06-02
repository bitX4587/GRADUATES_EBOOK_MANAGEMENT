//framework
import mongoose from "mongoose";

// BUILD SCHEMA
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  SchoolID: {
    type: Number,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  beta_password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: String,
    required: true,
  },
  is_admin_token: {
    type: Number,
    required: true,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
    default: "",
  },
  // New fields for PDS
  address: {
    type: String,
    default: "",
  },
  birthday: {
    type: Date,
    default: null,
  },
  civil_status: {
    type: String,
    enum: ["Single", "Married", "Widowed", "Divorced", "Separated"],
    default: "Single",
  },
  birthplace: {
    type: String,
    default: "",
  },
  nationality: {
    type: String,
    default: "",
  },
  religion: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Admin", adminSchema); // EXPORT USER
