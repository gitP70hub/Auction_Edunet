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