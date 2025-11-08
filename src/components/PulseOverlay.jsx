// src/components/PulseOverlay.jsx
import React, { useEffect, useState } from "react";

export default function PulseOverlay({
  color = "#ffcf71",
  duration = 480, // ms
}) {
  // separate state hooks: one to retrigger the animation, one for position
  const [key, setKey] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onPulse = (e) => {
      if (e.detail) setPos(e.detail);  // { x: %, y: % } from CustomEvent.detail
      setKey((k) => k + 1);            // remount to replay animation
    };
    window.addEventListener("pluto-pulse", onPulse);
    return () => window.removeEventListener("pluto-pulse", onPulse);
  }, []);

  return (
    <div
      key={key}
      className="pulse-overlay"
      style={{
        "--pulse-color": color,
        "--pulse-duration": `${duration}ms`,
        background: `radial-gradient(closest-side at ${pos.x}% ${pos.y}%,
          ${color} 0%,
          rgba(255, 255, 255, 0.7) 18%,
          rgba(255, 255, 255, 0.25) 35%,
          transparent 60%)`,
      }}
      aria-hidden="true"
    />
  );
}
