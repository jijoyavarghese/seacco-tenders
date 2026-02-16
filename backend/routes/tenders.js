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

// TEMP TEST ROUTE
router.get("/seed-test", async (req, res) => {
  const sample = await Tender.create({
    title: "Supply of Laboratory Equipment",
    category: "Laboratory Equipment",
    organization: "Kerala University",
    location: "Thiruvananthapuram, Kerala",
    closesOn: new Date("2026-03-30"),
    estimatedValue: 500000,
    status: "active",
    source: "Manual Test"
  });

  res.json(sample);
});


module.exports = router;
