import React from "react";
import {
  FiHeart,
  FiStar,
  FiAward,
  FiUsers,
} from "react-icons/fi";
import "./Highlights.css";

const highlights = [
  {
    number: "01",
    icon: <FiHeart />,
    title: "Personalised Care",
    text:
      "Every visit begins with understanding you, your style and what makes you feel your best.",
  },
  {
    number: "02",
    icon: <FiStar />,
    title: "Premium Experience",
    text:
      "From our calming space to every finishing detail, we create an experience worth remembering.",
  },
  {
    number: "03",
    icon: <FiAward />,
    title: "Trusted Experts",
    text:
      "Our skilled beauty professionals combine experience, creativity and thoughtful attention.",
  },
  {
    number: "04",
    icon: <FiUsers />,
    title: "Beauty For Everyone",
    text:
      "Whether it is everyday self-care or a special celebration, there is a BellaGlow experience for you.",
  },
];

function Highlights() {
  return (
    <section
      className="highlights-section"
      id="highlights"
    >
      <div className="highlights-container">

        <div className="highlights-header">

          <div className="highlights-label">
            <span></span>
            THE BELLAGLOW EXPERIENCE
          </div>

          <div className="highlights-heading-row">

            <h2>
              Little details.
              <br />
              <em>Beautiful difference.</em>
            </h2>

            <p>
              We believe the little things are what make a
              beauty experience feel truly special. From the
              first welcome to the final touch, everything is
              thoughtfully considered.
            </p>

          </div>
        </div>

        <div className="highlights-grid">

          {highlights.map((item) => (
            <article
              className="highlight-card"
              key={item.number}
            >

              <div className="highlight-top">

                <span className="highlight-number">
                  {item.number}
                </span>

                <div className="highlight-icon">
                  {item.icon}
                </div>

              </div>

              <div className="highlight-content">

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </div>

              <span className="highlight-line"></span>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Highlights;