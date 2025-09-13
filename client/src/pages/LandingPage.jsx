import React from "react";
import { useNavigate } from "react-router-dom";
import Money from "/images/Money.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full p-6 sm:p-8 md:p-10 bg-gray-100 flex flex-col items-center">
        <img src={Money} alt="Money" className="max-w-sm rounded-2xl" />
        <p className="text-gray-600 p-4">Welcome to my MERN Project</p>
        <p className="text-xl text-blue-600">EasyPay</p>
        <p className="text-gray-600 p-4">a </p>
        {/* Login Button */}
        <button
          className="w-1/2 lg:w-1/5 h-12 flex items-center justify-center bg-blue-600 text-lg font-bold text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => navigate("/auth/login")}
        >
          Get Started
        </button>
      </div>
    </>
  );
};

export default LandingPage;
