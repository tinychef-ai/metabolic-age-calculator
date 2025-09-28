import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import InputContainer from './components/InputContainer';
import ResultsDisplay from './components/ResultsDisplay';
import { flowData } from './data/flowData';
import { calculateMetabolicAge, testCalculations } from './utils/calculations';
import { getSmartAcknowledgement, getMetabolicAgePreview } from './utils/smartAcks';
import { storeDataLocally, sendToGoogleSheets } from './utils/googleSheets';
import { enableAdminFunctions } from './utils/adminUtils';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('intro');
  const [userData, setUserData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [uiState, setUIState] = useState({
    units: {
      height: 'cm',
      weight: 'kg'
    }
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved state from localStorage
    const savedUserData = localStorage.getItem('metabolicAgeUserData');
    const savedUIState = localStorage.getItem('metabolicAgeUIState');
    const savedCurrentStep = localStorage.getItem('metabolicAgeCurrentStep');
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    if (savedUIState) {
      setUIState(JSON.parse(savedUIState));
    }
    if (savedCurrentStep && savedCurrentStep !== 'intro') {
      setCurrentStep(savedCurrentStep);
      // Continue from where we left off
      const step = flowData.flow.find(s => s.id === savedCurrentStep);
      if (step) {
        const randomPrompt = step.prompts[Math.floor(Math.random() * step.prompts.length)];
        addSystemMessage(randomPrompt, step);
      }
    } else {
      // Start the conversation
      const introStep = flowData.flow.find(step => step.id === 'intro');
      if (introStep) {
        const randomPrompt = introStep.prompts[Math.floor(Math.random() * introStep.prompts.length)];
        addSystemMessage(randomPrompt, introStep);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('metabolicAgeUserData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('metabolicAgeUIState', JSON.stringify(uiState));
  }, [uiState]);

  useEffect(() => {
    localStorage.setItem('metabolicAgeCurrentStep', currentStep);
  }, [currentStep]);

  // Enable admin functions for console access (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      enableAdminFunctions();
    }
  }, []);

  const addSystemMessage = (text, step = null) => {
    const newMessage = {
      id: Date.now(),
      type: 'system',
      text,
      step,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text, value = null) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      text,
      value,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserResponse = (value, label, step) => {
    // Add user message
    addUserMessage(label, value);
    
    // Store user data
    if (step.bind && step.bind !== '_intro' && step.bind !== '_reveal') {
      setUserData(prev => ({
        ...prev,
        [step.bind]: value
      }));
    }

    // Add smart acknowledgement
    setTimeout(() => {
      const smartAck = getSmartAcknowledgement(userData, value, step.id);
      addSystemMessage(smartAck);
      
      // Show metabolic age preview mid-flow
      const preview = getMetabolicAgePreview({ ...userData, [step.bind]: value });
      if (preview && Object.keys(userData).length >= 8) {
        setTimeout(() => {
          addSystemMessage(preview);
        }, 1000);
      }
    }, 500);

    // Handle next step
    setTimeout(() => {
      if (step.next === 'END') {
        // Calculate results with updated user data
        const updatedUserData = { ...userData, [step.bind]: value };
        const metabolicAgeResults = calculateMetabolicAge(updatedUserData);
        
        // Store data locally (always)
        storeDataLocally(updatedUserData, metabolicAgeResults);
        
        // Send to Google Sheets automatically (if configured)
        sendToGoogleSheets(updatedUserData, metabolicAgeResults);
        
        setResults(metabolicAgeResults);
        setShowResults(true);
      } else {
        // Move to next step
        const nextStep = flowData.flow.find(s => s.id === step.next);
        if (nextStep) {
          const randomPrompt = nextStep.prompts[Math.floor(Math.random() * nextStep.prompts.length)];
          addSystemMessage(randomPrompt, nextStep);
          setCurrentStep(step.next);
        }
      }
    }, 1000);
  };

  const handleNumberInput = (value, step) => {
    handleUserResponse(value, value.toString(), step);
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentStep('intro');
    setUserData({});
    setShowResults(false);
    setResults(null);
    
    // Clear localStorage
    localStorage.removeItem('metabolicAgeUserData');
    localStorage.removeItem('metabolicAgeCurrentStep');
    
    // Restart conversation
    setTimeout(() => {
      const introStep = flowData.flow.find(step => step.id === 'intro');
      if (introStep) {
        const randomPrompt = introStep.prompts[Math.floor(Math.random() * introStep.prompts.length)];
        addSystemMessage(randomPrompt, introStep);
      }
    }, 100);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Metabolic Age Calculator</h1>
        <p>Discover your metabolic age through a quick chat</p>
      </header>
      
      {!showResults ? (
        <main className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <InputContainer
            currentStep={currentStep}
            onUserResponse={handleUserResponse}
            onNumberInput={handleNumberInput}
            flowData={flowData}
            uiState={uiState}
            onUIStateChange={setUIState}
          />
        </main>
      ) : (
        <ResultsDisplay 
          results={results} 
          onRestart={resetConversation}
        />
      )}
    </div>
  );
}

export default App;
