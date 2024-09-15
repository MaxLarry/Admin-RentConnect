const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReqSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  contactDetails: {
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  created_at: { type: Date, default: Date.now },
  firstName: { type: String, required: true },
  gender: { type: String, required: true },
  lastName: { type: String, required: true },
  profileStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  updated_at: { type: Date, default: Date.now },
  valid_id: { type: String, required: true },
});

const UserProfileRequest = mongoose.model(
  "UserProfileRequest",
  userReqSchema,
  "pending_request_profile"
);

module.exports = { UserProfileRequest };
