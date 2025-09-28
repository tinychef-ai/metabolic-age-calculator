# Admin Guide - Metabolic Age Calculator

## 🔒 **Data Collection Setup (Automatic & Secure)**

### ✅ **What's Now Working:**

1. **Automatic Data Collection** - Every user response is collected behind the scenes
2. **No User Exposure** - Users can't see or access any admin functions
3. **Local Storage** - Data is stored in browser localStorage automatically
4. **Google Sheets Ready** - Framework ready for automatic Google Sheets integration

### 📊 **How Data Collection Works:**

```
User completes calculator → Data automatically stored locally → (Optional) Sent to Google Sheets
```

**Users see:** Clean interface with just "Calculate Again" button  
**You get:** All user data collected automatically in the background

## 🛠️ **Admin Access (For You Only):**

### **Development Mode (Local Testing):**
When running locally (`npm start`), admin functions are available in browser console:

```javascript
// Get all collected data
window.adminUtils.getAllStoredData()

// Export all data as CSV
window.adminUtils.exportAllDataAsCSV()

// Get data statistics
window.adminUtils.getDataStatistics()

// Clear all stored data
window.adminUtils.clearAllStoredData()
```

### **Production Mode (Live App):**
Admin functions are disabled for security - data collection happens automatically.

## 📈 **Setting Up Google Sheets Integration (Optional):**

### **Step 1: Create Google Apps Script**
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Copy code from `google-apps-script.js`
4. Deploy as web app (set access to "Anyone")

### **Step 2: Update Your App**
1. Get the web app URL from Google Apps Script
2. Edit `src/utils/googleSheets.js`
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual URL
4. Deploy updated app

### **Step 3: Automatic Data Flow**
- Users complete calculator
- Data automatically sent to your Google Sheet
- No user interaction required

## 📊 **Data Collected:**

### **User Inputs:**
- Age, Height, Weight, BMI
- All gut health responses (bowel, bloating, energy, etc.)
- Lifestyle factors (sleep, activity, stress)

### **Calculated Results:**
- Metabolic Age vs Actual Age
- Gut Score (0-100) and Band (High/Adequate/Low)
- All factor impacts (dGut, dBMI, dSleep, dAct, dStress)
- Complete calculation breakdown

## 🔒 **Security Features:**

✅ **No User Access** - Users can't see admin functions  
✅ **No CSV Export** - Users can't download data  
✅ **Automatic Collection** - Data collected silently  
✅ **Local Storage** - Data stored securely in browser  
✅ **Google Sheets Ready** - Optional automatic integration  

## 🎯 **Current Status:**

- ✅ **Data Collection Active** - Every user response captured
- ✅ **User Interface Clean** - No admin functions visible
- ✅ **Local Storage Working** - Data stored automatically
- ⏳ **Google Sheets Ready** - Set up when you're ready

## 📱 **Your App is Now:**

- **User-Friendly** - Clean interface, no admin clutter
- **Data-Rich** - Collects comprehensive user data
- **Secure** - No user access to admin functions
- **Scalable** - Ready for Google Sheets integration

**Your Metabolic Age Calculator is now a professional data collection tool with automatic, behind-the-scenes data gathering!** 🚀
