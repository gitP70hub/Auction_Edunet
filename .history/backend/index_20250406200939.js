const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "my_super_secret_123!";

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://edunet:edunet1234@cluster12.i0qxr0h.mongodb.net/",

);

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Auction Item Schema
const auctionItemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  currentBid: Number,
  highestBidder: String,
  closingTime: Date,
  isClosed: { type: Boolean, default: false },
});

const AuctionItem = mongoose.model("AuctionItem", auctionItemSchema);

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

// Signup Route
app.post("/Signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Signin Route
app.post("/Signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Signin successful", token });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create Auction Item (Protected)
app.post("/auction", authenticate, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;

    if (!itemName || !description || !startingBid || !closingTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newItem = new AuctionItem({
      itemName,
      description,
      currentBid: startingBid,
      highestBidder: "",
      closingTime,
    });

    await newItem.save();
    res.status(201).json({ message: "Auction item created", item: newItem });
  } catch (error) {
    console.error("Auction Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all auction items
app.get("/auctions", async (req, res) => {
  try {
    const auctions = await AuctionItem.find();
    res.json(auctions);
  } catch (error) {
    console.error("Fetching Auctions Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a single auction item by ID
app.get("/auctions/:id", async (req, res) => {
  try {
    const auctionItem = await AuctionItem.findById(req.params.id);
    if (!auctionItem)
      return res.status(404).json({ message: "Auction not found" });

    res.json(auctionItem);
  } catch (error) {
    console.error("Fetching Auction Item Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user's auctions (Protected)
app.get("/user/auctions", authenticate, async (req, res) => {
  try {
    const auctions = await AuctionItem.find({ highestBidder: req.user.username });
    res.json(auctions);
  } catch (error) {
    console.error("Fetching User Auctions Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user's bids (Protected)
app.get("/user/bids", authenticate, async (req, res) => {
  try {
    const auctions = await AuctionItem.find({ highestBidder: req.user.username });
    const bids = auctions.map(auction => ({
      _id: auction._id,
      auction: {
        _id: auction._id,
        itemName: auction.itemName,
        currentBid: auction.currentBid
      },
      amount: auction.currentBid,
      isWinning: true
    }));
    res.json(bids);
  } catch (error) {
    console.error("Fetching User Bids Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Bidding on an item (Protected)
app.post("/bid/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { bid } = req.body;
    const item = await AuctionItem.findById(id);

    if (!item)
      return res.status(404).json({ message: "Auction item not found" });
    if (item.isClosed)
      return res.status(400).json({ message: "Auction is closed" });

    if (new Date() > new Date(item.closingTime)) {
      item.isClosed = true;
      await item.save();
      return res.json({
        message: "Auction closed",
        winner: item.highestBidder,
      });
    }

    if (bid > item.currentBid) {
      item.currentBid = bid;
      item.highestBidder = req.user.username;
      await item.save();
      res.json({ message: "Bid successful", item });
    } else {
      res.status(400).json({ message: "Bid too low" });
    }
  } catch (error) {
    console.error("Bidding Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});


//-------------------------------------------------
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require("cors");

// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   credentials: true
// }));
// app.use(express.json());

// const port = process.env.PORT || 3001;

// import SignupModel from './Models/Signup.js';
// import AuctionModel from './Models/Auction.js';

// // const SignupModel = require("./Models/Signup.js");
// // const AuctionModel = require("./Models/Auction.js");

// app.get('/sayhello', (req, res) => {
//   res.send('Hello World to Night Class!');
// });

// app.post("/signup", async(req, res) => {
//      try {
//         const Signup1 = await SignupModel.create(req.body);
//         res.status(200).json(Signup1);
//         console.log("New user created:", req.body);
//      } catch(error) {
//         console.error("Error creating user:", error);
//         if (error.code === 11000) {
//             res.status(400).json({ message: "User already exists with this roll number" });
//         } else {
//             res.status(500).json({ message: "Error creating user", error: error.message });
//         }
//      }
// });

// app.post("/signin", async(req, res) => {
//     try{
//        const { roll_no, password } = req.body;                         // Extract roll_no and password from the request body

//        const user = await SignupModel.findOne({ roll_no});             // Search for a user in the database that matches the provided roll_no  
//        if(!user) {                                                     // Check if the user was found 
//         return res.status(404).json({ message: "User not found "});    // If no user is found, respond with a 404 status and a message
//        }

//        if(user.password !== password) {                                      // Compare the provided password with the stored password 
//         return res.status(401).json({ message: "Invalid credentials"});      // If the passwords do not match, respond with a 401 status indicating invalid credentials 
//        }

//        res.status(200).json({ message:"Login successful", user});            // If authentication is successful, respond with a 200 status and a success message along with the user data
//     }catch(error) {
//         console.error(error);                                                // Log any errors that occur during the process for debugging
//         res.sendStatus(500);                                                 // If an error occurs, respond with a 500 status indicating a server error
//     }
// });

// app.post("/addauctiondata", async(req, res) => {
//     try {
//         const Auction1 = await AuctionModel.create(req.body);
//         res.status(200).json(Auction1);
//         console.log(req.body);
//     } catch(error) {
//         res.sendStatus(500);
//     }
// });

// app.get("/getauctiondata", async(req, res) => {
//     try{                                                 // Fetch all auction records from the AuctionModel collection  
//         const Auction1 = await AuctionModel.find();      // No filter, retrieves all documents
//         res.status(200).json(Auction1);                  // Send the retrieved data back in JSON format  
//     }catch(error){                                       // Log any errors for debugging  
//         res.sendStatus(500);                             // Send a server error response   
//     }
// });

// mongoose
//       .connect("mongodb+srv://edunet:edunet1234@cluster12.i0qxr0h.mongodb.net/")
//       .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(port, () => {
//       console.log(`Example app listening on port ${port}`);
//     });
// }).catch((err) => {
//     console.log("MongoDB Not Connected");
//     console.error(err);
// });