import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagePopup from "../../components/MessagePopup";

function Login() {
  // State variables for email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  // Function to handle the login action
  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password };
    // Basic validation
    if (!email || !password) {
      console.log("Please fill out both email and password.");
      return;
    }

    axios
      .post("http://localhost:5000/user/login", user)
      .then((res) => {
        const { upi_id, message, balance } = res.data;

        // Store user info in local storage
        console.log(">>>>>.", upi_id);
        localStorage.setItem(
          "user",
          JSON.stringify({ email, upi_id, balance })
        );
        setPopupMessage("This is your message!", message);

        navigate("/dashboard");
        window.location.reload();
      })
      .catch((err) => console.log("Error logging in", err));
  };

  return (
    // The main container for the entire screen.
    // We use Tailwind classes for styling to center the content.
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <MessagePopup
        message={popupMessage}
        onClose={() => setPopupMessage("")}
      />
      {/* Login Card/Container */}
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg sm:p-8 md:p-10">
        {/* Title */}
        <p className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </p>

        {/* Email Input Field */}
        <input
          className="w-full h-12 px-4 mb-4 text-base bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input Field */}
        <input
          className="w-full h-12 px-4 mb-6 text-base bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password Link */}
        <a
          href="#"
          className="block text-sm text-blue-500 text-center font-medium mb-6 hover:underline"
        >
          Forgot Password?
        </a>

        {/* Login Button */}
        <button
          className="w-full h-12 flex items-center justify-center bg-blue-600 text-lg font-bold text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={handleLogin}
        >
          Log In
        </button>

        {/* Separator or "or" text */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <p className="text-gray-500 mx-4">or</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Sign Up Button/Link */}
        <button
          onClick={() => navigate("/auth/register")}
          className="w-full h-12 flex items-center justify-center bg-gray-200 text-lg font-bold text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
