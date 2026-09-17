import { useState } from "react";
import {
  FiArrowUpRight,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import "./Navbar.css";

function Navbar({
  user,
  onLogin,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "HOME", id: "home" },
    { name: "ABOUT", id: "about" },
    { name: "SERVICES", id: "services" },
    { name: "EXPERTS", id: "experts" },
    { name: "GALLERY", id: "gallery" },
    { name: "PACKAGES", id: "packages" },
    { name: "CONTACT", id: "contact" },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setMenuOpen(false);
  };

  const handleLogin = () => {
    setMenuOpen(false);

    if (onLogin) {
      onLogin();
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);

    if (onLogout) {
      await onLogout();
    }
  };

  const handleBookAppointment = () => {
    setMenuOpen(false);

    const appointmentSection =
      document.getElementById("appointment");

    if (appointmentSection) {
      appointmentSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <button
          type="button"
          className="brand"
          onClick={() => scrollToSection("home")}
        >
          <span className="brand-circle">
            B
          </span>

          <span className="brand-info">
            <strong>BellaGlow</strong>
            <small>BEAUTY STUDIO</small>
          </span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-link ${
                item.id === "home" ? "active" : ""
              }`}
              onClick={() =>
                scrollToSection(item.id)
              }
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="navbar-actions">

          {/* LOGIN / LOGOUT */}
          {user ? (
            <button
              type="button"
              className="auth-nav-button"
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut />
              <span>LOG OUT</span>
            </button>
          ) : (
            <button
              type="button"
              className="auth-nav-button"
              onClick={handleLogin}
              title="Login"
            >
              <FiUser />
              <span>LOG IN</span>
            </button>
          )}

          {/* BOOK APPOINTMENT */}
          <button
            type="button"
            className="book-button"
            onClick={handleBookAppointment}
          >
            <span>BOOK APPOINTMENT</span>
            <FiArrowUpRight />
          </button>

          {/* VISIT SALON */}
          <button
            type="button"
            className="visit-salon"
            onClick={() =>
              scrollToSection("contact")
            }
          >
            <span className="visit-dot"></span>
            VISIT OUR SALON
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMenuOpen((prev) => !prev)
          }
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() =>
              scrollToSection(item.id)
            }
          >
            {item.name}
          </button>
        ))}

        {/* MOBILE LOGIN / LOGOUT */}
        {user ? (
          <button
            type="button"
            className="mobile-auth"
            onClick={handleLogout}
          >
            <FiLogOut />
            LOG OUT
          </button>
        ) : (
          <button
            type="button"
            className="mobile-auth"
            onClick={handleLogin}
          >
            <FiUser />
            LOG IN
          </button>
        )}

        {/* MOBILE BOOK */}
        <button
          type="button"
          className="mobile-book"
          onClick={handleBookAppointment}
        >
          BOOK APPOINTMENT
          <FiArrowUpRight />
        </button>

        {/* MOBILE VISIT */}
        <button
          type="button"
          className="mobile-visit"
          onClick={() =>
            scrollToSection("contact")
          }
        >
          <span className="visit-dot"></span>
          VISIT OUR SALON
        </button>
      </div>
    </header>
  );
}

export default Navbar;