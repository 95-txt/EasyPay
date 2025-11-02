import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import signUpImage from "/signup.svg"; // Ensure path is correct

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/signup", {
        name,
        email,
        password,
      });

      alert(res.data.message || "Sign up successful!");
      navigate("/auth/login"); // Navigate to correct login route
    } catch (err) {
      alert(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-xl shadow-lg">
        {/* Form Section */}
        <div className="w-full p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 sm:text-4xl">
            Sign Up
          </h1>

          <input
            type="text"
            placeholder="Name"
            className="w-full h-12 px-4 mb-4 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-12 px-4 mb-4 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-12 px-4 mb-4 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-12 px-4 mb-6 text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleSignUp}
            className="w-full h-12 flex items-center justify-center bg-blue-600 text-lg font-bold text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Sign Up
          </button>

          <div className="flex items-center justify-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <p className="text-gray-500 mx-4">or</p>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Navigate to login */}
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full h-12 flex items-center justify-center text-center text-base font-medium text-blue-500 hover:underline mt-4"
          >
            Already have an account? Log In
          </button>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
          <img
            src={signUpImage}
            alt="Sign Up Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
