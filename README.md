# Metabolic Age Calculator PWA

A conversational Progressive Web App for calculating metabolic age through an interactive chat interface.

## Features

- 🤖 Conversational chat interface
- 📱 Progressive Web App (PWA) with offline support
- 🧮 Deterministic metabolic age calculation
- 📊 Detailed results with factor breakdown
- 🎨 Modern, responsive UI design
- ⚡ Fast and lightweight

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## How It Works

The app uses a conversational flow to collect user data:

1. **Basic Info**: Age, height, weight
2. **Gut Health**: Bowel regularity, bloating, energy, sensitivities, fermented foods, vegetables, hydration, meal timing
3. **Lifestyle**: Sleep quality, activity level, stress level

The metabolic age is calculated using deterministic formulas based on:
- BMI (Indian cutoffs)
- Gut Score (0-100 scale)
- Sleep quality
- Activity level
- Stress level

## PWA Features

- Service worker for offline functionality
- App manifest for installability
- Responsive design for all devices
- Fast loading and smooth animations

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatMessage.js   # Message bubble component
│   ├── InputContainer.js # Input handling component
│   └── ResultsDisplay.js # Results display component
├── data/
│   └── flowData.js      # Conversation flow configuration
├── utils/
│   └── calculations.js  # Metabolic age calculation logic
├── App.js              # Main app component
├── App.css             # App styles
├── index.js            # App entry point
└── index.css           # Global styles
```

## License

This project is for demonstration purposes.
