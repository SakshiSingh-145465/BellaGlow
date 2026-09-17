import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    const checkRecoverySession = async () => {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          setHasRecoverySession(false);
          setCheckingSession(false);
          return;
        }

        if (data?.session) {
          setHasRecoverySession(true);
        } else {
          setHasRecoverySession(false);
          setError(
            "This password reset link is invalid or has expired. Please request a new reset link."
          );
        }
      } catch (sessionError) {
        setHasRecoverySession(false);
        setError(
          sessionError?.message ||
            "Unable to verify your password reset session."
        );
      }

      setCheckingSession(false);
    };

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setHasRecoverySession(true);
        setError("");
        setCheckingSession(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!hasRecoverySession) {
      setError(
        "Your password reset session is missing or expired. Please request a new reset link."
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setMessage("Your password has been updated successfully.");

    setPassword("");
    setConfirmPassword("");

    await supabase.auth.signOut();

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="reset-page">
      <div className="reset-decoration reset-decoration-one"></div>
      <div className="reset-decoration reset-decoration-two"></div>

      <section className="reset-card">
        <button
          type="button"
          className="reset-back"
          onClick={goHome}
        >
          <FiArrowLeft />
          <span>BACK TO WEBSITE</span>
        </button>

        <div className="reset-logo">
          <span>B</span>
        </div>

        <p className="reset-label">
          BELLAGLOW BEAUTY STUDIO
        </p>

        <h1>Create New Password</h1>

        <p className="reset-description">
          Choose a new password for your BellaGlow account.
        </p>

        {checkingSession ? (
          <div className="reset-success">
            <p>Verifying your password reset link...</p>
          </div>
        ) : success ? (
          <div className="reset-success">
            <div className="reset-success-icon">✓</div>

            <h2>Password Updated</h2>

            <p>{message}</p>

            <span>
              Redirecting you to BellaGlow...
            </span>
          </div>
        ) : (
          <form
            className="reset-form"
            onSubmit={handleSubmit}
          >
            <div className="reset-field">
              <label htmlFor="new-password">
                NEW PASSWORD
              </label>

              <div className="reset-input-wrap">
                <FiLock className="reset-input-icon" />

                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  disabled={!hasRecoverySession}
                />

                <button
                  type="button"
                  className="reset-eye"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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

            <div className="reset-field">
              <label htmlFor="confirm-password">
                CONFIRM PASSWORD
              </label>

              <div className="reset-input-wrap">
                <FiLock className="reset-input-icon" />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  disabled={!hasRecoverySession}
                />

                <button
                  type="button"
                  className="reset-eye"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="reset-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="reset-submit"
              disabled={
                loading || !hasRecoverySession
              }
            >
              {loading
                ? "UPDATING..."
                : "UPDATE PASSWORD"}
            </button>
          </form>
        )}

        {!success && !checkingSession && (
          <div className="reset-footer">
            <FiLock />
            <span>
              Your password is securely encrypted.
            </span>
          </div>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;