import React from "react";

function HighlightCard({ item }) {
  return (
    <article className="highlight-card">
      <div className="highlight-top">
        <span className="highlight-number">
          {item.number}
        </span>

        <div className="highlight-icon">
          {item.icon}
        </div>
      </div>

      <div className="highlight-content">
        <h3>{item.title}</h3>

        <p>{item.text}</p>
      </div>

      <span className="highlight-line"></span>
    </article>
  );
}

export default HighlightCard;