// Google Apps Script for Google Sheets Integration
// Copy this code into Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Metabolic Age Data');
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Metabolic Age Data');
      
      // Add headers
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
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4F46E5');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp,
      data.userData.age,
      data.userData.heightCm,
      data.userData.weightKg,
      data.results.bmi,
      data.userData.bowel,
      data.userData.bloating,
      data.userData.energy,
      data.userData.sensitivities,
      data.userData.fermented,
      data.userData.vegetables,
      data.userData.hydration,
      data.userData.timing,
      data.userData.sleep,
      data.userData.activity,
      data.userData.stress,
      data.results.actualAge,
      data.results.metabolicAge,
      data.results.ageDifference,
      data.results.gutScore,
      data.results.gutBand,
      data.results.gutImpact,
      data.results.bmiCategory,
      data.results.bmiImpact,
      data.results.sleepImpact,
      data.results.activityImpact,
      data.results.stressImpact
    ];
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ message: 'Metabolic Age Calculator API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Setup function to create the spreadsheet and sheet
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Metabolic Age Data');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Metabolic Age Data');
    
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
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#4F46E5');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    
    console.log('Setup complete! Sheet created with headers.');
  } else {
    console.log('Sheet already exists.');
  }
}
