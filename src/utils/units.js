// Units conversion utilities

export const UNITS = {
  height: {
    cm: 'cm',
    ftin: 'ft/in'
  },
  weight: {
    kg: 'kg',
    lb: 'lb'
  }
};

// Conversion functions
export const toCm = (value, units) => {
  if (units === 'cm') {
    return clamp(value.cm ?? 0, 120, 210);
  }
  // ft/in to cm
  const totalIn = (value.ft ?? 0) * 12 + (value.inch ?? 0);
  const cm = totalIn * 2.54;
  return clamp(cm, 120, 210);
};

export const toKg = (value, units) => {
  if (units === 'kg') {
    return clamp(value.kg ?? 0, 35, 180);
  }
  // lb to kg
  const kg = (value.lb ?? 0) * 0.45359237;
  return clamp(kg, 35, 180);
};

// Helper function to clamp values
const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

// Validation rules
export const VALIDATION_RULES = {
  age: { min: 16, max: 90 },
  heightCm: { min: 120, max: 210 },
  weightKg: { min: 35, max: 180 },
  heightFt: { min: 3, max: 7 },
  heightIn: { min: 0, max: 11 },
  weightLb: { min: 77, max: 397 }
};

// Validation function
export const validateNumber = (name, value) => {
  const rule = VALIDATION_RULES[name];
  if (!rule) return null;
  
  if (Number.isNaN(value)) return 'Enter a number';
  if (value < rule.min || value > rule.max) {
    return `Keep it between ${rule.min}–${rule.max}`;
  }
  return null;
};

// Auto-correct obvious typos
export const autoCorrectValue = (name, value) => {
  if (name === 'heightCm' && value > 240 && value < 300) {
    const corrected = value / 10;
    if (corrected >= 120 && corrected <= 210) {
      return {
        corrected,
        message: `Did you mean ${corrected} cm?`
      };
    }
  }
  return null;
};
