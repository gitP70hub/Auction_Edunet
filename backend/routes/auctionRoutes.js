const express = require("express");
const router = express.Router();
const { createAuction, getAuctions, getUserAuctions, getUserBids } = require("../controllers/auctionController");
const protect = require("../middleware/authMiddleware");

router.route("/").post(protect, createAuction).get(getAuctions);
router.route("/user").get(protect, getUserAuctions);
router.route("/user/bids").get(protect, getUserBids);

module.exports = router;