import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "waitlisted"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "paid", "failed"],
      default: "not_required",
    },
    amount: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String,
      unique: true,
    },
    guestCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    checkedInAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;