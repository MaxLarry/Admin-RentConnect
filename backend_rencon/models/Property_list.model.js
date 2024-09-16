// models/Property_list.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
/*
const listingRequestSchema = new Schema({
  ownerName: { type: Schema.Types.ObjectId, ref: "User" },
  propertyType: String,
  address: String,
  numberOfRooms: Number,
  createdAt: { type: Date, default: Date.now },
  status: String,
});
*/
const PropertyListSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
  description: { type: String, required: true },
  photo: { type: String, default: null },
  photo2: { type: String, default: null },
  photo3: { type: String, default: null },
  legalDocPhoto: { type: String, default: null },
  legalDocPhoto2: { type: String, default: null },
  legalDocPhoto3: { type: String, default: null },
  typeOfProperty: { type: String, required: true },
  street: { type: String, required: true },
  barangay: { type: String, required: true },
  city: { type: String, default: "Puerto Princesa City"},
  amenities: { type: [String], default: [] },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true, index: "2dsphere" },
  },
  status: {
    type: String,
    enum: ["waiting", "passed", "failed", "under review"],
    default: "waiting",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

//const ListingRequest = mongoose.model("ListingRequest", listingRequestSchema);
const PropertyList = mongoose.model("PropertyList", PropertyListSchema, "listing_properties");

module.exports = { /*ListingRequest, */ PropertyList };
