# Google Sheets Integration Setup

## 🚀 **Your App is Now Updated with Accurate Calculations!**

### ✅ **What's Been Updated:**

1. **Accurate PRD Calculations** - All formulas now match your comprehensive PRD exactly
2. **Correct Gut Score Weights** - Fiber (20pts), Bowel/Bloating/Fermented (15pts each), etc.
3. **Proper BMI Categories** - Underweight, Healthy, Overweight, Obesity I, Obesity II+
4. **Exact Factor Deltas** - All impact values match PRD specifications
5. **Data Collection** - Automatic local storage + CSV export functionality

### 📊 **Data Collection Features:**

- **Automatic Storage** - Every user response is stored locally
- **CSV Export** - Download all collected data as CSV
- **Google Sheets Ready** - Framework for direct Google Sheets integration

## 🔧 **Setting Up Google Sheets Integration:**

### **Step 1: Create Google Apps Script**

1. Go to [script.google.com](https://script.google.com)
2. Click **"New Project"**
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project (Ctrl+S)

### **Step 2: Deploy as Web App**

1. Click **"Deploy"** → **"New Deployment"**
2. Choose **"Web app"** as the type
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **"Deploy"**
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...`)

### **Step 3: Update Your App**

1. Open `src/utils/googleSheets.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual Web App URL
3. The app will now automatically send data to Google Sheets!

### **Step 4: Test the Integration**

1. Complete a full metabolic age calculation
2. Check your Google Sheet - data should appear automatically
3. Use the "Export Data (CSV)" button to download local data

## 📈 **What Data Gets Collected:**

### **User Inputs:**
- Age, Height, Weight, BMI
- All gut health responses (bowel, bloating, energy, etc.)
- Lifestyle factors (sleep, activity, stress)

### **Calculated Results:**
- Metabolic Age vs Actual Age
- Gut Score (0-100) and Band (High/Adequate/Low)
- All factor impacts (dGut, dBMI, dSleep, dAct, dStress)
- Complete calculation breakdown

## 🎯 **Your App Now Has:**

✅ **PRD-Accurate Calculations** - Matches your specifications exactly  
✅ **Data Collection** - Every user response is captured  
✅ **CSV Export** - Download data for analysis  
✅ **Google Sheets Ready** - Direct integration when you set it up  
✅ **Test Cases Validated** - Calculations match golden test cases  

## 🚀 **Ready for User Testing!**

Your Metabolic Age Calculator now:
- Uses the **exact calculation formulas** from your PRD
- **Collects all user data** automatically
- **Exports data** for analysis
- **Integrates with Google Sheets** when you set it up

**The app is live and ready for real user testing with accurate calculations!** 🎯
