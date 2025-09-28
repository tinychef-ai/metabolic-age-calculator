// Admin utilities for data access (not exposed to users)
// These functions are for your internal use only

// Function to get all stored data (admin only)
export const getAllStoredData = () => {
  try {
    const storedData = JSON.parse(localStorage.getItem('metabolicAgeData') || '[]');
    return storedData;
  } catch (error) {
    console.error('Error retrieving stored data:', error);
    return [];
  }
};

// Function to export all data as CSV (admin only)
export const exportAllDataAsCSV = () => {
  try {
    const storedData = getAllStoredData();
    
    if (storedData.length === 0) {
      console.log('No data to export');
      return;
    }

    // Create CSV headers
    const headers = [
      'Timestamp',
      'Age',
      'Height (cm)',
      'Weight (kg)',
      'BMI',
      'Bowel',
      'Bloating',
      'Energy',
      'Sensitivities',
      'Fermented',
      'Vegetables',
      'Hydration',
      'Timing',
      'Sleep',
      'Activity',
      'Stress',
      'Actual Age',
      'Metabolic Age',
      'Age Difference',
      'Gut Score',
      'Gut Band',
      'Gut Impact',
      'BMI Category',
      'BMI Impact',
      'Sleep Impact',
      'Activity Impact',
      'Stress Impact'
    ];

    // Create CSV rows
    const rows = storedData.map(entry => [
      entry.timestamp,
      entry.userData.age,
      entry.userData.heightCm,
      entry.userData.weightKg,
      entry.results.bmi,
      entry.userData.bowel,
      entry.userData.bloating,
      entry.userData.energy,
      entry.userData.sensitivities,
      entry.userData.fermented,
      entry.userData.vegetables,
      entry.userData.hydration,
      entry.userData.timing,
      entry.userData.sleep,
      entry.userData.activity,
      entry.userData.stress,
      entry.results.actualAge,
      entry.results.metabolicAge,
      entry.results.ageDifference,
      entry.results.gutScore,
      entry.results.gutBand,
      entry.results.gutImpact,
      entry.results.bmiCategory,
      entry.results.bmiImpact,
      entry.results.sleepImpact,
      entry.results.activityImpact,
      entry.results.stressImpact
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `metabolic-age-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('CSV exported successfully');
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};

// Function to get data statistics (admin only)
export const getDataStatistics = () => {
  try {
    const storedData = getAllStoredData();
    
    if (storedData.length === 0) {
      return { totalResponses: 0, message: 'No data collected yet' };
    }

    const stats = {
      totalResponses: storedData.length,
      averageAge: storedData.reduce((sum, entry) => sum + entry.userData.age, 0) / storedData.length,
      averageMetabolicAge: storedData.reduce((sum, entry) => sum + entry.results.metabolicAge, 0) / storedData.length,
      averageAgeDifference: storedData.reduce((sum, entry) => sum + entry.results.ageDifference, 0) / storedData.length,
      averageGutScore: storedData.reduce((sum, entry) => sum + entry.results.gutScore, 0) / storedData.length,
      gutBandDistribution: {},
      bmiCategoryDistribution: {},
      sleepDistribution: {},
      activityDistribution: {},
      stressDistribution: {}
    };

    // Calculate distributions
    storedData.forEach(entry => {
      // Gut band distribution
      const gutBand = entry.results.gutBand;
      stats.gutBandDistribution[gutBand] = (stats.gutBandDistribution[gutBand] || 0) + 1;

      // BMI category distribution
      const bmiCategory = entry.results.bmiCategory;
      stats.bmiCategoryDistribution[bmiCategory] = (stats.bmiCategoryDistribution[bmiCategory] || 0) + 1;

      // Sleep distribution
      const sleep = entry.userData.sleep;
      stats.sleepDistribution[sleep] = (stats.sleepDistribution[sleep] || 0) + 1;

      // Activity distribution
      const activity = entry.userData.activity;
      stats.activityDistribution[activity] = (stats.activityDistribution[activity] || 0) + 1;

      // Stress distribution
      const stress = entry.userData.stress;
      stats.stressDistribution[stress] = (stats.stressDistribution[stress] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return { error: 'Failed to calculate statistics' };
  }
};

// Function to clear all stored data (admin only)
export const clearAllStoredData = () => {
  localStorage.removeItem('metabolicAgeData');
  console.log('All stored data cleared');
};

// Function to add admin functions to window object (for console access)
export const enableAdminFunctions = () => {
  if (typeof window !== 'undefined') {
    window.adminUtils = {
      getAllStoredData,
      exportAllDataAsCSV,
      getDataStatistics,
      clearAllStoredData
    };
    console.log('Admin functions enabled. Use window.adminUtils to access them.');
    console.log('Available functions:');
    console.log('- window.adminUtils.getAllStoredData()');
    console.log('- window.adminUtils.exportAllDataAsCSV()');
    console.log('- window.adminUtils.getDataStatistics()');
    console.log('- window.adminUtils.clearAllStoredData()');
  }
};
