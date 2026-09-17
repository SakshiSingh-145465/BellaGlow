import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { supabase } from "../../lib/supabaseClient";
import "./Appointment.css";

const services = [
  "Hair Care",
  "Skin & Facial",
  "Makeup",
  "Nail Care",
  "Spa & Wellness",
  "Bridal Services",
];

const timeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minutes} ${suffix}`;
};

const formatTimeRange = (time) => {
  if (!time) return "";

  const [hours] = time.split(":");
  const hour = Number(hours);
  const nextHour = hour + 1;

  const startSuffix = hour >= 12 ? "PM" : "AM";
  const endSuffix = nextHour >= 12 ? "PM" : "AM";

  const startHour = hour % 12 || 12;
  const endHour = nextHour % 12 || 12;

  return `${String(startHour).padStart(2, "0")}:00 ${startSuffix} – ${String(
    endHour
  ).padStart(2, "0")}:00 ${endSuffix}`;
};

function Appointment({ onRequireAuth, selection }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  const [slotCounts, setSlotCounts] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hourlyLimit = 10;

  const today = new Date().toISOString().split("T")[0];

  /* ================================
     LOAD HOURLY AVAILABILITY
  ================================= */

  const loadAvailability = async (selectedDate) => {
    if (!selectedDate) {
      setSlotCounts({});
      return;
    }

    setLoadingAvailability(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_time, status")
        .eq("appointment_date", selectedDate)
        .in("status", [
          "pending",
          "confirmed",
          "completed",
        ]);

      if (error) {
        throw error;
      }

      const counts = {};

      (data || []).forEach((appointment) => {
        if (!appointment.appointment_time) {
          return;
        }

        const hour = appointment.appointment_time.slice(0, 2);

        counts[hour] = (counts[hour] || 0) + 1;
      });

      setSlotCounts(counts);
    } catch (error) {
      console.error("Availability error:", error);

      setErrorMessage(
        "Unable to load time availability. Please try again."
      );
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (formData.date) {
      loadAvailability(formData.date);
    } else {
      setSlotCounts({});
    }
  }, [formData.date]);

  /* ================================
     APPLY SELECTED SERVICE / PACKAGE / OFFER
  ================================= */

  useEffect(() => {
    if (!selection) return;

    if (
      selection.type === "service" ||
      selection.type === "package" ||
      selection.type === "offer"
    ) {
      setFormData((prev) => ({
        ...prev,
        service: selection.name,
      }));
    }
  }, [selection]);

  const availableSlots = useMemo(() => {
    return timeSlots;
  }, []);

  /* ================================
     FORM CHANGE
  ================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");

    if (name === "date") {
      setFormData((prev) => ({
        ...prev,
        date: value,
        time: "",
      }));

      setTimeDropdownOpen(false);
    }

    if (name === "time") {
      const booked = slotCounts[value] || 0;

      if (booked >= hourlyLimit) {
        setErrorMessage(
          "This time slot is fully booked. Please choose another time."
        );

        return;
      }
    }
  };

  /* ================================
     TIME SELECT
  ================================= */

  const handleTimeSelect = (time) => {
    const booked = slotCounts[time] || 0;

    if (booked >= hourlyLimit) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      time,
    }));

    setErrorMessage("");
    setTimeDropdownOpen(false);
  };

  /* ================================
     SUBMIT APPOINTMENT
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setLoading(false);

        if (onRequireAuth) {
          onRequireAuth();
        }

        return;
      }

      if (!formData.date || !formData.time) {
        throw new Error(
          "Please select a date and available time."
        );
      }

      if (!formData.service) {
        throw new Error(
          "Please select a service or package."
        );
      }

      const selectedSlotCount =
        slotCounts[formData.time] || 0;

      if (selectedSlotCount >= hourlyLimit) {
        throw new Error(
          "This time slot is fully booked. Please choose another time."
        );
      }

      const appointmentTime = `${formData.time}:00`;

      const { error } = await supabase.rpc(
        "create_appointment_with_limit",
        {
          p_user_id: user.id,
          p_name: formData.name.trim(),
          p_phone: formData.phone.trim(),
          p_email: formData.email.trim(),
          p_service_name: formData.service,
          p_appointment_date: formData.date,
          p_appointment_time: appointmentTime,
          p_message: formData.message.trim() || null,
        }
      );

      if (error) {
        throw error;
      }

      setSubmitted(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Booking error:", error);

      const message = error?.message || "";

      if (
        message.toLowerCase().includes("fully booked")
      ) {
        setErrorMessage(
          "This time slot is fully booked. Please choose another time."
        );

        await loadAvailability(formData.date);
      } else {
        setErrorMessage(
          message ||
            "Unable to book your appointment. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     BOOK ANOTHER
  ================================= */

  const bookAnother = () => {
    setSubmitted(false);
    setErrorMessage("");
    setSlotCounts({});
    setTimeDropdownOpen(false);

    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
      date: "",
      time: "",
      message: "",
    });
  };

  return (
    <section
      className="appointment-section"
      id="appointment"
    >
      <div className="appointment-container">

        {/* HEADER */}

        <div className="appointment-header">
          <div className="appointment-label">
            <span></span>
            BOOK YOUR VISIT
          </div>

          <h2>
            Your glow
            <br />
            starts <em>here.</em>
          </h2>

          <p>
            Choose your service, preferred date and time.
            We will take care of the rest.
          </p>
        </div>

        {!submitted ? (
          <form
            className="appointment-form"
            onSubmit={handleSubmit}
          >

            {/* NAME + PHONE */}

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="appointment-name">
                  FULL NAME
                </label>

                <input
                  id="appointment-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-phone">
                  PHONE NUMBER
                </label>

                <input
                  id="appointment-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* EMAIL + SERVICE */}

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="appointment-email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="appointment-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-service">
                  SELECT SERVICE
                </label>

               <select
  id="appointment-service"
  name="service"
  value={formData.service}
  onChange={handleChange}
  required
>
  <option value="">
    Choose a service
  </option>

  {/* SELECTED SERVICE */}
  {selection?.type === "service" && (
    <option value={selection.name}>
      {selection.name}
    </option>
  )}

  {/* SELECTED PACKAGE */}
  {selection?.type === "package" && (
    <option value={selection.name}>
      {selection.name}
    </option>
  )}

  {/* SELECTED OFFER */}
  {selection?.type === "offer" && (
    <option value={selection.name}>
      {selection.name} — {selection.discount}
    </option>
  )}

  {services.map((service) => (
    <option
      key={service}
      value={service}
    >
      {service}
    </option>
  ))}
</select>
              </div>

            </div>

            {/* DATE + TIME */}

            <div className="form-row">

              {/* DATE */}

              <div className="form-group">
                <label htmlFor="appointment-date">
                  PREFERRED DATE
                </label>

                <input
                  id="appointment-date"
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* TIME */}

              <div className="form-group">
                <label>
                  PREFERRED TIME
                </label>

                {!formData.date ? (
                  <div className="time-empty">
                    Select a date first
                  </div>
                ) : loadingAvailability ? (
                  <div className="time-empty">
                    Checking availability...
                  </div>
                ) : (
                  <div className="time-picker">

                    {/* CLOSED TIME BOX */}

                    <button
                      type="button"
                      className={`time-picker-trigger ${
                        timeDropdownOpen ? "open" : ""
                      } ${
                        formData.time ? "has-value" : ""
                      }`}
                      onClick={() =>
                        setTimeDropdownOpen(
                          (prev) => !prev
                        )
                      }
                    >
                      <div className="time-picker-trigger-content">

                        <span className="time-picker-label">
                          {formData.time
                            ? formatTimeRange(
                                formData.time
                              )
                            : "Select your preferred time"}
                        </span>

                        {formData.time && (
                          <span className="time-picker-count">
                            {slotCounts[
                              formData.time
                            ] || 0}
                            /{hourlyLimit}
                          </span>
                        )}

                      </div>

                      <span
                        className={`time-picker-arrow ${
                          timeDropdownOpen
                            ? "rotate"
                            : ""
                        }`}
                      >
                        ↓
                      </span>
                    </button>

                    {/* OPEN TIME LIST */}

                    {timeDropdownOpen && (
                      <div className="time-picker-dropdown">

                        {availableSlots.map((time) => {
                          const booked =
                            slotCounts[time] || 0;

                          const full =
                            booked >= hourlyLimit;

                          const selected =
                            formData.time === time;

                          return (
                            <button
                              type="button"
                              key={time}
                              className={`time-dropdown-option ${
                                selected
                                  ? "selected"
                                  : ""
                              } ${
                                full ? "full" : ""
                              }`}
                              disabled={full}
                              onClick={() =>
                                handleTimeSelect(time)
                              }
                            >

                              <div className="time-option-main">
                                <FiClock />

                                <span className="time-option-range">
                                  {formatTimeRange(time)}
                                </span>
                              </div>

                              <span className="time-option-count">
                                {full
                                  ? "FULL"
                                  : `${booked}/${hourlyLimit}`}
                              </span>

                            </button>
                          );
                        })}

                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>

            {/* MESSAGE */}

            <div className="form-group full-width">
              <label htmlFor="appointment-message">
                ANYTHING WE SHOULD KNOW?
              </label>

              <textarea
                id="appointment-message"
                name="message"
                rows="5"
                placeholder="Tell us anything you'd like us to know..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ERROR */}

            {errorMessage && (
              <div className="appointment-error">
                {errorMessage}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="appointment-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "PLEASE WAIT..."
                  : "CONFIRM APPOINTMENT"}
              </span>

              {!loading && <FiArrowUpRight />}
            </button>

          </form>
        ) : (

          /* SUCCESS */

          <div className="appointment-success">

            <div className="success-icon">
              <FiCheck />
            </div>

            <div className="success-content">

              <span>
                APPOINTMENT CONFIRMED
              </span>

              <h3>
                Thank you, {formData.name}.
              </h3>

              <p>
                Your BellaGlow appointment has been
                successfully booked.
              </p>

              <div className="success-details">

                <div>
                  <small>SERVICE</small>

                  <strong>
                    {formData.service}
                  </strong>
                </div>

                <div>
                  <small>DATE</small>

                  <strong>
                    {formData.date}
                  </strong>
                </div>

                <div>
                  <small>TIME</small>

                  <strong>
                    {formatTimeRange(formData.time)}
                  </strong>
                </div>

              </div>

              <button
                type="button"
                className="book-another"
                onClick={bookAnother}
              >
                BOOK ANOTHER APPOINTMENT
                <FiArrowUpRight />
              </button>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default Appointment;