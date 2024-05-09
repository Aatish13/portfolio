// src/App.js
import './App.css';
import Experience from './components/Experience';
import Introduction from './components/Introduction';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="app-bg parallax" >
      <Introduction></Introduction>
      <Experience></Experience>
      <Projects></Projects>
      <Contact></Contact>
    </div>
  );
}

export default App;
