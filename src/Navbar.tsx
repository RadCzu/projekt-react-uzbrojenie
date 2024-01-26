import { Link } from "react-router-dom";
import './App.css';

const Navbar = () => {
  return (  
    <nav className="navbar">
      <h1>
        <label>Oręż Średniowiecza</label>
      </h1>
      <div className="search-bar">   
        <Link to="/home"> 
          <button className="search-button">
            <img className="home-icon" src="images/castle.png" />
          </button>
        </Link>

        <input id="search-input" type="text" placeholder="Wyszukaj" />
        <button className="search-button enter-search">
          <img className="search-icon" src="images/search-icon.png"/>
        </button>

        <button className="add-review add-weapon">
          Dodaj Oręż
        </button>
      </div>
    </nav>
  );
}

export default Navbar;