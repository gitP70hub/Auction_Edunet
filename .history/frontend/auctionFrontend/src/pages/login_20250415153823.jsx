

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
