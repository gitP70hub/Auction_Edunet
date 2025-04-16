import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);
  const [responseDetails, setResponseDetails] = useState(null);

  // Update these to match your backend configuration
  const API_BASE_URL = "http://localhost:3001";
  
  // Check server availability on component mount and when retry is requested
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        setServerStatus("checking");
        
        // Use your test route from your backend
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Just check if the server responds to any request
        // We'll use a simple HEAD request to minimize data transfer
        const response = await fetch(${API_BASE_URL}, { 
          method: "HEAD",
          signal: controller.signal
        }).catch(() => null);
        
        clearTimeout(timeoutId);
        
        if (response) {
          setServerStatus("available");
          setErrorMessage("");
        } else {
          setServerStatus("unavailable");
        }
      } catch (error) {
        console.log("Server check failed:", error);
        setServerStatus("unavailable");
      }
    };
    
    checkServerStatus();
  }, [retryCount, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (serverStatus !== "available") {
      setErrorMessage("Cannot connect to server. Please ensure the server is running.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setResponseDetails(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Try with email instead of emailOrUsername field
      const payload = { email: emailOrUsername, password };
      console.log("Sending login payload:", payload);
      
      const response = await fetch(${API_BASE_URL}/api/auth/login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Always try to parse the response, but handle parsing errors
      let data;
      const responseText = await response.text();
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText);
        data = { error: "Server response was not valid JSON" };
      }
      
      // Store full response details for debugging
      setResponseDetails({
        status: response.status,
        statusText: response.statusText,
        data: data,
        rawResponse: responseText
      });

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToastMessage("Login successful!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // Display more detailed error messages
        const errorMsg = data.error || data.message || Request failed with status ${response.status};
        setErrorMessage(errorMsg);
        console.error("Login failed:", { status: response.status, data });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "AbortError") {
        setErrorMessage("Request timed out. Server may be slow or unresponsive.");
      } else if (error.message?.includes("fetch")) {
        setErrorMessage("Cannot connect to server. Please check if the server is running.");
        setServerStatus("unavailable");
      } else {
        setErrorMessage(Something went wrong: ${error.message});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">EduNet</h1>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Welcome back</h2>

        {serverStatus === "unavailable" && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex items-start">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Server Connection Issue</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>The backend server appears to be offline or unavailable. Make sure the server is running on port 5001 before attempting to log in.</p>
                  <div className="mt-2">
                    <p className="text-xs text-yellow-600 mb-2">
                      <strong>Troubleshooting:</strong> Your server CORS settings may need to be updated to allow requests from http://localhost:5173
                    </p>
                    <button 
                      onClick={handleRetryConnection}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-1 px-3 rounded text-xs transition-colors"
                    >
                      {serverStatus === "checking" ? "Checking..." : "Retry Connection"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
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
            disabled={isLoading || serverStatus !== "available"}
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              isLoading || serverStatus !== "available" 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {responseDetails && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs overflow-auto max-h-32">
            <details>
              <summary className="font-medium text-gray-700 cursor-pointer">Debug Information</summary>
              <div className="mt-2 space-y-1">
                <p><strong>Status:</strong> {responseDetails.status} {responseDetails.statusText}</p>
                <p><strong>Response Data:</strong></p>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(responseDetails.data, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

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
