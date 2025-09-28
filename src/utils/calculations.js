// Metabolic Age Calculation Logic based on PRD formulas

// Calculate BMI
const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Get BMI category and impact (PRD accurate categories)
const getBMIImpact = (bmi) => {
  let category, impact;
  
  if (bmi < 18.5) {
    category = "Underweight";
    impact = 1.0;
  } else if (bmi >= 18.5 && bmi < 25.0) {
    category = "Healthy";
    impact = 0.0;
  } else if (bmi >= 25.0 && bmi < 30.0) {
    category = "Overweight";
    impact = 1.0;
  } else if (bmi >= 30.0 && bmi < 35.0) {
    category = "Obesity I";
    impact = 3.0;
  } else {
    category = "Obesity II+";
    impact = 5.0;
  }
  
  return { category, impact };
};

// Calculate Gut Score based on responses (PRD accurate weights)
const calculateGutScore = (responses) => {
  let score = 0;
  
  // Bowel regularity — 15 points
  switch (responses.bowel) {
    case 'daily': score += 15; break;
    case 'sometimes': score += 10; break; // altDay equivalent
    case 'rare': score += 5; break; // irregular equivalent
  }
  
  // Bloating/gas — 15 points
  switch (responses.bloating) {
    case 'never': score += 15; break;
    case 'sometimes': score += 10; break;
    case 'often': score += 5; break;
  }
  
  // Energy after meals — 10 points
  switch (responses.energy) {
    case 'energized': score += 10; break;
    case 'normal': score += 7; break;
    case 'sluggish': score += 3; break;
  }
  
  // Food sensitivities — 10 points
  switch (responses.sensitivities) {
    case 'none': score += 10; break;
    case 'few': score += 7; break;
    case 'many': score += 3; break;
  }
  
  // Fermented/probiotic — 15 points
  switch (responses.fermented) {
    case 'daily': score += 15; break;
    case '3to5': score += 12; break;
    case '1to2': score += 8; break;
    case 'rare': score += 3; break;
  }
  
  // Fiber intake — 20 points (highest weight)
  switch (responses.vegetables) {
    case 'high': score += 20; break;
    case 'mid': score += 12; break;
    case 'low': score += 5; break;
  }
  
  // Hydration — 5 points
  switch (responses.hydration) {
    case 'eightPlus': score += 5; break;
    case 'fiveToSeven': score += 3; break;
    case 'underFive': score += 1; break;
  }
  
  // Meal timing — 10 points
  switch (responses.timing) {
    case 'regular': score += 10; break;
    case 'somewhat': score += 5; break;
    case 'chaotic': score += 0; break;
  }
  
  return Math.min(score, 100); // Total possible: 100 points
};

// Get Gut Score impact (PRD accurate 3-band system)
const getGutImpact = (gutScore) => {
  let band, impact;
  
  if (gutScore >= 80) {
    band = "High";
    impact = -2.0; // High gut health reduces metabolic age
  } else if (gutScore >= 50) {
    band = "Adequate";
    impact = 0.0; // Adequate gut health has no impact
  } else {
    band = "Low";
    impact = 2.0; // Low gut health adds years
  }
  
  return { band, impact };
};

// Get Sleep impact (PRD accurate values)
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

// Get Activity impact (PRD accurate values)
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

// Get Stress impact (PRD accurate values)
const getStressImpact = (stress) => {
  let label, impact;
  
  switch (stress) {
    case 'calm':
      label = "Calm & Peaceful";
      impact = 0.0;
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
    },
    // Add raw data for Google Sheets
    rawData: {
      age: actualAge,
      heightCm,
      weightKg,
      bmi,
      gutScore,
      ...userData
    }
  };
};

// Test cases from PRD (for validation)
export const testCalculations = () => {
  console.log("Testing calculations against PRD golden test cases...");
  
  // T1: 25y, great gut, great sleep, very active, calm, BMI 22
  const test1 = calculateMetabolicAge({
    age: 25,
    heightCm: 170,
    weightKg: 63.5, // BMI 22
    bowel: 'daily',
    bloating: 'never',
    energy: 'energized',
    sensitivities: 'none',
    fermented: 'daily',
    vegetables: 'high',
    hydration: 'eightPlus',
    timing: 'regular',
    sleep: 'great',
    activity: 'veryActive',
    stress: 'calm'
  });
  
  console.log("Test 1 (Expected: 22.0, -3.0 yrs):", test1);
  
  // T2: 25y, poor gut, okay sleep, somewhat active, managing stress, BMI 27
  const test2 = calculateMetabolicAge({
    age: 25,
    heightCm: 170,
    weightKg: 78, // BMI 27
    bowel: 'rare',
    bloating: 'often',
    energy: 'sluggish',
    sensitivities: 'many',
    fermented: 'rare',
    vegetables: 'low',
    hydration: 'underFive',
    timing: 'chaotic',
    sleep: 'okay',
    activity: 'somewhat',
    stress: 'managing'
  });
  
  console.log("Test 2 (Expected: 29.5, +4.5 yrs):", test2);
  
  // T3: 40y, average gut, great sleep, light activity, moderate stress, BMI 24
  const test3 = calculateMetabolicAge({
    age: 40,
    heightCm: 170,
    weightKg: 69.4, // BMI 24
    bowel: 'sometimes',
    bloating: 'sometimes',
    energy: 'normal',
    sensitivities: 'few',
    fermented: '3to5',
    vegetables: 'mid',
    hydration: 'fiveToSeven',
    timing: 'somewhat',
    sleep: 'great',
    activity: 'notMuch',
    stress: 'stressed'
  });
  
  console.log("Test 3 (Expected: 40.5, +0.5 yrs):", test3);
  
  return { test1, test2, test3 };
};
