import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import LeftBanner from './LeftBanner';
import RightBanner from './RightBanner';
import Home from './Home';
import Test from './Test';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <LeftBanner />
          <Routes>
            <Route path = "/" element = {<Home/>}/>
          </Routes>
          <Routes>
            <Route path = "/test" element = {<Test/>}/>
          </Routes>
          <RightBanner />
        </div>
      </div>
    </Router>
  );
}

export default App;