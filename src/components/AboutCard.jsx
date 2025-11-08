import React from "react";
import "./aboutcard.css";

export default function AboutCard({ onTalk = () => {}, className = "", style = {} }) {
  // Content is locked inside this component
  const title = "🐾 Pluto: The Golden Boy! 🐾";
  const bodyLines = [
    "Woof woof! Hi there! I'm Pluto, and I'm a super-friendly Golden Retriever with a tail that never stops wagging! My human built this cool WhatsApp agent so you can get a little piece of my sunny personality anytime you need it.",
    "My Vibe: Loyal, goofy, eternally happy, and always ready to make you smile (or maybe just convince you to throw the squeaky toy).",
    "Favorite Things: Swimming, belly rubs, long walks, and getting post-walk zoomies!",
    "Ruff! This AI version of me is packed with my charm and loves to talk about walks, treats, and the best way to spend a Saturday. Think of me as the digital version of that happy paw on your lap!",
    "Drop a line and say hello! I can't wait to fetch your messages!"
  ];

  return (
    <section
      className={`about-card ${className}`}
      style={style}
      aria-labelledby="about-card__title"
    >
      <header className="about-card__header">
        <h2 id="about-card__title" className="about-card__title">
          {title}
        </h2>
      </header>

      <div className="about-card__body">
        {bodyLines.map((line, i) => (
          <p key={i} className="about-card__text">
            {line}
          </p>
        ))}
      </div>

      {/* <button className="about-card__cta" type="button" onClick={onTalk}>
        Talk Now
      </button> */}
    </section>
  );
}