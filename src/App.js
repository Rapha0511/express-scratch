import React from 'react';
import logo from './logo.svg';
import './App.css';
import MakeListing from './MakeListing.js';
import Listings from './Listing.js'



class App extends React.Component{

  state={
    listings:[], // will contain all our info from the database (needs the same name as the model)
  }

  componentDidMount(){ // we cannot call it multiple time 
    this.reload()
  }
  
  reload = ()=>fetch('/listing') // fetch request from listing
    .then(response=>response.json()) // response in a json format
    .then(listings => this.setState({listings})) // put the response in the state
  
  render() {

    return (
    <div className="App">
      <Listings listings={this.state.listings}/>
      <MakeListing triggerReload={this.reload}/>

    </div>
  );
}}

export default App;
