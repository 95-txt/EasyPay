import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="p-4 shadow bg-white">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold text-blue-600 cursor-pointer"
          >
            EasyPay
          </h1>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EasyPay. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default App;
