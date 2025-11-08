import React, { useRef } from "react";
import "./gallery-strip.css";

export default function GalleryStrip({
  images = [],                 // [{ src, alt, href }] or [{ src, alt, onClick }]
  onPrev,                      // optional external controls
  onNext,
  className = "",
  style = {},
  scrollBy = 420,              // px to scroll per click
}) {
  const trackRef = useRef(null);

  const scrollLeft = () => {
    if (onPrev) return onPrev();
    trackRef.current?.scrollBy({ left: -scrollBy, behavior: "smooth" });
  };
  const scrollRight = () => {
    if (onNext) return onNext();
    trackRef.current?.scrollBy({ left: scrollBy, behavior: "smooth" });
  };

  return (
    <section className={`gallery-strip ${className}`} style={style} aria-label="Gallery strip">
      <button
        type="button"
        className="gallery-strip__arrow gallery-strip__arrow--left"
        aria-label="Previous"
        onClick={scrollLeft}
      >
        ‹
      </button>

      <div className="gallery-strip__track" ref={trackRef}>
        {images.map((img, i) => {
          const content = (
            <img
              className="gallery-strip__img"
              src={img.src}
              alt={img.alt ?? `Image ${i + 1}`}
              loading="lazy"
              draggable="false"
            />
          );

          return (
            <div className="gallery-strip__item" key={i}>
              {img.href ? (
                <a
                  className="gallery-strip__link"
                  href={img.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={img.alt ?? ""}
                >
                  {content}
                </a>
              ) : img.onClick ? (
                <button className="gallery-strip__link" type="button" onClick={img.onClick} title={img.alt ?? ""}>
                  {content}
                </button>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="gallery-strip__arrow gallery-strip__arrow--right"
        aria-label="Next"
        onClick={scrollRight}
      >
        ›
      </button>
    </section>
  );
}
