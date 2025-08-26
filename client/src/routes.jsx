import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard pages
import Home from "./pages/dashboard/Home";
import Settings from "./pages/dashboard/Settings";
import Transactions from "./pages/dashboard/Transactions";
import Wallet from "./pages/dashboard/Wallet";
import Requests from "./pages/dashboard/Requests.jsx";

// Misc
import NotFound from "./pages/NotFound";
import NeedHelp from "./pages/NeedHelp.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "auth",
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
        ],
      },
      {
        path: "dashboard",
        children: [
          { path: "", element: <Home /> },
          { path: "transactions", element: <Transactions /> },
          { path: "wallet", element: <Wallet /> },
          { path: "settings", element: <Settings /> },
          { path: "requests", element: <Requests /> },
        ],
      },
      { path: "*", element: <NotFound /> },
      { path: "support", element: <NeedHelp /> },
    ],
  },
]);

export default router;
