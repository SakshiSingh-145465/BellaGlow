import React from "react";

function GalleryItem({ image, number, index }) {
  return (
    <div className={`gallery-item gallery-item-${index + 1}`}>

      <img
        src={image}
        alt={`BellaGlow gallery ${number}`}
      />

      <div className="gallery-item-overlay">

        <span>
          {number}
        </span>

      </div>

    </div>
  );
}

export default GalleryItem;