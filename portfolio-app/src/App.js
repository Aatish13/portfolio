// src/App.js
import './App.css';
import Experience from './components/Experience';
import Introduction from './components/Introduction';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatBot from './components/chat_components/ChatBot';
import Skills from './components/Skills';

function App() {
  return (
    <div className="flex bg-white dark:bg-gray-900">
      <div className="w-3/3">
        
        <Introduction></Introduction>
        <Skills></Skills>
        <Experience></Experience>
        <Projects></Projects>
        <Contact></Contact>
      </div>
    </div>
  );
}

export default App;
