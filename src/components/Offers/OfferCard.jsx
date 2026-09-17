import React from "react";
import { FiArrowUpRight, FiClock } from "react-icons/fi";

function OfferCard({ offer, onSelect }) {
  const handleBookOffer = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <article className="offer-card">

      <div className="offer-top">
        <span className="offer-number">
          {offer.number}
        </span>

        <span className="offer-tag">
          {offer.tag}
        </span>

        <FiArrowUpRight className="offer-arrow" />
      </div>

      <div className="offer-discount">
        {offer.discount}
      </div>

      <h3>{offer.title}</h3>

      <p className="offer-description">
        {offer.description}
      </p>

      <div className="offer-valid">
        <FiClock />
        <span>{offer.valid}</span>
      </div>

      <button
        type="button"
        className="offer-button"
        onClick={handleBookOffer}
      >
        <span>BOOK THIS OFFER</span>
        <FiArrowUpRight />
      </button>

    </article>
  );
}

export default OfferCard;