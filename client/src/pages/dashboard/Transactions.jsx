import React, { useState, useEffect } from "react";
import axios from "axios";

function Transactions() {
  const [tab, setTab] = useState("upi");
  const [upi, setUpi] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/user/all")
      .then((res) => setAllUsers(res.data))
      .catch(() => setAllUsers([]));
  }, []);

  const filteredUsers = allUsers
    .filter((u) =>
      (u.name?.toLowerCase() || "").includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  // Function to send money based on selected tab
  const sendMoney = async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return alert("You must be logged in.");
    const { upi_id: sender_upi_id } = JSON.parse(stored);
    let receiver_upi_id = "";
    if (tab === "upi") {
      receiver_upi_id = upi.trim();
      if (!receiver_upi_id) return alert("Enter a valid UPI ID.");
    } else if (tab === "email") {
      const user = allUsers.find((u) => u.email === email.trim());
      if (!user) return alert("No user found with that email.");
      receiver_upi_id = user.upi_id;
    } else if (tab === "name") {
      if (!selectedUser) return alert("Select a user to send money.");
      receiver_upi_id = selectedUser.upi_id;
    }
    if (!receiver_upi_id) return alert("Receiver UPI ID required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return alert("Enter a valid amount.");
    try {
      await axios.post("http://127.0.0.1:5000/transaction/", {
        sender_upi_id,
        receiver_upi_id,
        amount: Number(amount),
        note,
      });
      alert("Transaction successful!");
      setUpi("");
      setEmail("");
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setUserSearch("");
    } catch (err) {
      alert(err?.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Send Money</h2>
        <div className="flex mb-4 rounded-lg overflow-hidden shadow-sm">
          <button
            className={`flex-1 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
              tab === "upi"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setTab("upi")}
          >
            By UPI
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
              tab === "email"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setTab("email")}
          >
            By Email
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
              tab === "name"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setTab("name")}
          >
            By Name
          </button>
        </div>

        {/* UPI Tab */}
        {tab === "upi" && (
          <div>
            <input
              type="text"
              placeholder="Enter UPI ID..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {/* Email Tab */}
        {tab === "email" && (
          <div>
            <input
              type="email"
              placeholder="Enter email..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {/* Name Tab */}
        {tab === "name" && (
          <div>
            <input
              type="text"
              placeholder="Search users by name..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              autoFocus
            />
            <div className="max-h-40 overflow-y-auto border-2 border-blue-200 rounded-lg">
              {filteredUsers.map((u) => (
                <div
                  key={u.upi_id}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-150 border-b last:border-b-0
                    ${
                      selectedUser?.upi_id === u.upi_id
                        ? "bg-blue-100 border-blue-300"
                        : "hover:bg-blue-50 border-transparent"
                    }`}
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-base">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {u.name}
                    </span>
                    <span className="text-xs text-gray-500">{u.upi_id}</span>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="px-3 py-2 text-gray-400">No users found</div>
              )}
            </div>
            {selectedUser && (
              <div className="mt-2 text-green-700 text-sm">
                Selected: {selectedUser.name} ({selectedUser.upi_id})
              </div>
            )}
            <input
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 mt-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}
        {/* Send Button at the bottom */}
        <button
          className="w-full mt-2 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={sendMoney}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Transactions;
