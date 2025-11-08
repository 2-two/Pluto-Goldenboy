import React, { useState, useEffect } from 'react';
import './ImageModal.css';

export default function ImageModal({ images, initialIndex, onClose }) {
  // If there are no images or no initial index, don't render the modal.
  if (!images || images.length === 0 || initialIndex === null) {
    return null;
  }

  // State to manage the currently displayed image index within the modal
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update currentIndex if initialIndex changes (e.g., if a new image is clicked directly from the strip)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Get the current image to display
  const currentImage = images[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Keyboard navigation (optional, but good for UX)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrev();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToPrev, goToNext, onClose]); // Dependencies for useEffect

  return (
    <div 
      className="image-modal__backdrop" 
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal__title"
    >
      <div 
        className="image-modal__content" 
        onClick={(e) => e.stopPropagation()} // Stop click from closing the modal
        id="image-modal__title"
      >
        <img 
          src={currentImage.src} 
          alt={currentImage.alt || "Enlarged view"} 
          className="image-modal__img" 
        />
        
        {/* Previous Button */}
        <button 
          className="image-modal__nav-btn image-modal__nav-btn--prev" 
          onClick={goToPrev}
          aria-label="Previous image"
        >
          &lt;
        </button>
        
        {/* Next Button */}
        <button 
          className="image-modal__nav-btn image-modal__nav-btn--next" 
          onClick={goToNext}
          aria-label="Next image"
        >
          &gt;
        </button>

        {/* Close Button */}
        <button 
          className="image-modal__close-btn" 
          onClick={onClose}
          aria-label="Close image view"
        >
          &times;
        </button>
      </div>
    </div>
  );
}