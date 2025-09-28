// Google Sheets integration for data collection
// This uses Google Apps Script Web App for data collection

const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // Replace with your actual URL

// Function to send data to Google Sheets
export const sendToGoogleSheets = async (userData, results) => {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      userData: {
        age: userData.age,
        heightCm: userData.heightCm,
        weightKg: userData.weightKg,
        bowel: userData.bowel,
        bloating: userData.bloating,
        energy: userData.energy,
        sensitivities: userData.sensitivities,
        fermented: userData.fermented,
        vegetables: userData.vegetables,
        hydration: userData.hydration,
        timing: userData.timing,
        sleep: userData.sleep,
        activity: userData.activity,
        stress: userData.stress
      },
      results: {
        actualAge: results.actualAge,
        metabolicAge: results.metabolicAge,
        ageDifference: results.ageDifference,
        bmi: results.factors.bmi.value,
        bmiCategory: results.factors.bmi.category,
        gutScore: results.factors.gut.score,
        gutBand: results.factors.gut.band,
        gutImpact: results.factors.gut.impact,
        bmiImpact: results.factors.bmi.impact,
        sleepImpact: results.factors.sleep.impact,
        activityImpact: results.factors.activity.impact,
        stressImpact: results.factors.stress.impact
      }
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Data sent to Google Sheets successfully');
      return true;
    } else {
      console.error('Failed to send data to Google Sheets:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    return false;
  }
};

// Alternative: Store data locally for batch upload
export const storeDataLocally = (userData, results) => {
  try {
    const storedData = JSON.parse(localStorage.getItem('metabolicAgeData') || '[]');
    const newEntry = {
      timestamp: new Date().toISOString(),
      userData,
      results
    };
    
    storedData.push(newEntry);
    localStorage.setItem('metabolicAgeData', JSON.stringify(storedData));
    
    console.log('Data stored locally. Total entries:', storedData.length);
    return true;
  } catch (error) {
    console.error('Error storing data locally:', error);
    return false;
  }
};

// Function to export stored data as CSV
export const exportDataAsCSV = () => {
  try {
    const storedData = JSON.parse(localStorage.getItem('metabolicAgeData') || '[]');
    
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

// Function to clear stored data
export const clearStoredData = () => {
  localStorage.removeItem('metabolicAgeData');
  console.log('Stored data cleared');
};
