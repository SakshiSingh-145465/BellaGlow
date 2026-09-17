import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Highlights from "./components/Highlights/Highlights";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Team from "./components/Team/Team";
import Gallery from "./components/Gallery/Gallery";
import Packages from "./components/Packages/Packages";
import Offers from "./components/Offers/Offers";
import Appointment from "./components/Appointment/Appointment";
import MyAppointment from "./components/MyAppointment/MyAppointment";
import Testimonials from "./components/Testimonials/Testimonials";
import FAQ from "./components/FAQ/FAQ";
import Auth from "./components/Auth/Auth";

import haircareImage from "./assets/image/haircare.png";
import skinImage from "./assets/image/skin-and-facial.png";
import makeupImage from "./assets/image/makeup.png";
import nailImage from "./assets/image/Nail.png";
import spaImage from "./assets/image/Spa&Wellness.png";
import bridalImage from "./assets/image/bridel-service.png";

import "./App.css";

/* =====================================================
   DEFAULT IMAGES FOR SERVICES
===================================================== */

const serviceImages = {
  "Hair Care": haircareImage,
  "Skin & Facial": skinImage,
  Makeup: makeupImage,
  "Nail Care": nailImage,
  "Spa & Wellness": spaImage,
  "Bridal Services": bridalImage,
};

/* =====================================================
   APP
===================================================== */

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Stores selected service/package/offer
  const [bookingSelection, setBookingSelection] =
    useState(null);

  // Services from Supabase
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] =
    useState(true);

  /* ========================================
     GET CURRENT USER
  ======================================== */

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser || null);
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ========================================
     LOAD SERVICES FROM SUPABASE
  ======================================== */

  useEffect(() => {
    const loadServices = async () => {
      setServicesLoading(true);

      const { data, error } = await supabase
        .from("salon_services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Services loading error:",
          error
        );

        setServices([]);
      } else {
        setServices(data || []);
      }

      setServicesLoading(false);
    };

    loadServices();
  }, []);

  /* ========================================
     AUTH
  ======================================== */

  const openAuth = () => {
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  /* ========================================
     LOGIN SUCCESS
  ======================================== */

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setAuthOpen(false);

    // If user selected something before login,
    // take them to appointment after login.
    if (bookingSelection) {
      setTimeout(() => {
        const appointment =
          document.getElementById("appointment");

        if (appointment) {
          appointment.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 300);
    }
  };

  /* ========================================
     LOGOUT
  ======================================== */

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Logout error:",
        error
      );
      return;
    }

    setUser(null);
    setBookingSelection(null);
  };

  /* ========================================
     BOOK APPOINTMENT
  ======================================== */

  const handleBookAppointment = (
    selection = null
  ) => {
    // Save selected service/package/offer
    setBookingSelection(selection);

    // If not logged in, open login/signup popup
    if (!user) {
      openAuth();
      return;
    }

    // If already logged in, go directly
    // to appointment
    setTimeout(() => {
      const appointment =
        document.getElementById("appointment");

      if (appointment) {
        appointment.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className="app">

      {/* ========================================
          NAVBAR
      ======================================== */}

      <Navbar
        user={user}
        onLogin={openAuth}
        onLogout={handleLogout}
      />

      <main>

        {/* ========================================
            HERO
        ======================================== */}

        <Hero />

        {/* ========================================
            SERVICES
        ======================================== */}

        <section
          className="services-section"
          id="services"
        >
          <div className="section-heading">

            <div className="section-label">
              <span></span>
              OUR SERVICES
            </div>

            <div className="services-heading-row">

              <h2>
                Beauty services
                <br />
                <em>made for you.</em>
              </h2>

              <p>
                From everyday beauty rituals to
                special occasions, discover
                thoughtfully designed services
                created around your individual
                style.
              </p>

            </div>
          </div>

          {/* ======================================
              SERVICES LOADING
          ====================================== */}

          {servicesLoading ? (

            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <p>
                Loading our beauty services...
              </p>
            </div>

          ) : services.length === 0 ? (

            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <p>
                Our services are currently
                being updated. Please check
                again soon.
              </p>
            </div>

          ) : (

            <div className="services-grid">

              {services.map(
                (service, index) => (

                  <article
                    className="service-card"
                    key={service.id}
                  >

                    {/* SERVICE IMAGE */}

                    <div className="service-image">

                      <img
                        src={
                          service.image_url ||
                          serviceImages[
                            service.title
                          ]
                        }
                        alt={service.title}
                      />

                      <span className="service-number">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                    </div>

                    {/* SERVICE CONTENT */}

                    <div className="service-content">

                      <div className="service-icon">
                        ✂
                      </div>

                      <h3>
                        {service.title}
                      </h3>

                      <p>
                        {service.description}
                      </p>

                      <div className="service-info">

                        <span>
                          {service.duration}
                        </span>

                        <strong>
                          {service.price}
                        </strong>

                      </div>

                      {/* BOOK NOW */}

                      <button
                        type="button"
                        className="service-button"
                        onClick={() =>
                          handleBookAppointment({
                            type: "service",
                            name:
                              service.title,
                            price:
                              service.price,
                          })
                        }
                      >
                        <span>
                          BOOK NOW
                        </span>

                        <b>
                          ↗
                        </b>
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* ========================================
            ABOUT
        ======================================== */}

        <About />

        {/* ========================================
            HIGHLIGHTS
        ======================================== */}

        <Highlights />

        {/* ========================================
            WHY CHOOSE US
        ======================================== */}

        <WhyChooseUs />

        {/* ========================================
            EXPERTS
        ======================================== */}

        <Team />

        {/* ========================================
            GALLERY
        ======================================== */}

        <Gallery />

        {/* ========================================
            PACKAGES
        ======================================== */}

        <Packages
          onSelect={handleBookAppointment}
        />

        {/* ========================================
            SPECIAL OFFERS
        ======================================== */}

        <Offers
          onSelect={handleBookAppointment}
        />

        {/* ========================================
            APPOINTMENT
        ======================================== */}

        <Appointment
          onRequireAuth={openAuth}
          selection={bookingSelection}
        />

        {/* ========================================
            MY APPOINTMENT
        ======================================== */}

        <MyAppointment
          user={user}
          onBookAppointment={
            handleBookAppointment
          }
        />

        {/* ========================================
            TESTIMONIALS
        ======================================== */}

        <Testimonials />

        {/* ========================================
            FAQ
        ======================================== */}

        <FAQ />

        {/* ========================================
            CONTACT
        ======================================== */}

        <section
          className="contact-section"
          id="contact"
        >
          <div className="contact-container">

            <div className="contact-header">

              <div className="contact-label">
                <span></span>
                GET IN TOUCH
              </div>

              <div className="contact-heading-row">

                <h2>
                  Come in,
                  <br />
                  <em>glow out.</em>
                </h2>

                <p>
                  Your next beauty moment is
                  waiting. Visit BellaGlow for
                  thoughtful beauty, beautiful
                  results and a little time just
                  for you.
                </p>

              </div>

            </div>

            <div className="contact-grid">

              {/* VISIT US */}

              <div className="contact-info-card">

                <span className="contact-card-number">
                  01
                </span>

                <span className="contact-card-label">
                  VISIT US
                </span>

                <h3>
                  Your beautiful
                  <br />
                  escape awaits.
                </h3>

                <p>
                  24 Rose Avenue,
                  <br />
                  Bandra West,
                  <br />
                  Mumbai, Maharashtra 400050
                </p>

              </div>

              {/* CALL US */}

              <div className="contact-info-card">

                <span className="contact-card-number">
                  02
                </span>

                <span className="contact-card-label">
                  CALL US
                </span>

                <h3>
                  Let's talk
                  <br />
                  beauty.
                </h3>

                <a href="tel:+919876543210">
                  +91 98765 43210
                </a>

                <p>
                  Mon – Sat
                  <br />
                  10:00 AM – 8:00 PM
                </p>

              </div>

              {/* EMAIL */}

              <div className="contact-info-card">

                <span className="contact-card-number">
                  03
                </span>

                <span className="contact-card-label">
                  EMAIL
                </span>

                <h3>
                  Say
                  <br />
                  hello.
                </h3>

                <a href="mailto:hello@bellaglow.com">
                  hello@bellaglow.com
                </a>

                <p>
                  We'd love to hear from you
                  <br />
                  and help plan your next visit.
                </p>

              </div>

              {/* FOLLOW */}

              <div className="contact-info-card">

                <span className="contact-card-number">
                  04
                </span>

                <span className="contact-card-label">
                  FOLLOW ALONG
                </span>

                <h3>
                  Stay in
                  <br />
                  the glow.
                </h3>

                <a href="#home">
                  @bellaglowstudio
                </a>

                <p>
                  Beauty inspiration,
                  <br />
                  studio moments & more.
                </p>

              </div>

            </div>

            {/* CONTACT CTA */}

            <div className="contact-bottom">

              <div className="contact-bottom-text">

                <span>
                  READY WHEN YOU ARE
                </span>

                <p>
                  Book your appointment and
                  make some time for yourself.
                </p>

              </div>

              <button
                type="button"
                className="contact-book-button"
                onClick={() =>
                  handleBookAppointment()
                }
              >
                <span>
                  BOOK APPOINTMENT
                </span>

                <b>
                  ↗
                </b>
              </button>

            </div>

          </div>
        </section>

      </main>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="footer">

        <div className="footer-logo">

          <span>
            B
          </span>

          <div>

            <strong>
              BellaGlow
            </strong>

            <small>
              BEAUTY STUDIO
            </small>

          </div>

        </div>

        <div className="footer-content">

          <p>
            © {new Date().getFullYear()} BellaGlow
            Beauty Studio. All rights reserved.
          </p>

          {/* ADMIN LOGIN LINK */}

          <a
            href="/admin"
            className="footer-admin-link"
          >
            ADMIN LOGIN
            <span>
              ↗
            </span>
          </a>

        </div>

      </footer>

      {/* ========================================
          AUTH MODAL
      ======================================== */}

      <Auth
        isOpen={authOpen}
        onClose={closeAuth}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;