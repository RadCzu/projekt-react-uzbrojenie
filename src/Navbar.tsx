import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import { normalizeString } from "./normalizeString";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePath, setImagePath] = useState('/images');
  const navigate = useNavigate();

  const handleSearch = () => {
    //const encodedQuery = encodeURI(searchQuery.trim());
    //console.log(`encoded query search: ${encodedQuery}`);
    if (searchQuery) {
      navigate(`/search/${normalizeString(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  //ścieżka do folderu public musi się dynamicznie aktualizować
  useEffect(() => {
    const foldersAboveRoot = currentPath.split('/').filter(Boolean).length - 1;

    const relativePath = Array.from({ length: foldersAboveRoot }, () => '..').join('/');
    const imagePath = `${relativePath}/images`;

    setImagePath(imagePath);

  }, [currentPath, location.pathname]);

  return (  
    <nav className="navbar">
      <h1>
        <label>Oręż Średniowiecza</label>
      </h1>
      <div className="search-bar">   
        <Link to="/home"> 
          <button className="search-button">
            <img className="home-icon" src={imagePath + "/castle.png"} alt="Home" />
          </button>
        </Link>

        <input
          id="search-input"
          type="text"
          placeholder="Wyszukaj"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className="search-button enter-search" onClick={handleSearch}>
          <img className="search-icon" src={imagePath + "/search-icon.png"} alt="Search" />
        </button>

        <button className="add-review add-weapon">
          Dodaj Oręż
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
