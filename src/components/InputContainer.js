import React, { useState, useEffect } from 'react';
import './InputContainer.css';
import UnitsToggle from './UnitsToggle';
import WheelPicker from './WheelPicker';
import { validateNumber, autoCorrectValue, toCm, toKg, VALIDATION_RULES } from '../utils/units';

const InputContainer = ({ currentStep, onUserResponse, onNumberInput, flowData, uiState, onUIStateChange }) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const [numberValue, setNumberValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [autoCorrectSuggestion, setAutoCorrectSuggestion] = useState(null);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(6);
  const [weightLb, setWeightLb] = useState(150);

  const currentStepData = flowData.flow.find(step => step.id === currentStep);

  useEffect(() => {
    setSelectedChip(null);
    setNumberValue('');
    setShowInput(false);
    setValidationError(null);
    setAutoCorrectSuggestion(null);
  }, [currentStep]);

  const handleChipClick = (option) => {
    setSelectedChip(option.value);
    onUserResponse(option.value, option.label, currentStepData);
  };

  const handleNumberSubmit = () => {
    if (!currentStepData) return;
    
    const value = parseFloat(numberValue);
    const error = validateNumber(currentStepData.bind, value);
    
    if (error) {
      setValidationError(error);
      return;
    }
    
    // Check for auto-correct suggestions
    const suggestion = autoCorrectValue(currentStepData.bind, value);
    if (suggestion) {
      setAutoCorrectSuggestion(suggestion);
      return;
    }
    
    setValidationError(null);
    setAutoCorrectSuggestion(null);
    onNumberInput(value, currentStepData);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setNumberValue(value);
    setValidationError(null);
    setAutoCorrectSuggestion(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNumberSubmit();
    }
  };

  const handleUnitsChange = (unitType, newUnit) => {
    onUIStateChange({
      ...uiState,
      units: {
        ...uiState.units,
        [unitType]: newUnit
      }
    });
  };

  const handleHeightSubmit = () => {
    if (!currentStepData) return;
    
    let heightCm;
    if (uiState.units.height === 'cm') {
      const value = parseFloat(numberValue);
      const error = validateNumber('heightCm', value);
      if (error) {
        setValidationError(error);
        return;
      }
      heightCm = value;
    } else {
      heightCm = toCm({ ft: heightFt, inch: heightIn }, 'ftin');
    }
    
    setValidationError(null);
    onNumberInput(heightCm, currentStepData);
  };

  const handleWeightSubmit = () => {
    if (!currentStepData) return;
    
    let weightKg;
    if (uiState.units.weight === 'kg') {
      const value = parseFloat(numberValue);
      const error = validateNumber('weightKg', value);
      if (error) {
        setValidationError(error);
        return;
      }
      weightKg = value;
    } else {
      weightKg = toKg({ lb: weightLb }, 'lb');
    }
    
    setValidationError(null);
    onNumberInput(weightKg, currentStepData);
  };

  const acceptAutoCorrect = () => {
    if (autoCorrectSuggestion) {
      setNumberValue(autoCorrectSuggestion.corrected.toString());
      setAutoCorrectSuggestion(null);
    }
  };

  if (!currentStepData) return null;

  // Show number input for number type steps
  if (currentStepData.type === 'number') {
    const isHeight = currentStepData.bind === 'heightCm';
    const isWeight = currentStepData.bind === 'weightKg';
    const isAge = currentStepData.bind === 'age';
    
    return (
      <div className="input-container">
        <div className="input-wrapper">
          {/* Units toggle for height and weight */}
          {(isHeight || isWeight) && (
            <UnitsToggle
              type={isHeight ? 'height' : 'weight'}
              value={uiState.units[isHeight ? 'height' : 'weight']}
              onChange={(newUnit) => handleUnitsChange(isHeight ? 'height' : 'weight', newUnit)}
            />
          )}
          
          {/* Age input - simple number */}
          {isAge && (
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
                inputMode="numeric"
              />
              {currentStepData.input?.unit && (
                <span className="input-unit">{currentStepData.input.unit}</span>
              )}
            </div>
          )}
          
          {/* Height input - cm or ft/in */}
          {isHeight && (
            <div className="height-input-container">
              {uiState.units.height === 'cm' ? (
                <div className="number-input-container">
                  <input
                    type="number"
                    value={numberValue}
                    onChange={handleNumberChange}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 170"
                    min={120}
                    max={210}
                    step={1}
                    className="number-input"
                    inputMode="numeric"
                  />
                  <span className="input-unit">cm</span>
                </div>
              ) : (
                <div className="ft-in-container">
                  <div className="wheel-input">
                    <label>Feet</label>
                    <WheelPicker
                      min={3}
                      max={7}
                      value={heightFt}
                      onChange={setHeightFt}
                      unit="ft"
                    />
                  </div>
                  <div className="wheel-input">
                    <label>Inches</label>
                    <WheelPicker
                      min={0}
                      max={11}
                      value={heightIn}
                      onChange={setHeightIn}
                      unit="in"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Weight input - kg or lb */}
          {isWeight && (
            <div className="weight-input-container">
              {uiState.units.weight === 'kg' ? (
                <div className="number-input-container">
                  <input
                    type="number"
                    value={numberValue}
                    onChange={handleNumberChange}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 72.5"
                    min={35}
                    max={180}
                    step={0.5}
                    className="number-input"
                    inputMode="numeric"
                  />
                  <span className="input-unit">kg</span>
                </div>
              ) : (
                <div className="wheel-input">
                  <WheelPicker
                    min={77}
                    max={397}
                    value={weightLb}
                    onChange={setWeightLb}
                    unit="lb"
                    step={1}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Validation error */}
          {validationError && (
            <div className="validation-error">
              {validationError}
            </div>
          )}
          
          {/* Auto-correct suggestion */}
          {autoCorrectSuggestion && (
            <div className="auto-correct-suggestion">
              <p>{autoCorrectSuggestion.message}</p>
              <button onClick={acceptAutoCorrect} className="accept-btn">
                Yes, use {autoCorrectSuggestion.corrected}
              </button>
            </div>
          )}
          
          {/* Submit button */}
          <button 
            onClick={isHeight ? handleHeightSubmit : isWeight ? handleWeightSubmit : handleNumberSubmit}
            disabled={validationError || autoCorrectSuggestion || (!numberValue && !isHeight && !isWeight)}
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
