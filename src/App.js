import React from 'react';
import logo from './logo.svg';
import './App.css';
import MakeListing from './MakeListing.js';
import Listings from './Listing.js'
import Login from './Login.js';



class App extends React.Component{

  state={
    listings:[], // will contain all our info from the database (needs the same name as the model)
    token : null, // not logged in so the token is null 
  }

  componentDidMount(){ // we cannot call it multiple time 
    this.reload()
  }
  
  reload = ()=>fetch('/listing') // fetch request from listing
    .then(response=>response.json()) // response in a json format
    .then(listings => this.setState({listings})) // put the response in the state


    setToken = (token) => this.setState({token})

    togglePanel = () =>this.setState({panelOpen: !this.state.panelOpen})

  
  render() {

    return (
    <div className="App">
      <div className = {'toggle-panel '+(this.state.panelOpen? 'reversed' : '')} onClick={this.togglePanel}>
       ⌃
      </div>

      <div style={{height:(this.state.panelOpen ? 68 : 88)+'vh'}}>
      <Listings listings={this.state.listings}/>
      </div>

        <div style={{height:(this.state.panelOpen ? 30 : 10)+'vh'}}>
      { this.state.token?(                          // if true show the the list if not still show login 
      <MakeListing triggerReload={this.reload} token={this.state.token}/>
      ):( <Login onLogin={this.setToken}/>
      )}
      </div>
    </div>
  );
}}

export default App;
