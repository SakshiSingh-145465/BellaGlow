import React from "react";
import GalleryItem from "./GalleryItem";
import "./Gallery.css";

const galleryFiles = import.meta.glob(
  "../../assets/image/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const images = Object.entries(galleryFiles)
  .map(([path, image]) => ({
    path,
    image,
  }))
  .slice(0, 6);

function Gallery() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-container">

        <div className="gallery-header">

          <div className="gallery-label">
            <span></span>
            OUR GALLERY
          </div>

          <div className="gallery-heading-row">

            <h2>
              Moments of
              <br />
              <em>beauty.</em>
            </h2>

            <p>
              A glimpse into the BellaGlow experience —
              beautiful details, thoughtful treatments and
              moments created just for you.
            </p>

          </div>

        </div>

        <div className="gallery-grid">

          {images.map((item, index) => (
            <GalleryItem
              key={item.path}
              image={item.image}
              number={`0${index + 1}`}
              index={index}
            />
          ))}

        </div>

        <div className="gallery-footer">

          <span>
            BELLA GLOW BEAUTY STUDIO
          </span>

          <p>
            Beauty • Style • Self Care
          </p>

        </div>

      </div>
    </section>
  );
}

export default Gallery;