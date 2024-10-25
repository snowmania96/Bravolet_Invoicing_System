import mongoose from "mongoose";

const InvoiceNumberSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const InvoiceNumber = mongoose.model("InvoiceNumber", InvoiceNumberSchema);
export default InvoiceNumber;
