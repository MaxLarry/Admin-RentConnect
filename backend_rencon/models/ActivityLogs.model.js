const mongoose = require("mongoose");

// Define the schema with a custom timestamps field
const activityLogSchema = new mongoose.Schema(
  {
    admin_name: { type: String, required: true },
    admin_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Admin' },
    role: { type: String, required: true },
    action: { type: String, required: true }, // Removed unique constraint, since actions may not be unique
    ip_address: { type: String, required: true },
    entity_affected: { type: String, default: "active" },
    changes: { type: String, required: false },
    timestamps: { type: Date, default: Date.now }
  }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema, "admin_activitylogs");
module.exports = ActivityLog;
