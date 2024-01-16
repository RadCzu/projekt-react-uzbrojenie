import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          {/* Treść strony, np. komponenty Route itp. */}
        </div>
      </div>
    </Router>
  );
}

export default App;