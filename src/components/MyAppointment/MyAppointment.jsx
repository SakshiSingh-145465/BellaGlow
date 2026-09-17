import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import "./MyAppointment.css";

function MyAppointment({ user, onBookAppointment }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    if (!user?.id) {
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select(
          "id, name, phone, email, service_name, appointment_date, appointment_time, message, status, created_at"
        )
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error("My appointments error:", err);
      setError(
        err?.message || "Unable to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "confirmed") {
      return <FiCheckCircle />;
    }

    if (status === "cancelled") {
      return <FiXCircle />;
    }

    return <FiClock />;
  };

  const getStatusLabel = (status) => {
    if (!status) return "PENDING";

    return status.toUpperCase();
  };

  if (!user) {
    return (
      <section className="my-appointment-section" id="my-appointment">
        <div className="my-appointment-container">
          <div className="my-appointment-header">
            <span className="my-appointment-label">
              YOUR VISITS
            </span>

            <h2>
              My <em>appointments.</em>
            </h2>

            <p>
              Sign in to view your upcoming and previous
              BellaGlow appointments.
            </p>
          </div>

          <div className="my-appointment-login-card">
            <div className="my-appointment-card-icon">
              <FiCalendar />
            </div>

            <h3>Ready to see your glow schedule?</h3>

            <p>
              Log in to view your appointment details and
              keep track of your BellaGlow visits.
            </p>

            <button
              type="button"
              className="my-appointment-book-button"
              onClick={onBookAppointment}
            >
              <span>BOOK AN APPOINTMENT</span>
              <b>↗</b>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="my-appointment-section"
      id="my-appointment"
    >
      <div className="my-appointment-container">

        <div className="my-appointment-header-row">
          <div className="my-appointment-header">
            <span className="my-appointment-label">
              YOUR VISITS
            </span>

            <h2>
              My <em>appointments.</em>
            </h2>

            <p>
              Everything about your BellaGlow visits,
              all in one place.
            </p>
          </div>

          <button
            type="button"
            className="my-appointment-refresh"
            onClick={loadAppointments}
            disabled={loading}
          >
            <FiRefreshCw
              className={loading ? "spinning" : ""}
            />
            <span>REFRESH</span>
          </button>
        </div>

        {error && (
          <div className="my-appointment-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="my-appointment-loading">
            <FiRefreshCw className="spinning" />
            <span>Loading your appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="my-appointment-empty">
            <div className="my-appointment-card-icon">
              <FiCalendar />
            </div>

            <h3>No appointments yet</h3>

            <p>
              Your booked appointments will appear here.
              Whenever you're ready, we'd love to welcome
              you to BellaGlow.
            </p>

            <button
              type="button"
              className="my-appointment-book-button"
              onClick={onBookAppointment}
            >
              <span>BOOK YOUR FIRST VISIT</span>
              <b>↗</b>
            </button>
          </div>
        ) : (
          <div className="my-appointment-list">
            {appointments.map((appointment) => (
              <article
                className="my-appointment-card"
                key={appointment.id}
              >
                <div className="my-appointment-card-top">
                  <div>
                    <span className="my-appointment-card-label">
                      SERVICE
                    </span>

                    <h3>
                      {appointment.service_name ||
                        "Beauty Service"}
                    </h3>
                  </div>

                  <div
                    className={`my-appointment-status status-${appointment.status}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span>
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>

                <div className="my-appointment-details">

                  <div className="my-appointment-detail">
                    <FiCalendar />

                    <div>
                      <span>DATE</span>
                      <strong>
                        {formatDate(
                          appointment.appointment_date
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="my-appointment-detail">
                    <FiClock />

                    <div>
                      <span>TIME</span>
                      <strong>
                        {formatTime(
                          appointment.appointment_time
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="my-appointment-detail">
                    <span className="detail-number">
                      #
                    </span>

                    <div>
                      <span>BOOKING ID</span>
                      <strong>
                        {String(appointment.id).slice(0, 8)}
                      </strong>
                    </div>
                  </div>

                </div>

                {appointment.message && (
                  <div className="my-appointment-message">
                    <span>YOUR NOTE</span>

                    <p>{appointment.message}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="my-appointment-bottom">
          <div>
            <span>NEED ANOTHER VISIT?</span>
            <p>
              Book your next beauty moment whenever
              you're ready.
            </p>
          </div>

          <button
            type="button"
            className="my-appointment-secondary-button"
            onClick={onBookAppointment}
          >
            BOOK APPOINTMENT
            <b>↗</b>
          </button>
        </div>

      </div>
    </section>
  );
}

export default MyAppointment;