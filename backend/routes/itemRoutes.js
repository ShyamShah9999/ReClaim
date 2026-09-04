const express = require("express");
const Item = require("../models/Item");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// TEST ITEM ROUTES
// ======================================================

router.get("/test", (req, res) => {
  res.json({
    message: "Item routes are working!",
  });
});


// ======================================================
// GET ALL ITEMS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      items,
    });

  } catch (error) {
    console.error(
      "Error fetching items:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching items",
    });
  }
});


// ======================================================
// GET A SINGLE ITEM
// ======================================================

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "name email");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      item,
    });

  } catch (error) {
    console.error(
      "Error fetching item:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching item",
    });
  }
});


// ======================================================
// CREATE A LOST OR FOUND ITEM
// ======================================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      image,
    } = req.body;

    // Check required fields
    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Create item using the authenticated user's ID
    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      image: image || "",
      reportedBy: req.userId,
    });

    res.status(201).json({
      message: "Item reported successfully",
      item,
    });

  } catch (error) {
    console.error(
      "Item creation error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while creating item",
    });
  }
});


module.exports = router;