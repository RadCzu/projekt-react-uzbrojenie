import React, { useEffect } from 'react';
import './App.css';
import actions from './server/actions';'./server/actions';

const Home = () => {

  useEffect(() => {
    console.log("page is 'home'");

    let response = "";
    const sql = "SELECT Nazwa, Opis, LinkObrazka, IdBroni FROM bron";
    actions.getData(sql, response);
  },[]

  );
  return (
    <div className="homepage">
    </div>
  );
}

export default Home;