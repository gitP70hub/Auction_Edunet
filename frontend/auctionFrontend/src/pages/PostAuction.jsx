import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    startingBid: "",
    closingTime: "",
    category: "",
    image: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.itemName || !formData.description || !formData.startingBid || !formData.closingTime || !formData.category) {
        setError("Please provide all required fields");
        return;
      }

      // Get the user ID from the JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create an auction");
        navigate("/login");
        return;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      const auctionData = {
        itemName: formData.itemName.trim(),
        description: formData.description.trim(),
        startingBid: parseFloat(formData.startingBid),
        closingTime: new Date(formData.closingTime).toISOString(),
        category: formData.category,
        seller: tokenPayload.id,
        image: formData.image.trim() || undefined // Only include if provided
      };

      // Validate numeric values
      if (isNaN(auctionData.startingBid) || auctionData.startingBid <= 0) {
        setError("Starting bid must be a positive number");
        return;
      }

      // Validate closing time
      const closingDate = new Date(formData.closingTime);
      if (closingDate <= new Date()) {
        setError("Closing time must be in the future");
        return;
      }

      console.log('Sending auction data:', auctionData); // Debug log

      const response = await axios.post("http://localhost:3001/api/auctions", auctionData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create auction listing");
      console.error("Error creating auction:", error.response?.data || error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500/30 to-purple-600/30">
      <div className="w-full max-w-2xl backdrop-blur-md bg-white/40 p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 m-4">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Create New Auction</h1>

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm text-red-500 px-4 py-2 rounded-lg mb-4 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Bid ($)
            </label>
            <input
              type="number"
              name="startingBid"
              value={formData.startingBid}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="art">Art & Collectibles</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 transition duration-200 shadow-lg"
          >
            Create Auction
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostAuction;