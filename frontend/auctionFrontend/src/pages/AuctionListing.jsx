import React from "react";
import { Link } from "react-router-dom";

const latestAuctions = [
  { id: 1, name: "Vintage Leather Chair", price: "$20.00", timeLeft: "12h left", image: "https://via.placeholder.com/150" },
  { id: 2, name: "MacBook Pro 14\"", price: "$300.00", timeLeft: "8h left", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Mountain Bike", price: "$150.00", timeLeft: "6h left", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Tesla Model 3", price: "$1,022.00", timeLeft: "24h left", image: "https://via.placeholder.com/150" }
];

const categories = [
  { id: 1, name: "Jobs", icon: "💼" },
  { id: 2, name: "Housing", icon: "🏠" },
  { id: 3, name: "Electronics", icon: "📱" },
  { id: 4, name: "Cars", icon: "🚗" },
  { id: 5, name: "Furniture", icon: "🪑" },
  { id: 6, name: "Fashion", icon: "👕" }
];

const AuctionListing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Link to="/" className="text-blue-600 text-2xl font-bold">EduNet</Link>
        <div className="flex-1 max-w-3xl mx-8">
          <input 
            type="text" 
            placeholder="Search auctions..." 
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Sign Up</Link>
        </div>
      </nav>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.name.toLowerCase()}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <p className="text-gray-800">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Auctions Section */}
      <section className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Auctions</h2>
          <Link 
            to="/post-auction" 
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Post Auction
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {latestAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img 
                src={auction.image} 
                alt={auction.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{auction.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">{auction.price}</span>
                  <span className="text-gray-500 text-sm">{auction.timeLeft}</span>
                </div>
                <button 
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => window.location.href = `/auction/${auction.id}`}
                >
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AuctionListing;
