import React from 'react';
import logo from './logo.svg';
import './App.css';
import MakeListing from './MakeListing.js';
import Listings from './Listing.js'



class App extends React.Component{

    
  
  render() {

    return (
    <div className="App">
      <Listings/>
      <MakeListing/>

    </div>
  );
}}

export default App;
