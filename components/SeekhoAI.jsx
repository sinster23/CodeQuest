// src/components/AIAssistantButton.jsx
import { useState } from "react";

export default function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)"
        }}
      >
        🤖
      </button>

      {/* Simple popup window */}
      {isOpen && (
        <div 
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            padding: "10px",
            zIndex: 1000
          }}
        >
          <h4>AI Assistant</h4>
          <p>How can I help you today?</p>
          {/* Later, integrate your AI chat component here */}
        </div>
      )}
    </>
  );
}
