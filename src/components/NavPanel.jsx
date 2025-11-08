// src/components/NavPanel.jsx
import React from "react";
import "./nav-panel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function NavPanel({
  onChat = () => {},
  instagramHref = "#",
  facebookHref = "#",
  youtubeHref = "#",
  className = "",
  style = {},
}) {
  return (
    <nav
      className={`nav-rail ${className}`}
      style={style}
      aria-label="Navigation panel"
    >
      <button
        type="button"
        className="nav-rail__btn"
        aria-label="Chat"
        title="Chat"
        onClick={onChat}
      >
        <FontAwesomeIcon icon={faComments} />
      </button>

      <div className="nav-rail__sep" aria-hidden="true" />

      <a
        className="nav-rail__btn"
        href={instagramHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Instagram"
        title="Instagram"
      >
        <FontAwesomeIcon icon={faInstagram} />
      </a>

      <div className="nav-rail__sep" aria-hidden="true" />

      <a
        className="nav-rail__btn"
        href={facebookHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Facebook"
        title="Facebook"
      >
        <FontAwesomeIcon icon={faFacebook} />
      </a>

      <div className="nav-rail__sep" aria-hidden="true" />

      <a
        className="nav-rail__btn"
        href={youtubeHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="YouTube"
        title="YouTube"
      >
        <FontAwesomeIcon icon={faYoutube} />
      </a>
    </nav>
  );
}
