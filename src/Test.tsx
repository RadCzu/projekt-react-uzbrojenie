import React, { useEffect } from 'react';
import './App.css';

const Test = () => {

  useEffect(() => {
    console.log("test");
  },[]

  );
  return (
    <div className="homepage">
      Test
    </div>
  );
}

export default Test;