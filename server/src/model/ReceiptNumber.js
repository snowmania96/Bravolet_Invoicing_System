import mongoose from "mongoose";

const ReceiptNumberSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ReceiptNumber = mongoose.model("ReceiptNumber", ReceiptNumberSchema);
export default ReceiptNumber;
