import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="relative min-h-screen bg-[url('/bg.jpg')] bg-center bg-cover text-gray-900">
        <header className="absolute top-0 left-0 right-0 p-4 shadow bg-white">
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

        <footer className="absolute bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EasyPay. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default App;
