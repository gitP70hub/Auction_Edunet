const mongoose = require('mongoose');

const auctionItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  currentBid: { type: Number, required: true },
  startingBid: { type: Number, required: true },
  highestBidder: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  closingTime: { type: Date, required: true },
  isClosed: { type: Boolean, default: false },
  image: { type: String, default: 'https://via.placeholder.com/150' },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bids: [{
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('AuctionItem', auctionItemSchema);