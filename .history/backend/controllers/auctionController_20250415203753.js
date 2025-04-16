const AuctionItem = require('../Models/AuctionItem');

// @desc    Create a new auction
// @route   POST /api/auctions
// @access  Public
exports.createAuction = async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime, category, seller } = req.body;

    // Validate required fields
    if (!itemName || !description || !startingBid || !closingTime || !category || !seller) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Create new auction item
    const auctionItem = new AuctionItem({
      itemName,
      description,
      currentBid: startingBid,
      startingBid,
      seller,
      closingTime: new Date(closingTime),
      category
    });

    // Save auction item
    await auctionItem.save();

    res.status(201).json({
      success: true,
      data: auctionItem
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Public
exports.getAuctions = async (req, res) => {
  try {
    const auctions = await AuctionItem.find()
      .populate('seller', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's auctions
// @route   GET /api/auctions/user
// @access  Private
exports.getUserAuctions = async (req, res) => {
  try {
    const auctions = await AuctionItem.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.json(auctions);
  } catch (error) {
    console.error('Error fetching user auctions:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user's bidding history
// @route   GET /api/auctions/user/bids
// @access  Private
exports.getUserBids = async (req, res) => {
  try {
    const bids = await AuctionItem.find({ 'bids.bidder': req.user.id })
      .select('itemName bids')
      .sort({ 'bids.date': -1 });

    const userBids = bids.map(auction => {
      const userBid = auction.bids.find(bid => bid.bidder.toString() === req.user.id);
      return {
        _id: userBid._id,
        auctionId: auction._id,
        itemName: auction.itemName,
        amount: userBid.amount,
        date: userBid.date,
        status: userBid.status
      };
    });

    res.json(userBids);
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};