import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/Signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        setErrorMessage(data.error || "Invalid credentials, try again!");
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Welcome Back</h2>

        {errorMessage && (
          <p className="text-red-400 bg-red-900 bg-opacity-20 text-center py-2 rounded-md mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username */}
          <input
            type="text"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-xl transition-all duration-300"
          >
            Log In
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-sm text-center text-white mt-4">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-blue-200 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LogIn;