import React from "react";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";

function PackagesCard({ packageData, onSelect }) {
  return (
    <article
      className={`package-card ${
        packageData.featured ? "featured" : ""
      }`}
    >
      <div className="package-top">
        <span className="package-number">
          {packageData.number}
        </span>

        <span className="package-subtitle">
          {packageData.subtitle}
        </span>
      </div>

      <h3>{packageData.name}</h3>

      <p className="package-description">
        {packageData.description}
      </p>

      <div className="package-price">
        <span>FROM</span>
        <strong>{packageData.price}</strong>
      </div>

      <div className="package-services">
        {packageData.services.map((service) => (
          <div
            className="package-service"
            key={service}
          >
            <FiCheck />
            <span>{service}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="package-button"
        onClick={() => {
          if (onSelect) {
            onSelect();
          }
        }}
      >
        <span>CHOOSE PACKAGE</span>
        <FiArrowUpRight />
      </button>
    </article>
  );
}

export default PackagesCard;