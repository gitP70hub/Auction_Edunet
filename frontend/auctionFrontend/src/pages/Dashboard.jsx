import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's active auctions
        const auctionsResponse = await axios.get("http://localhost:3001/user/auctions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setActiveAuctions(auctionsResponse.data);

        // Fetch user's bidding history
        const bidsResponse = await axios.get("http://localhost:3001/user/bids", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBiddingHistory(bidsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load dashboard data");
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link
          to="/post-auction"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Post New Auction
        </Link>
      </div>

      {/* Active Auctions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Active Auctions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeAuctions.map((auction) => (
            <div key={auction._id} className="bg-white p-4 rounded-lg shadow">
              <img
                src={auction.image || "https://via.placeholder.com/300"}
                alt={auction.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{auction.name}</h3>
              <p className="text-gray-600 mb-2">{auction.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">
                  Current Bid: ${auction.currentBid}
                </span>
                <Link
                  to={`/auction/${auction._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bidding History Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Bidding History</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {biddingHistory.map((bid) => (
                <tr key={bid._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/auction/${bid.auctionId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {bid.itemName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${bid.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(bid.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bid.status === "winning"
                          ? "bg-green-100 text-green-800"
                          : bid.status === "outbid"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;