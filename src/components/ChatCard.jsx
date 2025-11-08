import React from "react";
import "./chat-card.css";

// 🎯 UPDATED: Accept two separate handlers
export default function ChatCard({
  onWhatsappTalk = () => {},
  onInstagramTalk = () => {},
  className = "",
  style = {},
}) {
  const title = "💬 Chat with Pluto 💬";
  const bodyLines = [
    "Ready to chat? This is where the magic happens! My human has trained me—the AI Pluto—to be just as enthusiastic and fun as the real deal (minus the actual slobber, thankfully).",
    "Ask Me Anything: I can tell you about Golden Retriever life, give you happy quotes, share stories about chasing squirrels, or just offer a friendly digital paw when you need a boost.",
    "How it Works: Just tap the link and start a conversation on WhatsApp. There's no download needed!",
    "The Goal: To deliver instant, happy vibes right to your phone. I'm available 24/7 and never need a nap!",
    "Go ahead, send the first \"Woof!\" I'm already listening!",
  ];

  return (
    <section
      className={`chat-card ${className}`}
      style={style}
      aria-labelledby="chat-card__title"
    >
      <header className="chat-card__header">
        <h2 id="chat-card__title" className="chat-card__title">
          {title}
        </h2>
      </header>

      <div className="chat-card__body">
        {bodyLines.map((line, i) => (
          <p key={i} className="chat-card__text">
            {line}
          </p>
        ))}
      </div>

      {/* 🎯 NEW: Button Container */}
      <div className="chat-card__cta-container">
        {/* Button 1: WhatsApp */}
        <button
          className="chat-card__cta chat-card__cta--whatsapp"
          type="button"
          onClick={onWhatsappTalk}
        >
          Chat on WP 💬
        </button>

        {/* Button 2: Instagram */}
        <button
          className="chat-card__cta chat-card__cta--instagram"
          type="button"
          onClick={onInstagramTalk}
        >
          Chat on Insta 📸
        </button>
      </div>
    </section>
  );
}