import React from "react";
import {
  FiHeart,
  FiAward,
  FiStar,
  FiSmile,
} from "react-icons/fi";

import FeatureCard from "./FeatureCard";
import "./WhyChooseUs.css";

const features = [
  {
    number: "01",
    icon: <FiHeart />,
    title: "Personalised Beauty",
    description:
      "Every treatment is thoughtfully tailored to your features, preferences and personal style.",
  },
  {
    number: "02",
    icon: <FiAward />,
    title: "Expert Professionals",
    description:
      "Our experienced beauty professionals bring skill, care and attention to every appointment.",
  },
  {
    number: "03",
    icon: <FiStar />,
    title: "Premium Products",
    description:
      "We carefully select trusted, quality products for beautiful and lasting results.",
  },
  {
    number: "04",
    icon: <FiSmile />,
    title: "Relaxing Experience",
    description:
      "Enjoy a calm, comfortable and welcoming beauty experience from start to finish.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-choose-section" id="why-us">
      <div className="why-choose-container">

        <div className="why-choose-header">

          <div className="why-choose-label">
            <span></span>
            WHY BELLAGLOW
          </div>

          <div className="why-choose-heading">

            <h2>
              Beauty with
              <br />
              <em>intention.</em>
            </h2>

            <p>
              We believe beauty should feel personal, thoughtful
              and effortless. Every detail at BellaGlow is created
              to make you feel comfortable, cared for and confident.
            </p>

          </div>

        </div>

        <div className="why-choose-grid">

          {features.map((feature) => (
            <FeatureCard
              key={feature.number}
              number={feature.number}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;