import React, { useState, useEffect } from 'react';
import './App.css';
import Experience from './components/Experience';
import Introduction from './components/Introduction';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Skills from './components/Skills';
import ResumeString from './assets/resume';
import FloatingChat from './components/FloatingChat';
import CursorFollower from './components/CursorFollower';
import { chatService } from './services/ChatService';

export const Context = React.createContext();
export const InteractionContext = React.createContext();

function App() {
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [followerMessage, setFollowerMessage] = useState('');
  const [expression, setExpression] = useState('neutral');

  useEffect(() => {
    // Automatically preload and cache in-browser AI model on website load
    chatService.preload();

    setMessages([
      {
        "role": "system",
        "content": ResumeString
      }
    ]);
  }, []);

  const handleInteraction = (message, type = 'follower', expr = 'neutral') => {
    if (type === 'follower') {
      setFollowerMessage(message);
      setExpression(expr);
      // Clear message after a few seconds
      setTimeout(() => {
        setFollowerMessage('');
        setExpression('neutral');
      }, 3000);
    } else if (type === 'context') {
      // Add hidden system message for AI context
      // Check if message already exists to avoid duplicates
      setMessages(prev => {
        const exists = prev.some(m => m.content === message);
        if (exists) return prev;
        return [...prev, { role: "system", content: message }];
      });
    } else if (type === 'expression') {
      setExpression(expr);
    }
  };

  return (
    <Context.Provider value={[messages, setMessages]}>
      <InteractionContext.Provider value={handleInteraction}>
        <div className="bg-white dark:bg-gray-900 min-h-screen"> {/* Removed cursor-none */}
          <div className="w-full">
            <Introduction />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
          </div>

          <FloatingChat
            messages={messages}
            setMessages={setMessages}
            isOpen={chatOpen}
            setIsOpen={setChatOpen}
          />
          <CursorFollower message={followerMessage} expression={expression} />
        </div>
      </InteractionContext.Provider>
    </Context.Provider>
  );
}

export default App;
