import React from "react";
import "./About.css";

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">

        <div className="about-image">
          <div className="about-image-box">
            <span>BEAUTY</span>
            <strong>B</strong>
            <small>BELLAGLOW</small>
          </div>
        </div>

        <div className="about-content">

          <div className="about-label">
            <span></span>
            ABOUT BELLAGLOW
          </div>

          <h2>
            Where beauty
            <br />
            meets <em>confidence.</em>
          </h2>

          <p className="about-intro">
            BellaGlow is a modern beauty studio created for women
            who believe beauty should feel personal, comfortable
            and completely their own.
          </p>

          <p>
            From thoughtful hair and skin rituals to makeup, nails,
            spa and bridal beauty, every service is designed with
            care, attention and a refined touch.
          </p>

          <div className="about-stats">
            <div>
              <strong>08</strong>
              <span>Years of<br />experience</span>
            </div>

            <div>
              <strong>25+</strong>
              <span>Beauty<br />experts</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Happy<br />clients</span>
            </div>
          </div>

          <button className="about-button">
            DISCOVER OUR STORY
            <span>↗</span>
          </button>

        </div>

      </div>
    </section>
  );
}

export default About;