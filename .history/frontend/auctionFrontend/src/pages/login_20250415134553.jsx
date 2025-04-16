import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  // Check server availability on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/health", { 
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // Adding timeout to prevent long waits
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          setServerStatus("available");
        } else {
          setServerStatus("unavailable");
        }
      } catch (error) {
        console.log("Server check failed:", error);
        setServerStatus("unavailable");
      }
    };
    
    checkServerStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Use a timeout to prevent long waits when server is down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: emailOrUsername, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.error || "Invalid credentials, try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "AbortError") {
        setErrorMessage("Connection timed out. Please check if the server is running.");
      } else if (error.message === "Failed to fetch") {
        setErrorMessage("Cannot connect to server. Please check if the server is running on port 5000.");
      } else {
        setErrorMessage("Something went wrong. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Display server status warning if not available
  const renderServerStatus = () => {
    if (serverStatus === "unavailable") {
      return (
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg mb-4">
          <p className="text-sm">
            <strong>Server Connection Issue:</strong> The backend server appears to be offline or unavailable.
            Make sure the server is running on port 5000 before attempting to log in.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">EduNet</h1>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Welcome back</h2>

        {renderServerStatus()}

        {errorMessage && (
          <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || serverStatus === "unavailable"}
            className={`w-full py-2 px-4 rounded-lg transition duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isLoading || serverStatus === "unavailable" 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition duration-200"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LogIn;

//---------------------------------------------------------------------------------------------------
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LogIn = () => {
//   const navigate = useNavigate();
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (!emailOrUsername || !password) {
//       setErrorMessage("Please fill in all fields");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3001/Signin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username: emailOrUsername, password }),
//         credentials: "include"
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         localStorage.setItem("token", data.token);
//         if (data.user) {
//           localStorage.setItem("user", JSON.stringify(data.user));
//         }
//         navigate("/dashboard");
//       } else {
//         setErrorMessage(data.message || "Invalid username or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setErrorMessage("Unable to connect to the server. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
//       <div className="w-full max-w-md bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
//         <h1 className="text-2xl font-bold text-white text-center mb-2">EduNet</h1>
//         <h2 className="text-3xl font-semibold text-center text-white mb-6">Welcome Back</h2>

//         {errorMessage && (
//           <p className="text-red-400 bg-red-900 bg-opacity-20 text-center py-2 rounded-md mb-4">
//             {errorMessage}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email or Username */}
//           <input
//             type="text"
//             placeholder="Email or Username"
//             value={emailOrUsername}
//             onChange={(e) => setEmailOrUsername(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//           />

//           {/* Password */}
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//           />

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-xl transition-all duration-300"
//           >
//             Log In
//           </button>
//         </form>

//         {/* Signup Redirect */}
//         <p className="text-sm text-center text-white mt-4">
//           Don't have an account?{" "}
//           <button onClick={() => navigate("/signup")} className="text-blue-200 hover:underline">
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LogIn;
