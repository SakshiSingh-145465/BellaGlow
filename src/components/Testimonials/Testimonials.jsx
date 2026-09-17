import React, { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import TestimonialCard from "./TestimonialCard";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Priya Mehta",
    role: "REGULAR CLIENT",
    text:
      "BellaGlow has completely changed the way I look at salon visits. The atmosphere is beautiful, the team is incredibly warm and every service feels so thoughtfully done.",
  },
  {
    name: "Aarohi Kapoor",
    role: "BRIDAL CLIENT",
    text:
      "I chose BellaGlow for my bridal beauty and couldn't have been happier. Everything felt calm, personal and beautifully organised. My makeup and hair were absolutely perfect.",
  },
  {
    name: "Nisha Sharma",
    role: "REGULAR CLIENT",
    text:
      "The attention to detail is what I love most about BellaGlow. From the consultation to the final result, you genuinely feel cared for.",
  },
  {
    name: "Rhea Malhotra",
    role: "MAKEUP CLIENT",
    text:
      "Such a lovely beauty studio. The makeup looked elegant and natural, exactly how I wanted it. I will definitely be coming back.",
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => {
    setCurrent((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const previousTestimonial = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = testimonials[current];

  return (
    <section
      className="testimonials-section"
      id="testimonials"
    >
      <div className="testimonials-container">

        {/* HEADER */}
        <div className="testimonials-header">

          <div className="testimonials-label">
            <span></span>
            CLIENT LOVE
          </div>

          <div className="testimonials-heading-row">

            <h2>
              Words from
              <br />
              our <em>glow girls.</em>
            </h2>

            <p>
              Beautiful experiences are best described by the
              people who have lived them. Here's what our clients
              have to say about their BellaGlow experience.
            </p>

          </div>
        </div>

        {/* TESTIMONIAL */}
        <div className="testimonial-slider">

          <TestimonialCard
            testimonial={currentTestimonial}
          />

          {/* CONTROLS */}
          <div className="testimonial-controls">

            <span className="testimonial-counter">
              0{current + 1}
              <small>
                / 0{testimonials.length}
              </small>
            </span>

            <div className="testimonial-arrows">

              <button
                type="button"
                onClick={previousTestimonial}
                aria-label="Previous testimonial"
              >
                <FiArrowLeft />
              </button>

              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <FiArrowRight />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Testimonials;