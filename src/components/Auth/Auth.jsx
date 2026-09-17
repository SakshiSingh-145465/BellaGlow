import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiX,
} from "react-icons/fi";
import "./Auth.css";

function Auth({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setError("");
    setShowPassword(false);
  };

  // ========================================
  // FORGOT PASSWORD
  // ========================================
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    const email = formData.email.trim();

    if (!email) {
      setError("Please enter your email address first.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        throw resetError;
      }

      setMessage(
        "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error("Password reset error:", err);

      setError(
        err?.message ||
          "Unable to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOGIN / SIGN UP
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // ========================================
      // SIGN UP
      // ========================================
      if (mode === "signup") {
        const {
          name,
          phone,
          email,
          password,
        } = formData;

        const { data, error: signupError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: name.trim(),
                phone: phone.trim(),
              },
            },
          });

        if (signupError) {
          throw signupError;
        }

        if (!data.user) {
          throw new Error(
            "Account could not be created."
          );
        }

        if (data.session) {
          setMessage(
            "Account created successfully."
          );

          if (onSuccess) {
            onSuccess(data.user);
          }

          return;
        }

        setMessage(
          "Account created. Please check your email and confirm your account."
        );

        setMode("login");

        setFormData({
          name: "",
          phone: "",
          email,
          password: "",
        });

        return;
      }

      // ========================================
      // LOGIN
      // ========================================
      const {
        email,
        password,
      } = formData;

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error(
          "Login failed. Please try again."
        );
      }

      setMessage("Login successful.");

      if (onSuccess) {
        onSuccess(data.user);
      }
    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div
        className="auth-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        {/* ========================================
            LEFT VISUAL
        ======================================== */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-sparkle">
              ✦
            </span>

            <span className="auth-visual-small">
              WELCOME TO
            </span>

            <h2>
              Bella<span>Glow</span>
            </h2>

            <div className="auth-visual-line"></div>

            <p>
              Create your account to book
              appointments, manage your visits
              and enjoy a personalised beauty
              experience.
            </p>
          </div>

          <div className="auth-visual-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* ========================================
            RIGHT PANEL
        ======================================== */}
        <div className="auth-panel">

          {/* CLOSE */}
          <button
            type="button"
            className="auth-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close authentication"
          >
            <FiX />
          </button>

          {/* ========================================
              FORGOT PASSWORD SCREEN
          ======================================== */}
          {mode === "forgot" ? (
            <>
              <button
                type="button"
                className="auth-back"
                onClick={() =>
                  switchMode("login")
                }
                disabled={loading}
              >
                <FiArrowLeft />
                BACK TO LOGIN
              </button>

              <div className="auth-title">
                <span>
                  RESET PASSWORD
                </span>

                <h3>
                  Forgot your password?
                </h3>

                <p>
                  Enter your email and we will
                  send you a secure password
                  reset link.
                </p>
              </div>

              <form
                className="auth-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                <div className="auth-field">
                  <label htmlFor="reset-email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="reset-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                {error && (
                  <div className="auth-message error">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="auth-message success">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "SENDING..."
                      : "SEND RESET LINK"}
                  </span>

                  {!loading && (
                    <FiArrowRight />
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* ========================================
                  LOGIN / SIGNUP TABS
              ======================================== */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={
                    mode === "login"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    switchMode("login")
                  }
                  disabled={loading}
                >
                  LOGIN
                </button>

                <button
                  type="button"
                  className={
                    mode === "signup"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    switchMode("signup")
                  }
                  disabled={loading}
                >
                  SIGN UP
                </button>
              </div>

              {/* TITLE */}
              <div className="auth-title">
                <span>
                  {mode === "login"
                    ? "WELCOME BACK"
                    : "CREATE ACCOUNT"}
                </span>

                <h3>
                  {mode === "login"
                    ? "Welcome back."
                    : "Let's get started."}
                </h3>

                <p>
                  {mode === "login"
                    ? "Login to continue to your account."
                    : "Join BellaGlow and make every visit special."}
                </p>
              </div>

              {/* FORM */}
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                {/* SIGN UP FIELDS */}
                {mode === "signup" && (
                  <>
                    <div className="auth-field">
                      <label htmlFor="auth-name">
                        FULL NAME
                      </label>

                      <input
                        id="auth-name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="auth-field">
                      <label htmlFor="auth-phone">
                        PHONE NUMBER
                      </label>

                      <input
                        id="auth-phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </>
                )}

                {/* EMAIL */}
                <div className="auth-field">
                  <label htmlFor="auth-email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="auth-field">
                  <label htmlFor="auth-password">
                    PASSWORD
                  </label>

                  <div className="password-wrapper">
                    <input
                      id="auth-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
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

                {/* FORGOT PASSWORD */}
                {mode === "login" && (
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      switchMode("forgot")
                    }
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                )}

                {/* ERROR */}
                {error && (
                  <div className="auth-message error">
                    {error}
                  </div>
                )}

                {/* SUCCESS */}
                {message && (
                  <div className="auth-message success">
                    {message}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  <span>
                    {loading
                      ? "PLEASE WAIT..."
                      : mode === "login"
                      ? "LOGIN"
                      : "CREATE ACCOUNT"}
                  </span>

                  {!loading && (
                    <FiArrowRight />
                  )}
                </button>
              </form>

              {/* SWITCH */}
              <p className="auth-switch">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={() =>
                    switchMode(
                      mode === "login"
                        ? "signup"
                        : "login"
                    )
                  }
                  disabled={loading}
                >
                  {mode === "login"
                    ? "SIGN UP"
                    : "LOGIN"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;