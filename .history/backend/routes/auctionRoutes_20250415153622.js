const express = require("express");
const router = express.Router();
const { createAuction, getAuctions } = require("../controllers/auctionController");

router.route("/").post(createAuction).get(getAuctions);

module.exports = router;