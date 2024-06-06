import React from 'react';
import './BlinkingText.css'; // Import the CSS file for the blinking effect

const BlinkingText = () => {
  const text = 'PhantaField';
  return (
    <div className="blinking-text">
      {text.split('').map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
          {char}
        </span>
      ))}
    </div>
  );
};

export default BlinkingText;
