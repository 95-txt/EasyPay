import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance"; // custom instance
import MessagePopup from "../../components/MessagePopup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setPopupMessage("Please fill out both email and password.");
      return;
    }

    try {
      const res = await axios.post("/user/login", { email, password });

      const { token } = res.data;
      if (!token) {
        setPopupMessage("Login failed: token not received.");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Redirect to Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setPopupMessage(
        err.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <MessagePopup
        message={popupMessage}
        onClose={() => setPopupMessage("")}
      />

      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg sm:p-8 md:p-10">
        <p className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </p>

        <input
          autoComplete="email"
          id="email"
          className="w-full h-12 px-4 mb-4 text-base bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          className="w-full h-12 px-4 mb-6 text-base bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a
          href="#"
          className="block text-sm text-blue-500 text-center font-medium mb-6 hover:underline"
        >
          Forgot Password?
        </a>

        <button
          className="w-full h-12 flex items-center justify-center bg-blue-600 text-lg font-bold text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={handleLogin}
        >
          Log In
        </button>

        <div className="flex items-center justify-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <p className="text-gray-500 mx-4">or</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

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
