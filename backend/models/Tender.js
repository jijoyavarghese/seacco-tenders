const mongoose = require("mongoose");

const TenderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    closesOn: { type: Date },
    estimatedValue: { type: Number },
    status: { type: String, default: "active" },
    sourceUrl: { type: String, default: "" },
    source: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tender", TenderSchema);
