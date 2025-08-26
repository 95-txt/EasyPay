import React from "react";

function MessagePopup({ message, onClose }) {
  if (!message) return null;

  return (
    // Backdrop for the modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal content */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-sm text-center">
        <p className="text-lg text-gray-800 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full h-11 flex items-center justify-center bg-blue-600 text-base font-bold text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default MessagePopup;
