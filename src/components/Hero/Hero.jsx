import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import beautyImage from "../../assets/image/beauty.png";
import "./Hero.css";

function Hero() {
  const scrollToAppointment = () => {
    const appointment = document.getElementById("appointment");

    if (appointment) {
      appointment.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const scrollToServices = () => {
    const services = document.getElementById("services");

    if (services) {
      services.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* LEFT SIDE */}
        <div className="hero-content">
          <div className="hero-label">
            <span></span>
            BEAUTY THAT INSPIRES
          </div>

          <h1>
            Enhance Your
            <br />
            <em>Beauty,</em>
            <br />
            Embrace Your
            <br />
            Glow
          </h1>

          <p className="hero-description">
            A refined beauty experience where expert artistry,
            premium products and personalized care come
            together to reveal your most radiant self.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-button"
              onClick={scrollToAppointment}
            >
              <span>BOOK APPOINTMENT</span>
              <FiArrowUpRight />
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={scrollToServices}
            >
              <span>EXPLORE SERVICES</span>
              <FiArrowUpRight />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img
              src={beautyImage}
              alt="BellaGlow Beauty Studio"
            />
          </div>

          <div className="hero-stat">
            <strong>08</strong>

            <div>
              <span>YEARS</span>
              <small>of beauty expertise</small>
            </div>
          </div>

          <div className="hero-decoration hero-decoration-one"></div>
          <div className="hero-decoration hero-decoration-two"></div>
        </div>

      </div>
    </section>
  );
}

export default Hero;