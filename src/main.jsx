import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import AdminPage from "./components/Admin/AdminPage.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import "./index.css";

const currentPath = window.location.pathname;

const isAdminPage = currentPath === "/admin";
const isResetPasswordPage = currentPath === "/reset-password";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminPage ? (
      <AdminPage />
    ) : isResetPasswordPage ? (
      <ResetPassword />
    ) : (
      <App />
    )}
  </React.StrictMode>
);