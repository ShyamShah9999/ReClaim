const express = require("express");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CREATE A CLAIM FOR AN ITEM
// ======================================================

router.post("/", protect, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    // Check required fields
    if (!itemId || !message) {
      return res.status(400).json({
        message: "Please provide item and claim message",
      });
    }

    // Find the item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Prevent users from claiming their own found item
    if (
      item.reportedBy.toString() ===
      req.userId.toString()
    ) {
      return res.status(400).json({
        message: "You cannot claim an item that you reported",
      });
    }

    // Only found items can be claimed
    if (item.type !== "found") {
      return res.status(400).json({
        message: "Only found items can be claimed",
      });
    }

    // Item must still be available
    if (item.status !== "active") {
      return res.status(400).json({
        message: "This item is no longer available for claiming",
      });
    }

    // Check whether this user already submitted a claim
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: req.userId,
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You have already submitted a claim for this item",
      });
    }

    // Create the claim
    const claim = await Claim.create({
      item: itemId,
      claimedBy: req.userId,
      message,
    });

    res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });

  } catch (error) {
    console.error(
      "Claim creation error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while creating claim",
    });
  }
});


// ======================================================
// GET CLAIMS SUBMITTED BY THE LOGGED-IN USER
// ======================================================

router.get(
  "/my-claims/:userId",
  protect,
  async (req, res) => {
    try {
      const claims = await Claim.find({
        claimedBy: req.userId,
      })
        .populate("item")
        .sort({ createdAt: -1 });

      res.status(200).json({
        count: claims.length,
        claims,
      });

    } catch (error) {
      console.error(
        "Error fetching user claims:",
        error.message
      );

      res.status(500).json({
        message: "Server error while fetching claims",
      });
    }
  }
);


// ======================================================
// GET CLAIMS FOR ITEMS REPORTED BY THE LOGGED-IN USER
// ======================================================

router.get(
  "/received/:userId",
  protect,
  async (req, res) => {
    try {
      // Find found items reported by the logged-in user
      const items = await Item.find({
        reportedBy: req.userId,
        type: "found",
      }).select("_id");

      const itemIds = items.map(
        (item) => item._id
      );

      // Find claims for those items
      const claims = await Claim.find({
        item: { $in: itemIds },
      })
        .populate("item")
        .populate("claimedBy", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        count: claims.length,
        claims,
      });

    } catch (error) {
      console.error(
        "Error fetching received claims:",
        error.message
      );

      res.status(500).json({
        message: "Server error while fetching received claims",
      });
    }
  }
);


// ======================================================
// APPROVE OR REJECT A CLAIM
// ======================================================

router.patch(
  "/:claimId/status",
  protect,
  async (req, res) => {
    try {
      const { status } = req.body;

      // Only allow approved or rejected
      if (
        !["approved", "rejected"].includes(status)
      ) {
        return res.status(400).json({
          message: "Status must be approved or rejected",
        });
      }

      // Find the claim and associated item
      const claim = await Claim.findById(
        req.params.claimId
      ).populate("item");

      if (!claim) {
        return res.status(404).json({
          message: "Claim not found",
        });
      }

      // Make sure the item still exists
      if (!claim.item) {
        return res.status(404).json({
          message:
            "Item associated with this claim was not found",
        });
      }

      // Only the person who reported the item
      // can approve or reject the claim
      if (
        claim.item.reportedBy.toString() !==
        req.userId.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to review this claim",
        });
      }

      // Only pending claims can be reviewed
      if (claim.status !== "pending") {
        return res.status(400).json({
          message:
            "This claim has already been reviewed",
        });
      }

      // Update claim status
      claim.status = status;

      await claim.save();


      // ==================================================
      // IF CLAIM IS APPROVED
      // ==================================================

      if (status === "approved") {

        // Mark the item as claimed
        await Item.findByIdAndUpdate(
          claim.item._id,
          {
            status: "claimed",
          }
        );

        // Reject all other pending claims
        // for the same item
        await Claim.updateMany(
          {
            item: claim.item._id,
            _id: { $ne: claim._id },
            status: "pending",
          },
          {
            status: "rejected",
          }
        );
      }


      // Send response
      res.status(200).json({
        message: `Claim ${status} successfully`,
        claim,
      });

    } catch (error) {
      console.error(
        "Error updating claim:",
        error.message
      );

      res.status(500).json({
        message: "Server error while updating claim",
      });
    }
  }
);


module.exports = router;