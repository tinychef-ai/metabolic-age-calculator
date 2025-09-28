// Test script to verify calculations match PRD golden test cases
const { calculateMetabolicAge } = require('./src/utils/calculations.js');

console.log("Testing Metabolic Age Calculations against PRD Golden Test Cases\n");

// T1: 25y, great gut, great sleep, very active, calm, BMI 22
console.log("Test 1: 25y, great gut, great sleep, very active, calm, BMI 22");
console.log("Expected: 22.0 (-3.0 yrs)");
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
console.log("Actual:", test1.metabolicAge, `(${test1.ageDifference} yrs)`);
console.log("Gut Score:", test1.factors.gut.score, "Band:", test1.factors.gut.band);
console.log("");

// T2: 25y, poor gut, okay sleep, somewhat active, managing stress, BMI 27
console.log("Test 2: 25y, poor gut, okay sleep, somewhat active, managing stress, BMI 27");
console.log("Expected: 29.5 (+4.5 yrs)");
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
console.log("Actual:", test2.metabolicAge, `(${test2.ageDifference} yrs)`);
console.log("Gut Score:", test2.factors.gut.score, "Band:", test2.factors.gut.band);
console.log("");

// T3: 40y, average gut, great sleep, light activity, moderate stress, BMI 24
console.log("Test 3: 40y, average gut, great sleep, light activity, moderate stress, BMI 24");
console.log("Expected: 40.5 (+0.5 yrs)");
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
console.log("Actual:", test3.metabolicAge, `(${test3.ageDifference} yrs)`);
console.log("Gut Score:", test3.factors.gut.score, "Band:", test3.factors.gut.band);
console.log("");

console.log("All tests completed!");
