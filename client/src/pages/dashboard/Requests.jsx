import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../../utils/axiosInstance";

function Requests() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("upi");
  const [upi, setUpi] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [recent, setRecent] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/user/all")
      .then((res) => setAllUsers(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Please login again");
          localStorage.removeItem("token");
          navigate("/auth/login");
        }
        setAllUsers([]);
      });
    fetchRequests();
  }, []);

  // Helper to fetch requests for current user --
  const fetchRequests = async () => {
    const resUser = await axios.get("/user/me");
    setUser(resUser.data);
    const requester_upi_id = resUser.data.upi_id;
    setLoading(true);
    axios
      .get(`/request/${requester_upi_id}`)
      .then((res) => setRequests(res.data))
      .catch((err) => {
        setRequests([]);
        if (!(err.response && err.response.status === 404)) {
          alert("Failed to fetch requests.");
        }
      })
      .finally(() => setLoading(false));
  };

  const filteredUsers = allUsers
    .filter((u) =>
      (u.name?.toLowerCase() || "").includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  // helper to get target UPI ID
  const getTargetUpiId = () => {
    if (tab === "upi") return upi.trim() || null;
    if (tab === "email")
      return (
        allUsers.find((u) => u.email?.trim() === email.trim())?.upi_id || null
      );
    if (tab === "name") return selectedUser?.upi_id || null;
    return null;
  };

  const handleRequest = async () => {
    const target_upi_id = getTargetUpiId();
    if (!target_upi_id) return alert("Target details are invalid.");

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return alert("Enter a valid amount.");

    try {
      setLoading(true);

      await axios.post("/request/", {
        target_upi_id,
        amount: Number(amount),
        note,
      });
      // Update recent contacts
      const newContact = {
        upi_id: target_upi_id,
        note,
        name: selectedUser?.name || email || upi,
      };
      const updated = [
        newContact,
        ...recent.filter((r) => r.upi_id !== target_upi_id),
      ].slice(0, 5);
      setRecent(updated);
      localStorage.setItem("recentContacts", JSON.stringify(updated));

      toast.success("Request successful!");
      setUpi("");
      setEmail("");
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setUserSearch("");
      setShowConfirm(false);
      fetchRequests();
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/auth/login");
      } else {
        toast.error(
          err?.response?.data?.message || "Request failed. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Accept/decline handler
  const handleAction = async (requestId, status) => {
    try {
      await axios.patch(`/request/${requestId}`, {
        status,
      });
      setRequests((reqs) =>
        reqs.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error("Failed to update request");
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-4 max-w-2xl mx-auto h-screen content-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Request Money</h2>
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
        {tab === "upi" && (
          <div>
            <input
              id="upi"
              type="text"
              placeholder="Enter UPI ID..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
            <input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              id="note"
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}
        {tab === "email" && (
          <div>
            <input
              id="mail"
              type="email"
              placeholder="Enter email..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              id="note"
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        )}
        {tab === "name" && (
          <div>
            <input
              id="nameid"
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
              id="amount"
              type="number"
              placeholder="Enter amount..."
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 mt-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              id="note"
              type="text"
              placeholder="Add a note (optional)"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
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

        <button
          className="w-full mt-2 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setShowConfirm(true)}
        >
          Request
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Request</h3>
            <p className="mb-4">
              Are you sure you want to request{" "}
              <span className="font-semibold">₹{amount}</span> from{" "}
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
                onClick={handleRequest}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Incoming & Outgoing Requests</h2>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {requests.length === 0 ? (
              <div className="py-4 text-gray-400 text-center">
                No requests found.
              </div>
            ) : (
              requests.map((r) => {
                const isIncoming = r.target_upi_id === user.upi_id;
                return (
                  <div
                    key={r._id}
                    className="flex justify-between items-center py-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">
                        {isIncoming ? "From" : "To"}:{" "}
                        {isIncoming ? r.requester_upi_id : r.target_upi_id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.timestamp).toLocaleDateString()} •{" "}
                        {new Date(r.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {r.note && (
                          <span className="ml-2 italic text-gray-400">
                            | {r.note}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="font-semibold text-blue-600 mr-2">
                      ${r.amount.toFixed(2)}
                    </span>
                    {isIncoming && r.status === "pending" ? (
                      <>
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded mr-1 text-xs"
                          onClick={() => handleAction(r._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          onClick={() => handleAction(r._id, "declined")}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-medium ${
                          r.status === "accepted"
                            ? "text-green-600"
                            : r.status === "declined"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {r.status}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;
