import React from "react";

function Teamcard({ member }) {
  return (
    <article className="team-card">

      <div className="team-image">

        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
          />
        ) : (
          <div className="team-placeholder">
            <span>{member.number}</span>
            <strong>
              {member.name.charAt(0)}
            </strong>
            <small>
              BELLAGLOW
            </small>
          </div>
        )}

        <span className="team-number">
          {member.number}
        </span>

      </div>

      <div className="team-card-content">

        <span className="team-role">
          {member.role}
        </span>

        <h3>
          {member.name}
        </h3>

        <p>
          {member.description}
        </p>

      </div>

    </article>
  );
}

export default Teamcard;