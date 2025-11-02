import React, { useState } from "react";
import axios from "axios";

export default function AddMoneyPopup({ user, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      // 1. Update balance locally
      onSuccess(Number(amount));
      // 2. Create a transaction with note "Money added to wallet"
      await axios.post("http://localhost:5000/transaction", {
        sender_upi_id: user.upi_id,
        receiver_upi_id: user.upi_id,
        amount: Number(amount),
        note: "Money added to wallet",
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError("Failed to add transaction");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
        <h2 className="text-lg font-bold mb-4">Add Money</h2>
        <input
          type="number"
          min="1"
          placeholder="Enter amount"
          className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
