// src/App.js
import './App.css';
import Experience from './components/Experience';
import Introduction from './components/Introduction';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="flex bg-white dark:bg-gray-900">
      <div className="w-4/4">
        
        <Introduction></Introduction>
        <Experience></Experience>
        <Projects></Projects>
        <Contact></Contact>
      </div>
      {/* <div className="w-1/4">
        <ChatBot></ChatBot>
      </div> */}
    </div>
  );
}

export default App;
