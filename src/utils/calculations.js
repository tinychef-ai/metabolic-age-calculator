// Metabolic Age Calculation Logic based on PRD formulas

// Calculate BMI
const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Get BMI category and impact (Indian cutoffs)
const getBMIImpact = (bmi) => {
  let category, impact;
  
  if (bmi < 18.5) {
    category = "Underweight";
    impact = 1.0; // Underweight adds years
  } else if (bmi >= 18.5 && bmi < 23) {
    category = "Normal";
    impact = 0; // Normal BMI has no impact
  } else if (bmi >= 23 && bmi < 25) {
    category = "Overweight";
    impact = 0.5; // Slight overweight
  } else if (bmi >= 25 && bmi < 30) {
    category = "Obese Class I";
    impact = 1.5; // Obese adds more years
  } else {
    category = "Obese Class II+";
    impact = 2.5; // Severely obese
  }
  
  return { category, impact };
};

// Calculate Gut Score based on responses
const calculateGutScore = (responses) => {
  let score = 0;
  const maxScore = 100;
  
  // Bowel regularity (0-20 points)
  switch (responses.bowel) {
    case 'daily': score += 20; break;
    case 'sometimes': score += 10; break;
    case 'rare': score += 0; break;
  }
  
  // Bloating (0-15 points)
  switch (responses.bloating) {
    case 'never': score += 15; break;
    case 'sometimes': score += 8; break;
    case 'often': score += 0; break;
  }
  
  // Energy after meals (0-15 points)
  switch (responses.energy) {
    case 'energized': score += 15; break;
    case 'normal': score += 8; break;
    case 'sluggish': score += 0; break;
  }
  
  // Food sensitivities (0-10 points)
  switch (responses.sensitivities) {
    case 'none': score += 10; break;
    case 'few': score += 5; break;
    case 'many': score += 0; break;
  }
  
  // Fermented foods (0-15 points)
  switch (responses.fermented) {
    case 'daily': score += 15; break;
    case '3to5': score += 12; break;
    case '1to2': score += 8; break;
    case 'rare': score += 0; break;
  }
  
  // Vegetables/fiber (0-15 points)
  switch (responses.vegetables) {
    case 'high': score += 15; break;
    case 'mid': score += 10; break;
    case 'low': score += 0; break;
  }
  
  // Hydration (0-10 points)
  switch (responses.hydration) {
    case 'eightPlus': score += 10; break;
    case 'fiveToSeven': score += 6; break;
    case 'underFive': score += 0; break;
  }
  
  // Meal timing (0-10 points)
  switch (responses.timing) {
    case 'regular': score += 10; break;
    case 'somewhat': score += 5; break;
    case 'chaotic': score += 0; break;
  }
  
  return Math.min(score, maxScore);
};

// Get Gut Score impact
const getGutImpact = (gutScore) => {
  let band, impact;
  
  if (gutScore >= 80) {
    band = "Excellent";
    impact = -2; // Excellent gut health reduces metabolic age
  } else if (gutScore >= 50) {
    band = "Good";
    impact = 0; // Good gut health has no impact
  } else {
    band = "Poor";
    impact = 2; // Poor gut health adds years
  }
  
  return { band, impact };
};

// Get Sleep impact
const getSleepImpact = (sleep) => {
  let label, impact;
  
  switch (sleep) {
    case 'great':
      label = "Great (7-9 hrs)";
      impact = -0.5;
      break;
    case 'okay':
      label = "Okay (5-7 hrs)";
      impact = 0.5;
      break;
    case 'poor':
      label = "Poor (<5 or >10 hrs)";
      impact = 1.5;
      break;
    default:
      label = "Unknown";
      impact = 0;
  }
  
  return { label, impact };
};

// Get Activity impact
const getActivityImpact = (activity) => {
  let label, impact;
  
  switch (activity) {
    case 'veryActive':
      label = "Very Active";
      impact = -0.5;
      break;
    case 'somewhat':
      label = "Somewhat Active";
      impact = 0.5;
      break;
    case 'notMuch':
      label = "Not Much";
      impact = 2.0;
      break;
    default:
      label = "Unknown";
      impact = 0;
  }
  
  return { label, impact };
};

// Get Stress impact
const getStressImpact = (stress) => {
  let label, impact;
  
  switch (stress) {
    case 'calm':
      label = "Calm & Peaceful";
      impact = 0;
      break;
    case 'managing':
      label = "Managing Okay";
      impact = 0.5;
      break;
    case 'stressed':
      label = "Pretty Stressed";
      impact = 1.0;
      break;
    case 'overwhelmed':
      label = "Overwhelmed";
      impact = 2.0;
      break;
    default:
      label = "Unknown";
      impact = 0;
  }
  
  return { label, impact };
};

// Main calculation function
export const calculateMetabolicAge = (userData) => {
  const actualAge = userData.age;
  const heightCm = userData.heightCm;
  const weightKg = userData.weightKg;
  
  // Calculate BMI
  const bmi = calculateBMI(weightKg, heightCm);
  const bmiData = getBMIImpact(bmi);
  
  // Calculate Gut Score
  const gutScore = calculateGutScore(userData);
  const gutData = getGutImpact(gutScore);
  
  // Get other impacts
  const sleepData = getSleepImpact(userData.sleep);
  const activityData = getActivityImpact(userData.activity);
  const stressData = getStressImpact(userData.stress);
  
  // Calculate total impact
  const totalImpact = gutData.impact + bmiData.impact + sleepData.impact + activityData.impact + stressData.impact;
  
  // Calculate metabolic age with clamping
  let metabolicAge = actualAge + totalImpact;
  metabolicAge = Math.max(actualAge - 5, Math.min(actualAge + 10, metabolicAge));
  
  const ageDifference = metabolicAge - actualAge;
  
  return {
    actualAge,
    metabolicAge,
    ageDifference,
    factors: {
      gut: {
        score: gutScore,
        band: gutData.band,
        impact: gutData.impact
      },
      bmi: {
        value: Math.round(bmi * 10) / 10,
        category: bmiData.category,
        impact: bmiData.impact
      },
      sleep: {
        label: sleepData.label,
        impact: sleepData.impact
      },
      activity: {
        label: activityData.label,
        impact: activityData.impact
      },
      stress: {
        label: stressData.label,
        impact: stressData.impact
      }
    }
  };
};
