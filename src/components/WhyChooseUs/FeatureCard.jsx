import React from "react";

function FeatureCard({
  number,
  icon,
  title,
  description,
}) {
  return (
    <article className="why-choose-card">

      <div className="why-card-top">

        <span className="why-card-number">
          {number}
        </span>

        <div className="why-card-icon">
          {icon}
        </div>

      </div>

      <div className="why-card-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

      <span className="why-card-line"></span>

    </article>
  );
}

export default FeatureCard;