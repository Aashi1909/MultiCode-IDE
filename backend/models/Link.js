const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Link", linkSchema);
