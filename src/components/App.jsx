import "./app.css";
import React, { useRef, useState } from "react";
import DogScene from "./dog";
import AboutCard from "./AboutCard";
import ChatCard from "./ChatCard";
import NavPanel from "./NavPanel";
import GalleryStrip from "./GalleryStrip";
import PulseOverlay from "./PulseOverlay";
import ImageModal from "./ImageModal";

export default function App() {
  const eventsRef = useRef(null);
  // State for the modal: null when closed, { index: number, image: object } when open
  const [modalState, setModalState] = useState({ isOpen: false, initialIndex: null });

  // --- START OF UPDATED CHAT LOGIC ---
  // Using the direct AI chat links provided by the user (no phone number needed)
  const WA_URL = 'https://wa.me/ais/986840272826183?s=5'; 
  const INSTA_AI_CHAT_URL = 'https://aistudio.instagram.com/ai/986840272826183/?utm_source=mshare';
  
  // The dog's official social profile link (for general social icons)
  const INSTA_PROFILE_URL = "https://instagram.com/pupstarpluto"; 

  // Handlers for the two distinct chat methods
  const handleWhatsappTalk = () => {
    // Opens WhatsApp AI chat link in a new tab
    window.open(WA_URL, '_blank');
  };

  const handleInstagramTalk = () => {
    // Opens Instagram AI chat link in a new tab
    window.open(INSTA_AI_CHAT_URL, '_blank');
  };
  // --- END OF UPDATED CHAT LOGIC ---

  // Function to open the modal with a specific image by its index
  const openImageModal = (index) => {
    setModalState({ isOpen: true, initialIndex: index });
  };

  // Function to close the modal
  const closeImageModal = () => {
    setModalState({ isOpen: false, initialIndex: null });
  };

  // Define the images array. Now, onClick passes the index.
  const images = [
    { src: "/images/img (1).jpg", alt: "Image 1", onClick: () => openImageModal(0) },
    { src: "/images/img (2).jpg", alt: "Image 2", onClick: () => openImageModal(1) },
    { src: "/images/img (3).jpg", alt: "Image 3", onClick: () => openImageModal(2) },
    { src: "/images/img (4).jpg", alt: "Image 4", onClick: () => openImageModal(3) },
    { src: "/images/img (5).jpg", alt: "Image 5", onClick: () => openImageModal(4) },
    { src: "/images/img (6).jpg", alt: "Image 6", onClick: () => openImageModal(5) },
    { src: "/images/img (7).jpg", alt: "Image 7", onClick: () => openImageModal(6) },
    { src: "/images/img (8).jpg", alt: "Image 8", onClick: () => openImageModal(7) },
    { src: "/images/img (9).jpg", alt: "Image 9", onClick: () => openImageModal(8) },
    { src: "/images/img (10).jpg", alt: "Image 10", onClick: () => openImageModal(9) },
  ];

  return (
    <div ref={eventsRef} className="page-bg" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Single WebGL scene (transparent canvas for CSS bg) */}
      <DogScene eventsSource={eventsRef} />

      <PulseOverlay color="#ffcf71" duration={480} />

      {/* UI overlay */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        {/* About (left) - Primary button defaults to WhatsApp chat */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: "var(--left-gutter-w)",
            pointerEvents: "auto",
          }}
        >
          <AboutCard onTalk={handleWhatsappTalk} />
        </div>

        {/* Chat (right) - Primary button defaults to WhatsApp chat */}
        <div
          style={{
            position: "absolute",
            top: 32,
            right: "calc(32px + var(--nav-rail-w) + var(--nav-rail-gap))",
            pointerEvents: "auto",
          }}
        >
          <ChatCard 
            onWhatsappTalk={handleWhatsappTalk} 
            onInstagramTalk={handleInstagramTalk}
          />
        </div>
      </div>

      {/* Right-edge navigation rail */}
      <NavPanel
        // Passing both chat handlers to the NavPanel
        onWhatsappChat={handleWhatsappTalk} 
        onInstagramChat={handleInstagramTalk}
        // Using the dog's main profile link for the social icon/footer links
        instagramHref={INSTA_PROFILE_URL} 
        facebookHref="https://instagram.com/pupstarpluto"
        youtubeHref="https://www.youtube.com/channel/UC1HVuWQh7fr0fk3LEWdRUkQ"
      />

      {/* Bottom gallery strip */}
      <GalleryStrip images={images} />
      
      {/* Image Modal: Conditionally renders based on modalState */}
      {modalState.isOpen && (
        <ImageModal 
          images={images} 
          initialIndex={modalState.initialIndex} 
          onClose={closeImageModal} 
        />
      )}
    </div>
  );
}