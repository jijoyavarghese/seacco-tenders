const express = require("express");
const router = express.Router();
const Tender = require("../models/Tender");

// GET /api/tenders
router.get("/", async (req, res) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 }).limit(200);
    res.json(tenders);
  } catch (err) {
    console.error("❌ Error fetching tenders:", err);
    res.status(500).json({ message: "Failed to load tenders" });
  }
});

module.exports = router;
