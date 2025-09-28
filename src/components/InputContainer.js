import React, { useState, useEffect } from 'react';
import './InputContainer.css';

const InputContainer = ({ currentStep, onUserResponse, onNumberInput, flowData }) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const [numberValue, setNumberValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const currentStepData = flowData.flow.find(step => step.id === currentStep);

  useEffect(() => {
    setSelectedChip(null);
    setNumberValue('');
    setShowInput(false);
  }, [currentStep]);

  const handleChipClick = (option) => {
    setSelectedChip(option.value);
    onUserResponse(option.value, option.label, currentStepData);
  };

  const handleNumberSubmit = () => {
    if (numberValue && currentStepData) {
      onNumberInput(parseFloat(numberValue), currentStepData);
    }
  };

  const handleNumberChange = (e) => {
    setNumberValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNumberSubmit();
    }
  };

  if (!currentStepData) return null;

  // Show number input for number type steps
  if (currentStepData.type === 'number') {
    return (
      <div className="input-container">
        <div className="input-wrapper">
          <div className="number-input-container">
            <input
              type="number"
              value={numberValue}
              onChange={handleNumberChange}
              onKeyPress={handleKeyPress}
              placeholder={currentStepData.input?.placeholder || 'Enter value'}
              min={currentStepData.input?.min}
              max={currentStepData.input?.max}
              step={currentStepData.input?.step}
              className="number-input"
            />
            {currentStepData.input?.unit && (
              <span className="input-unit">{currentStepData.input.unit}</span>
            )}
          </div>
          <button 
            onClick={handleNumberSubmit}
            disabled={!numberValue}
            className="submit-btn"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // Show chips for choice type steps
  if (currentStepData.type === 'chips' && currentStepData.options) {
    return (
      <div className="input-container">
        <div className="input-wrapper">
          <div className="chip-container">
            {currentStepData.options.map((option, index) => (
              <button
                key={index}
                className={`chip ${selectedChip === option.value ? 'selected' : ''}`}
                onClick={() => handleChipClick(option)}
                disabled={selectedChip !== null}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InputContainer;
