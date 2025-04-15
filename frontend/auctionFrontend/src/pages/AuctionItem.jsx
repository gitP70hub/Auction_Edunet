import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AuctionItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/auctions/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching auction item:", error);
        setError("Failed to load auction item");
      }
    };
    fetchItem();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3001/api/auctions/${id}/bid`, {
        amount: parseFloat(bidAmount)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.data.success) {
        setItem(prev => ({ ...prev, currentBid: parseFloat(bidAmount) }));
        setBidAmount("");
      }
    } catch (error) {
      setError("Failed to place bid");
    }
  };

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!item) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:w-48"
              src={item.image || "https://via.placeholder.com/400"}
              alt={item.name}
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {item.category}
            </div>
            <h2 className="mt-2 text-2xl font-bold">{item.name}</h2>
            <p className="mt-2 text-gray-500">{item.description}</p>
            
            <div className="mt-4">
              <div className="text-lg font-semibold">
                Current Bid: ${item.currentBid}
              </div>
              <div className="text-sm text-gray-500">
                End Date: {new Date(item.endDate).toLocaleDateString()}
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="mt-6">
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="flex-1 p-2 border rounded-md"
                  min={item.currentBid + 1}
                  step="0.01"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Place Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionItem;