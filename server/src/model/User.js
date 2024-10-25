import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    contactEmail: {
      type: String,
      max: 100,
    },
    password: {
      type: String,
      min: 6,
      max: 100,
    },
    address: String,
    vatNumber: String,
    phoneNumber: String,
    companyName: String,
    country: String,
    billingCode: String,
    pecAddress: String,
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    confirmationCode: String,
    reservationId: String,
    checkIn: String,
    checkOut: String,
    documentId: String,
    extra: String,
    finalized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
