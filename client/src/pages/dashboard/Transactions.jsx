import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "../../utils/axiosInstance";

function Transactions() {
  const [tab, setTab] = useState("upi");
  const [upi, setUpi] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recent, setRecent] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/user/all")
      .then((res) => setAllUsers(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Please login again");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        setAllUsers([]);
      });

    const stored = JSON.parse(localStorage.getItem("recentContacts") || "[]");
    setRecent(stored);
  }, []);

  const filteredUsers = allUsers
    .filter((u) =>
      (u.name?.toLowerCase() || "").includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  // Helper to get receiver UPI ID
  const getReceiverUpiId = () => {
    if (tab === "upi") return upi.trim() || null;
    if (tab === "email")
      return (
        allUsers.find((u) => u.email?.trim() === email.trim())?.upi_id || null
      );
    if (tab === "name") return selectedUser?.upi_id || null;
    return null;
  };

  const handleTransaction = async () => {
    const receiver_upi_id = getReceiverUpiId();
    if (!receiver_upi_id) return toast.error("Receiver details are invalid.");

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error("Enter a valid amount.");

    try {
      setLoading(true);

      await axios.post("/transaction/", {
        receiver_upi_id,
        amount: Number(amount),
        note,
      });
      // Update recent contacts
      const newContact = {
        upi_id: receiver_upi_id,
        note,
        name: selectedUser?.name || email || upi,
      };
      const updated = [
        newContact,
        ...recent.filter((r) => r.upi_id !== receiver_upi_id),
      ].slice(0, 5);
      setRecent(updated);
      localStorage.setItem("recentContacts", JSON.stringify(updated));

      toast.success("Transaction successful!");
      setUpi("");
      setEmail("");
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setUserSearch("");
      setShowConfirm(false);
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        toast.error(
          err?.response?.data?.message || "Transaction failed. Try again."
        );
      }
    } finally {
      setLoading(false);
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
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
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
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
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
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
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
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 mt-2 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 
              focus:ring-2 focus:ring-blue-400 focus:outline-none transition 
              bg-white dark:bg-gray-700 dark:text-white"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}

        {/* Recent Contacts */}
        {recent.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Recent Contacts</h3>
            <div className="flex gap-2 overflow-x-auto">
              {recent.map((r) => (
                <div
                  key={r.upi_id}
                  className="px-3 py-2 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200"
                  onClick={() => {
                    setTab("upi");
                    setUpi(r.upi_id);
                  }}
                >
                  {r.upi_id}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          className="w-full mt-4 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setShowConfirm(true)}
        >
          Send
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Transaction</h3>
            <p className="mb-4">
              Are you sure you want to send{" "}
              <span className="font-semibold">₹{amount}</span> to{" "}
              <span className="font-semibold">
                {selectedUser?.name || upi || email}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                aria-busy={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={handleTransaction}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
