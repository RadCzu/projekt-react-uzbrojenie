import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import LeftBanner from './LeftBanner';
import RightBanner from './RightBanner';
import Home from '.Home';

function App() {
  return (
    <Router>
      <div className="App">

        <Navbar />
        <div className="content">
          <LeftBanner />
          <Home />
          <RightBanner />
        </div>
      </div>
    </Router>
  );
}

export default App;