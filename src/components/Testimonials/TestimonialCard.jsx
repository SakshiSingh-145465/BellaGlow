import React from "react";
import { FiStar } from "react-icons/fi";

function TestimonialCard({ testimonial }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        <FiStar />
        <FiStar />
        <FiStar />
        <FiStar />
        <FiStar />
      </div>

      <div className="testimonial-quote">“</div>

      <p className="testimonial-text">
        {testimonial.text}
      </p>

      <div className="testimonial-author">
        <div className="author-initial">
          {testimonial.name.charAt(0)}
        </div>

        <div className="author-info">
          <strong>{testimonial.name}</strong>
          <span>{testimonial.role}</span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;