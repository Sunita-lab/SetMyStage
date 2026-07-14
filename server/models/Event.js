import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Concert", "Conference", "Workshop", "Meetup", "Sports", "Festival", "Other"],
    },
    tags: [String],

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    registrationDeadline: {
      type: Date,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    meetingLink: {
      type: String,
    },

    location: {
      venue: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    banner: {
      type: String,
      default: "",
    },
    gallery: [String],

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    contactEmail: { type: String },
    contactPhone: { type: String },

    website: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },

    views: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Slug auto-generate karne ke liye
eventSchema.pre("save", async function () {
  if (!this.isModified("title")) {
    return;
  }

  let baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let slug = baseSlug;
  let count = 1;

  // Agar same slug pehle se exist karta hai, end mein number laga do (jaise -1, -2)
  while (await mongoose.models.Event.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
});

const Event = mongoose.model("Event", eventSchema);

export default Event;