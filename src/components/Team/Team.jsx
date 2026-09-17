import React from "react";
import Teamcard from "./Teamcard";
import "./Team.css";

const teamMembers = [
  {
    number: "01",
    name: "Ananya Sharma",
    role: "Senior Hair Artist",
    description:
      "Specialist in modern cuts, styling and effortless hair transformations.",
    image: null,
  },
  {
    number: "02",
    name: "Meera Kapoor",
    role: "Skin & Facial Expert",
    description:
      "Focused on personalised skin rituals designed to reveal your natural glow.",
    image: null,
  },
  {
    number: "03",
    name: "Riya Malhotra",
    role: "Makeup Artist",
    description:
      "Creates elegant, polished makeup looks for celebrations and special occasions.",
    image: null,
  },
  {
    number: "04",
    name: "Kavya Mehta",
    role: "Bridal Beauty Expert",
    description:
      "Creates complete bridal beauty experiences with thoughtful attention to every detail.",
    image: null,
  },
];

function Team() {
  return (
    <section className="team-section" id="experts">
      <div className="team-container">

        <div className="team-header">

          <div className="team-label">
            <span></span>
            MEET OUR EXPERTS
          </div>

          <div className="team-heading-row">

            <h2>
              Artists behind
              <br />
              your <em>glow.</em>
            </h2>

            <p>
              Meet the talented professionals who bring
              experience, creativity and a personal touch
              to every BellaGlow experience.
            </p>

          </div>

        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <Teamcard
              key={member.number}
              member={member}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default Team;