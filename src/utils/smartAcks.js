// Smart acknowledgements based on previous answers

export const getSmartAcknowledgement = (userData, currentAnswer, currentStep) => {
  const rules = [
    // Hydration and bloating
    {
      when: (data) => data.hydration === 'eightPlus' && data.bloating === 'often',
      say: "Hydration looks solid 💧. Since you still feel bloated often, we'll check meal timing and fermented foods next."
    },
    {
      when: (data) => data.fermented === 'daily' && data.bloating === 'often',
      say: "Daily curd/ferments + frequent bloating could mean sensitivity; we'll look at timing and fiber balance."
    },
    {
      when: (data) => data.activity === 'notMuch' && data.sleep !== 'great',
      say: "Low activity can worsen sleep quality — a short walk after dinner often helps."
    },
    {
      when: (data) => data.vegetables === 'low' && data.bloating === 'often',
      say: "Low fiber intake can contribute to bloating. More vegetables might help with regularity."
    },
    {
      when: (data) => data.timing === 'chaotic' && data.energy === 'sluggish',
      say: "Irregular meal times can affect energy levels. Consistent timing helps your body's rhythm."
    },
    {
      when: (data) => data.stress === 'overwhelmed' && data.sleep === 'poor',
      say: "High stress often impacts sleep. Managing stress can significantly improve your metabolic age."
    },
    {
      when: (data) => data.sensitivities === 'many' && data.fermented === 'rare',
      say: "Many sensitivities + no fermented foods might mean gut imbalance. Probiotics could help."
    },
    {
      when: (data) => data.bowel === 'rare' && data.hydration === 'underFive',
      say: "Irregular bowel movements + low hydration often go together. More water can help."
    },
    {
      when: (data) => data.energy === 'energized' && data.vegetables === 'high',
      say: "Great energy + high veggie intake suggests good gut health! 🌱"
    },
    {
      when: (data) => data.sleep === 'great' && data.activity === 'veryActive',
      say: "Excellent sleep + high activity — you're doing great for your metabolic age! 💪"
    }
  ];

  // Find the first matching rule
  for (const rule of rules) {
    if (rule.when(userData)) {
      return rule.say;
    }
  }

  // Default acknowledgements based on current step
  const defaultAcks = {
    bowel: "Regularity matters for gut health.",
    bloating: "Bloating patterns help us understand your digestive health.",
    energy: "Energy levels after meals tell us about your metabolism.",
    sensitivities: "Food sensitivities can impact gut health significantly.",
    fermented: "Fermented foods are great for gut bacteria diversity.",
    vegetables: "Fiber from vegetables supports healthy digestion.",
    hydration: "Proper hydration is crucial for all body functions.",
    timing: "Meal timing affects your body's natural rhythms.",
    sleep: "Quality sleep is essential for metabolic health.",
    activity: "Regular movement keeps your metabolism active.",
    stress: "Stress management is key to overall health."
  };

  return defaultAcks[currentStep] || "Thanks for that information.";
};

// Preview metabolic age impact mid-flow
export const getMetabolicAgePreview = (userData) => {
  if (Object.keys(userData).length < 5) return null; // Need some data first
  
  // Simple preview calculation (not the full calculation)
  let preview = "Right now the biggest factors look like: ";
  const factors = [];
  
  if (userData.bowel === 'rare') factors.push("irregular bowel movements");
  if (userData.bloating === 'often') factors.push("frequent bloating");
  if (userData.energy === 'sluggish') factors.push("low energy after meals");
  if (userData.vegetables === 'low') factors.push("low vegetable intake");
  if (userData.hydration === 'underFive') factors.push("low hydration");
  if (userData.sleep === 'poor') factors.push("poor sleep quality");
  if (userData.activity === 'notMuch') factors.push("low activity level");
  if (userData.stress === 'overwhelmed') factors.push("high stress levels");
  
  if (factors.length === 0) {
    return "Your lifestyle factors look pretty good so far! 👍";
  }
  
  if (factors.length <= 2) {
    preview += factors.join(" and ");
  } else {
    preview += factors.slice(0, 2).join(", ") + " and others";
  }
  
  return preview + ".";
};
