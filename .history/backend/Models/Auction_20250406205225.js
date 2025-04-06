const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
    description: {
      type: String,
      required: [true, "Please enter description"],
    },
    link: {
      type: String,
      required: false,
      default: "",
    },
    img: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "auctions",
  }
);

const AuctionModel = mongoose.model("Auction", AuctionSchema);
module.exports = AuctionModel;




// //const mongoose = require("mongoose");
// import mongoose from 'mongoose';
// const AuctionSchema = mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: [true, "please enter title"],
//         },
//         description: {
//             type: String,
//             required: [true, "please enter Desc"],
//         },
//         link: {
//             type: String,
//             required: false,
//             default: 0,
//         },
//         img: {
//             type: String,
//             requiured: false,
//             default: 0,
//         },
//     },
//     {
//         Timestamp: true,
//     }
// );

// const AuctionModel = mongoose.model("Auction", AuctionSchema);
// //module.exports = AuctionModel;
// export default AuctionModel;
