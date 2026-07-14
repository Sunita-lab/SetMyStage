import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Ticket name is required"],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    saleStart: {
      type: Date,
    },
    saleEnd: {
      type: Date,
    },
    maxPerUser: {
      type: Number,
      default: 5,
    },
    isRefundable: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;