import React, { useRef, useEffect } from 'react';
import './WheelPicker.css';

const WheelPicker = ({ min, max, value, onChange, step = 1, unit = '' }) => {
  const containerRef = useRef(null);
  const options = [];
  
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.wheel-option.active');
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [value]);

  return (
    <div className="wheel-picker">
      <div className="wheel-container" ref={containerRef}>
        <div className="spacer" />
        {options.map((option) => (
          <div
            key={option}
            className={`wheel-option ${value === option ? 'active' : ''}`}
            onClick={() => onChange(option)}
          >
            {option}{unit}
          </div>
        ))}
        <div className="spacer" />
      </div>
    </div>
  );
};

export default WheelPicker;
