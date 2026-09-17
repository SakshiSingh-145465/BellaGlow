function SectionTitle({
  eyebrow,
  title,
  description,
  centered = false,
}) {
  return (
    <div
      className={`section-heading ${
        centered ? "centered" : ""
      }`}
    >
      {eyebrow && (
        <span className="section-label">
          {eyebrow}
        </span>
      )}

      <h2>{title}</h2>

      {description && <p>{description}</p>}
    </div>
  );
}

export default SectionTitle;