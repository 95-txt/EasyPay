import React from "react";

function NeedHelp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🆘</span>
          <h1 className="text-2xl font-bold text-blue-700">Need Help?</h1>
        </div>
        <p className="mb-6 text-gray-700">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">EasyPay Support</span>!
          We’re here to help you with common issues and questions.
        </p>

        <div className="space-y-6">
          {/* Account & Login */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🔑</span>
              <h2 className="text-lg font-semibold text-gray-800">
                Account &amp; Login
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>
                <span className="font-medium">Forgot your password?</span>{" "}
                <span className="text-gray-500">
                  → Use the “Forgot Password” option on the login page.
                </span>
              </li>
              <li>
                <span className="font-medium">Trouble signing in?</span>{" "}
                <span className="text-gray-500">
                  → Make sure your email/UPI ID is correct and your internet is
                  stable.
                </span>
              </li>
            </ul>
          </section>

          {/* Transactions */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💸</span>
              <h2 className="text-lg font-semibold text-gray-800">
                Transactions
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>
                <span className="font-medium">Can’t send money?</span>{" "}
                <span className="text-gray-500">
                  → Check if you have enough balance in your wallet.
                </span>
              </li>
              <li>
                <span className="font-medium">Request not showing?</span>{" "}
                <span className="text-gray-500">
                  → Refresh the dashboard; pending requests appear under
                  “Requests”.
                </span>
              </li>
              <li>
                <span className="font-medium">Wrong transaction?</span>{" "}
                <span className="text-gray-500">
                  → Contact support immediately.
                </span>
              </li>
            </ul>
          </section>

          {/* Wallet & Balance */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📊</span>
              <h2 className="text-lg font-semibold text-gray-800">
                Wallet &amp; Balance
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>
                <span className="font-medium">Balance not updating?</span>{" "}
                <span className="text-gray-500">
                  → Transactions may take a few seconds to reflect.
                </span>
              </li>
              <li>
                <span className="font-medium">
                  Transaction history missing?
                </span>{" "}
                <span className="text-gray-500">
                  → Make sure you’re logged in with the correct account.
                </span>
              </li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🔒</span>
              <h2 className="text-lg font-semibold text-gray-800">Security</h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 ml-2">
              <li>
                <span className="font-medium">Keep your account safe</span> by
                using a strong password.
              </li>
              <li>
                <span className="font-medium">
                  Never share your login details
                </span>{" "}
                with anyone.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t pt-4 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">👉</span>
              <h2 className="text-lg font-semibold text-gray-800">
                Still need help?
              </h2>
            </div>
            <div className="flex flex-col gap-1 text-gray-700 ml-2">
              <span className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <a
                  href="mailto:sinan@easypay.com"
                  className="text-blue-600 hover:underline"
                >
                  sinan@easypay.com
                </a>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <a
                  href="tel:+917025938934"
                  className="text-blue-600 hover:underline"
                >
                  +91-7025938934
                </a>
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default NeedHelp;
