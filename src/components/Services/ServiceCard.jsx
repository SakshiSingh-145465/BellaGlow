import {
  FiArrowUpRight,
  FiClock,
  FiScissors,
} from "react-icons/fi";

function ServiceCard({ service, onBook }) {
  return (
    <article className="service-card">
      <div className="service-image-wrap">
        <img
          src={service.image}
          alt={service.name}
          className="service-image"
        />

        <span className="service-number">
          {service.number}
        </span>
      </div>

      <div className="service-content">
        <div className="service-icon">
          <FiScissors />
        </div>

        <h3>{service.name}</h3>

        <p>{service.description}</p>

        <div className="service-details">
          <span>
            <FiClock />
            {service.duration}
          </span>

          <strong>
            From ₹{service.price}
          </strong>
        </div>

        <button
          className="service-book"
          onClick={() => onBook(service)}
        >
          BOOK NOW
          <FiArrowUpRight />
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;