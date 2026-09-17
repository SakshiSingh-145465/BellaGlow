import { FiArrowUpRight } from "react-icons/fi";
import ServiceCard from "./ServiceCard";
import "./Services.css";

import hairImage from "../../assets/image/beauty.png";
import facialImage from "../../assets/image/beauty.png";
import makeupImage from "../../assets/image/beauty.png";
import nailImage from "../../assets/image/beauty.png";
import spaImage from "../../assets/image/beauty.png";
import bridalImage from "../../assets/image/beauty.png";

function Services({ onBookService }) {
  const services = [
    {
      number: "01",
      name: "Hair Care",
      description:
        "Beautiful cuts, styling, coloring and treatments designed around you.",
      price: "799",
      duration: "60 min",
      image: hairImage,
    },
    {
      number: "02",
      name: "Skin & Facial",
      description:
        "Relaxing facial rituals that refresh your skin and restore its natural glow.",
      price: "999",
      duration: "75 min",
      image: facialImage,
    },
    {
      number: "03",
      name: "Makeup",
      description:
        "Elegant makeup looks created for celebrations, events and special moments.",
      price: "1499",
      duration: "90 min",
      image: makeupImage,
    },
    {
      number: "04",
      name: "Nail Care",
      description:
        "Beautiful manicures and nail treatments with a refined finishing touch.",
      price: "599",
      duration: "45 min",
      image: nailImage,
    },
    {
      number: "05",
      name: "Spa & Wellness",
      description:
        "Slow down, relax and enjoy a calming wellness experience away from the rush.",
      price: "1299",
      duration: "90 min",
      image: spaImage,
    },
    {
      number: "06",
      name: "Bridal Services",
      description:
        "Complete bridal beauty experiences created to make your special day unforgettable.",
      price: "4999",
      duration: "180 min",
      image: bridalImage,
    },
  ];

  const handleBook = (service) => {
    if (onBookService) {
      onBookService(service);
    }

    const appointmentSection =
      document.getElementById("appointment");

    if (appointmentSection) {
      appointmentSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="services" className="services-section">

      <div className="services-heading">

        <div className="section-label">
          <span></span>
          OUR SERVICES
        </div>

        <div className="services-title-row">
          <div>
            <h2>
              Beauty services
              <br />
              <em>for every you.</em>
            </h2>
          </div>

          <div className="services-intro">
            <p>
              Thoughtfully designed beauty rituals,
              personalized to help you feel confident,
              relaxed and beautifully yourself.
            </p>

            <button
              className="services-explore"
              onClick={() => {
                const appointment =
                  document.getElementById("appointment");

                if (appointment) {
                  appointment.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              BOOK YOUR VISIT
              <FiArrowUpRight />
            </button>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.number}
            service={service}
            onBook={handleBook}
          />
        ))}
      </div>

    </section>
  );
}

export default Services;