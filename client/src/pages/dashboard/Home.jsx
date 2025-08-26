import React, { useState, useEffect } from "react";
import AddMoneyPopup from "../../components/AddMoneyPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  // State for user and transactions
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notifications for incoming requests and request status changes
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Fetch user, transactions, and all users on mount
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }
    const { upi_id } = JSON.parse(stored);
    if (!upi_id) {
      setLoading(false);
      return;
    }
    // Fetch user
    axios
      .get(`http://localhost:5000/user/${upi_id}`)
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        setLoading(false);
        navigate("/login");
      });
    // Fetch transactions
    axios
      .get(`http://localhost:5000/transaction/${upi_id}`)
      .then((res) => setTransactions(res.data))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
    // Fetch all users for name lookup
    axios
      .get("http://localhost:5000/user/all")
      .then((res) => setAllUsers(res.data))
      .catch(() => setAllUsers([]));
    // Fetch all requests and filter for incoming & pending
    axios
      .get(`http://localhost:5000/request/${upi_id}`)
      .then((res) => {
        // incoming: target_upi_id is current user, status pending
        const incoming = res.data.filter(
          (r) => r.target_upi_id === upi_id && r.status === "pending"
        );
        // status notifications: requests made by user that are now accepted/rejected
        const statusNotifs = res.data
          .filter(
            (r) =>
              r.requester_upi_id === upi_id &&
              (r.status === "accepted" || r.status === "declined") &&
              !r.notified // Only show if not already notified (optional, if you want to avoid duplicates)
          )
          .map((r) => ({
            ...r,
            _notifType: "status",
          }));
        // Mark as notified (optional, requires backend update)
        setNotifications([...incoming, ...statusNotifs]);
        setHasUnread(incoming.length > 0 || statusNotifs.length > 0);
      })
      .catch(() => {
        setNotifications([]);
        setHasUnread(false);
      });
  }, [navigate]);

  const [showBalance, setShowBalance] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);

  const handleLogout = () => {
    // Clear user data from localStorage and redirect to login
    localStorage.removeItem("user");
    // Optionally clear all localStorage: localStorage.clear();
    navigate("/auth/login");
  };

  // Filter transactions by search
  const filteredTransactions = transactions.filter(
    (t) =>
      (t.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.type?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {/* Top bar: Profile, Greeting, Settings, Logout */}
      <div className="w-full max-w-2xl flex flex-row justify-between items-center mb-4">
        {/* Greeting and profile photo: always left */}
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            )}
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Hello, {user.name}!
          </span>
        </div>
        {/* Buttons: always right */}
        <div className="flex gap-2 items-center">
          {/* Bell icon for notifications */}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-yellow-100 focus:outline-none"
            aria-label="Show notifications"
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z" />
            </svg>
            {hasUnread && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Notifications/Alerts for incoming requests */}
      {showNotifications && notifications.length > 0 && (
        <div className="w-full max-w-2xl bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Notifications</h3>
          <ul className="space-y-1">
            {notifications.map((notif) => {
              if (notif._notifType === "status") {
                // Status notification (request accepted/rejected)
                return (
                  <li
                    key={notif._id + "-status"}
                    className="text-green-700 text-sm flex items-center gap-2 cursor-pointer hover:underline"
                    onClick={() => navigate("/dashboard/requests")}
                  >
                    <span>•</span>
                    <span>
                      Your request for ${notif.amount} was {notif.status}
                      {notif.note && (
                        <span className="italic text-gray-500 ml-1">
                          ({notif.note})
                        </span>
                      )}
                    </span>
                  </li>
                );
              } else {
                // Incoming request notification
                const fromUser = allUsers.find(
                  (u) =>
                    u.upi_id === notif.from_upi_id ||
                    u.upi_id === notif.requester_upi_id
                );
                return (
                  <li
                    key={notif._id}
                    className="text-yellow-700 text-sm flex items-center gap-2 cursor-pointer hover:underline"
                    onClick={() => navigate("/dashboard/requests")}
                  >
                    <span>•</span>
                    <span>
                      {fromUser
                        ? fromUser.name
                        : notif.from_upi_id || notif.requester_upi_id}{" "}
                      requested ${notif.amount}
                      {notif.note && (
                        <span className="italic text-gray-500 ml-1">
                          ({notif.note})
                        </span>
                      )}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
          <div className="mt-2 text-right">
            <button
              className="text-blue-700 hover:underline text-sm font-medium"
              onClick={() => navigate("/dashboard/requests")}
            >
              View All Requests
            </button>
          </div>
        </div>
      )}

      {/* Promotional Banner */}
      <div className="w-full max-w-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-4 mb-4 flex items-center justify-between shadow">
        <div>
          <span className="font-bold">Get 5% cashback</span> on your next bill
          payment!
        </div>
        <button className="bg-white text-blue-700 px-3 py-1 rounded font-semibold text-xs hover:bg-blue-100 transition">
          Learn More
        </button>
      </div>

      {/* Balance Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 flex flex-col items-center">
        <p className="text-sm font-medium opacity-80 mb-2">Current Balance</p>
        {showBalance ? (
          <p className="text-4xl font-extrabold mb-2">
            ${user.balance.toFixed(2)}
          </p>
        ) : (
          <button
            onClick={() => setShowBalance(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Show Balance
          </button>
        )}
        {showBalance && (
          <button
            onClick={() => setShowBalance(false)}
            className="mt-2 px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            Hide
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button
          className="flex flex-col items-center bg-blue-50 hover:bg-blue-100 rounded-lg p-4 shadow transition"
          onClick={() => navigate("/dashboard/transactions?send=1")}
        >
          {/* ...existing icon... */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          <span className="text-xs font-semibold text-blue-700">
            Send Money
          </span>
        </button>
        <button
          className="flex flex-col items-center bg-green-50 hover:bg-green-100 rounded-lg p-4 shadow transition"
          onClick={() => navigate("/dashboard/requests")}
        >
          {/* ...existing icon... */}
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path d="M352 96C352 78.3 337.7 64 320 64C302.3 64 288 78.3 288 96L288 306.7L246.6 265.3C234.1 252.8 213.8 252.8 201.3 265.3C188.8 277.8 188.8 298.1 201.3 310.6L297.3 406.6C309.8 419.1 330.1 419.1 342.6 406.6L438.6 310.6C451.1 298.1 451.1 277.8 438.6 265.3C426.1 252.8 405.8 252.8 393.3 265.3L352 306.7L352 96zM160 384C124.7 384 96 412.7 96 448L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 448C544 412.7 515.3 384 480 384L433.1 384L376.5 440.6C345.3 471.8 294.6 471.8 263.4 440.6L206.9 384L160 384zM464 440C477.3 440 488 450.7 488 464C488 477.3 477.3 488 464 488C450.7 488 440 477.3 440 464C440 450.7 450.7 440 464 440z" />
          </svg>
          <span className="text-xs font-semibold text-green-700">
            Request Money
          </span>
        </button>
        <button
          className="flex flex-col items-center bg-yellow-50 hover:bg-yellow-100 rounded-lg p-4 shadow transition"
          onClick={() => setShowAddMoney(true)}
        >
          {/* ...existing icon... */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 640 640"
          >
            <path d="M128 96C92.7 96 64 124.7 64 160L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 256C576 220.7 547.3 192 512 192L136 192C122.7 192 112 181.3 112 168C112 154.7 122.7 144 136 144L520 144C533.3 144 544 133.3 544 120C544 106.7 533.3 96 520 96L128 96zM480 320C497.7 320 512 334.3 512 352C512 369.7 497.7 384 480 384C462.3 384 448 369.7 448 352C448 334.3 462.3 320 480 320z" />
          </svg>
          <span className="text-xs font-semibold text-yellow-700">
            Add Money
          </span>
        </button>
        <button
          className="flex flex-col items-center bg-purple-50 hover:bg-purple-100 rounded-lg p-4 shadow transition"
          onClick={() => navigate("/dashboard/bills")}
        >
          {/* ...existing icon... */}
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path d="M142 66.2C150.5 62.3 160.5 63.7 167.6 69.8L208 104.4L248.4 69.8C257.4 62.1 270.7 62.1 279.6 69.8L320 104.4L360.4 69.8C369.4 62.1 382.6 62.1 391.6 69.8L432 104.4L472.4 69.8C479.5 63.7 489.5 62.3 498 66.2C506.5 70.1 512 78.6 512 88L512 552C512 561.4 506.5 569.9 498 573.8C489.5 577.7 479.5 576.3 472.4 570.2L432 535.6L391.6 570.2C382.6 577.9 369.4 577.9 360.4 570.2L320 535.6L279.6 570.2C270.6 577.9 257.3 577.9 248.4 570.2L208 535.6L167.6 570.2C160.5 576.3 150.5 577.7 142 573.8C133.5 569.9 128 561.4 128 552L128 88C128 78.6 133.5 70.1 142 66.2zM232 200C218.7 200 208 210.7 208 224C208 237.3 218.7 248 232 248L408 248C421.3 248 432 237.3 432 224C432 210.7 421.3 200 408 200L232 200zM208 416C208 429.3 218.7 440 232 440L408 440C421.3 440 432 429.3 432 416C432 402.7 421.3 392 408 392L232 392C218.7 392 208 402.7 208 416zM232 296C218.7 296 208 306.7 208 320C208 333.3 218.7 344 232 344L408 344C421.3 344 432 333.3 432 320C432 306.7 421.3 296 408 296L232 296z" />
          </svg>
          <span className="text-xs font-semibold text-purple-700">
            Pay Bills
          </span>
        </button>
      </div>
      {showAddMoney && user && (
        <AddMoneyPopup
          user={user}
          onClose={() => setShowAddMoney(false)}
          onSuccess={(amt) =>
            setUser((u) => ({ ...u, balance: u.balance + amt }))
          }
        />
      )}

      {/* Transactions Section */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={() => setShowTransactions((prev) => !prev)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
            >
              {showTransactions ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {showTransactions && (
          <>
            <div className="divide-y divide-gray-200 mb-4 max-h-64 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="py-4 text-gray-400 text-center">
                  No transactions found.
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  // Format date and time
                  const dateObj = new Date(transaction.timestamp);
                  const dateStr = dateObj.toLocaleDateString();
                  const timeStr = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  // Determine direction
                  const isSent = transaction.sender_upi_id === user.upi_id;
                  const otherPartyUpi = isSent
                    ? transaction.receiver_upi_id
                    : transaction.sender_upi_id;
                  const otherPartyUser = allUsers.find(
                    (u) => u.upi_id === otherPartyUpi
                  );
                  const otherPartyName = otherPartyUser
                    ? otherPartyUser.name
                    : otherPartyUpi;
                  return (
                    <div
                      key={transaction._id}
                      className="flex justify-between items-center py-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">
                          {isSent ? "To" : "From"}: {otherPartyName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dateStr} • {timeStr}
                          {transaction.note && (
                            <span className="ml-2 italic text-gray-400">
                              | {transaction.note}
                            </span>
                          )}
                        </p>
                      </div>
                      <span
                        className={`font-semibold ${
                          isSent ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {isSent ? "-" : "+"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <button
              onClick={() => navigate("/transactions")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to All Transactions
            </button>
          </>
        )}
      </div>

      {/* Support/Help */}
      <div className="w-full max-w-2xl flex justify-end">
        <button
          onClick={() => navigate("/support")}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded font-medium"
        >
          Need Help?
        </button>
      </div>
    </div>
  );
}

export default Home;
