import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "InvoiceSchema",
    },
    note: String,
  },
  { timestamps: true }
);

const Schema = mongoose.model("Schema", InvoiceSchema);
export default Schema;
