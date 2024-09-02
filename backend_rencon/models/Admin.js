const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Define the schema with the timestamps option
const AdminSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, required: true },
  phone_num: { type: String, required: true },
  last_login: { type: Date },
  status: { type: String, default: "active" }
}, { timestamps: true }); // Automatically add created_at and updated_at fields

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Pre-save middleware to hash passwords
AdminSchema.pre("save", async function (next) {
  if (this.isModified("password_hash")) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  }
  next();
});

const Admin = mongoose.model("rentcon_admins", AdminSchema);
module.exports = Admin;
