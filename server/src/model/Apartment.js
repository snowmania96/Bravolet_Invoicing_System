import mongoose from "mongoose";

const ApartmentSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    photo: String,
    information: String,
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", ApartmentSchema);
export default Apartment;
