import mongoose from "mongoose";

const IdSchema = new mongoose.Schema(
  {
    confirmationCode: {
      type: String,
      required: true,
    },
    guestInfoText: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    sent: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    submitted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Id = mongoose.model("Id", IdSchema);
export default Id;
