import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import InputContainer from './components/InputContainer';
import ResultsDisplay from './components/ResultsDisplay';
import { flowData } from './data/flowData';
import { calculateMetabolicAge } from './utils/calculations';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('intro');
  const [userData, setUserData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start the conversation
    const introStep = flowData.flow.find(step => step.id === 'intro');
    if (introStep) {
      const randomPrompt = introStep.prompts[Math.floor(Math.random() * introStep.prompts.length)];
      addSystemMessage(randomPrompt, introStep);
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

    // Add acknowledgement if available
    if (step.ack && step.ack.length > 0) {
      setTimeout(() => {
        const randomAck = step.ack[Math.floor(Math.random() * step.ack.length)];
        addSystemMessage(randomAck);
      }, 500);
    }

    // Handle next step
    setTimeout(() => {
      if (step.next === 'END') {
        // Calculate results
        const metabolicAgeResults = calculateMetabolicAge(userData);
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
