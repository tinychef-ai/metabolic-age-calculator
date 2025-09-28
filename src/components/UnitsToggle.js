import React from 'react';
import './UnitsToggle.css';

const UnitsToggle = ({ type, value, onChange }) => {
  const options = type === 'height' 
    ? [
        { value: 'cm', label: 'cm' },
        { value: 'ftin', label: 'ft/in' }
      ]
    : [
        { value: 'kg', label: 'kg' },
        { value: 'lb', label: 'lb' }
      ];

  return (
    <div className="units-toggle">
      {options.map((option) => (
        <button
          key={option.value}
          className={`unit-option ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default UnitsToggle;
