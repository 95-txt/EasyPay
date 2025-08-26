import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* 🔹 Global header (optional, can remove if you don’t want it everywhere) */}
        <header className="p-4 shadow bg-white">
          <h1 className="text-xl font-bold text-blue-600">EasyPay</h1>
        </header>

        {/* 🔹 Main content (nested routes will render here) */}
        <main>
          <Outlet />
        </main>

        {/* 🔹 Global footer */}
        <footer className="p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EasyPay. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default App;
