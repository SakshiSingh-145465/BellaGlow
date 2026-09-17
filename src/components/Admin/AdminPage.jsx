import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiX,
} from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import AdminPanel from "./AdminPanel";
import "./AdminPage.css";

function AdminPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const checkCurrentAdmin = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          if (mounted) {
            setUser(null);
            setChecking(false);
          }
          return;
        }

        const { data, error } = await supabase.rpc("is_admin");

        if (error) throw error;

        if (mounted) {
          if (data === true) {
            setUser(currentUser);
          } else {
            await supabase.auth.signOut();
            setUser(null);
          }

          setChecking(false);
        }
      } catch (err) {
        console.error("Admin check error:", err);

        if (mounted) {
          setUser(null);
          setChecking(false);
          setError("Unable to verify admin access.");
        }
      }
    };

    checkCurrentAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.");
      }

      const { data: adminData, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError) {
        throw adminError;
      }

      if (adminData !== true) {
        await supabase.auth.signOut();

        throw new Error(
          "This account does not have admin access."
        );
      }

      setUser(data.user);
      setPassword("");
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err?.message ||
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  if (checking) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loader"></div>
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="admin-page-wrapper">
        <AdminPanel
          user={user}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-brand">
          <span>B</span>

          <div>
            <strong>BellaGlow</strong>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        <div className="admin-login-icon">
          <FiLock />
        </div>

        <div className="admin-login-heading">
          <span>PRIVATE ACCESS</span>

          <h1>
            Admin
            <br />
            <em>portal.</em>
          </h1>

          <p>
            Sign in to manage BellaGlow appointments,
            customers and daily salon capacity.
          </p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleLogin}
        >

          <div className="admin-login-field">
            <label htmlFor="admin-email">
              ADMIN EMAIL
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              PASSWORD
            </label>

            <div className="admin-password-wrapper">

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              <FiX />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            <span>
              {loading
                ? "VERIFYING..."
                : "ENTER ADMIN PANEL"}
            </span>

            {!loading && <FiArrowRight />}
          </button>

        </form>

        <a
          href="/"
          className="back-to-website"
        >
          ← BACK TO WEBSITE
        </a>

      </div>

    </div>
  );
}

export default AdminPage;