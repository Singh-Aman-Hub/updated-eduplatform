import React, { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
      
        top: position.y,
        left: position.x,
        width: "50px",
        height: "50px",
        
        backgroundColor: "rgba(61, 176, 225, 0.52)",
        borderRadius: "50%",
        pointerEvents: "none", // so it doesn't block clicks
        transform: "translate(-50%, -50%)",
        transition: "transform 0.9s ease-out",
        zIndex: 9999,
      }}
    />
  );
};

export default CustomCursor;