import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import LeftBanner from './LeftBanner';
import RightBanner from './RightBanner';
import Home from './Home';
import Test from './Test';
import Article from './Article';
import SearchList from './SearchList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <LeftBanner />
          <Routes>
            <Route path = "/" element = {<Home/>}/>
            <Route path = "/home" element = {<Home/>}/>
            <Route path = "/test" element = {<Test/>}/>
            <Route path = "/article/:id" element = {<Article/>}/>
            <Route path = "/search/:word" element = {<SearchList/>}/>
          </Routes>
          <RightBanner />
        </div>
      </div>
    </Router>
  );
}

export default App;