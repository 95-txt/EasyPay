import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";

function Requests() {
  const [tab, setTab] = useState("upi");
  const [upi, setUpi] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUpi = JSON.parse(localStorage.getItem("user"))?.upi_id;

  // Fetch all users (for search by name/email)
  useEffect(() => {
    axios
      .get("/user/all")
      .then((res) => setAllUsers(res.data))
      .catch(() => setAllUsers([]));
    fetchRequests();
  }, []);

  // Fetch requests for logged-in user
  const fetchRequests = () => {
    setLoading(true);
    axios
      .get("/request/me") // backend gets requester from token
      .then((res) => setRequests(res.data))
      .catch((err) => {
        setRequests([]);
        if (!(err.response && err.response.status === 404)) {
          toast.error("Failed to fetch requests.");
        }
      })
      .finally(() => setLoading(false));
  };

  const filteredUsers = allUsers
    .filter((u) =>
      (u.name?.toLowerCase() || "").includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  // Request money handler
  const handleRequest = async () => {
    const receiver_upi_id =
      tab === "upi"
        ? upi.trim()
        : tab === "email"
        ? allUsers.find((u) => u.email === email.trim())?.upi_id
        : selectedUser?.upi_id;

    if (!receiver_upi_id) return toast.error("Target UPI ID required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error("Enter a valid amount.");

    try {
      setLoading(true);
      await axios.post("/request", {
        target_upi_id: receiver_upi_id,
        amount: Number(amount),
        note,
      });

      toast.success("Request sent!");
      setUpi("");
      setEmail("");
      setAmount("");
      setNote("");
      setSelectedUser(null);
      setUserSearch("");
      fetchRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // Accept/decline request handler
  const handleAction = async (requestId, status) => {
    try {
      await axios.patch(`/request/${requestId}`, { status });
      setRequests((reqs) =>
        reqs.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Request Money Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4">Request Money</h2>
        <div className="flex mb-4 rounded-lg overflow-hidden shadow-sm">
          {["upi", "email", "name"].map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setTab(t)}
            >
              {t === "upi" ? "By UPI" : t === "email" ? "By Email" : "By Name"}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
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
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-150 border-b last:border-b-0 ${
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

        <button
          className="w-full mt-2 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          onClick={handleRequest}
          disabled={loading}
        >
          {loading ? "Processing..." : "Request"}
        </button>
      </div>

      {/* Incoming & Outgoing Requests */}
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
                const isIncoming = r.target_upi_id === currentUpi;
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
