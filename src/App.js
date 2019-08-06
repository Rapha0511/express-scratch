import React from 'react';
import logo from './logo.svg';
import './App.css';
import MakeListing from './MakeListing.js';
import Listings from './Listing.js'
import Login from './Login.js';
import ListingDetail from './ListingDetail';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';


class Navbar extends React.Component {
  render(){
    return (
      <div className='Navbar'>
        <Link to='/'>
          <h1>YAD3</h1>
        </Link>
      </div>
    );
  }
};


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
      <Router>
        <div className="App">
          {this.state.token ? (
            null
          ) : (
            <Navbar />
          )}
          <div className = {'toggle-panel '+(this.state.panelOpen? 'reversed' : '')} onClick={this.togglePanel}>
           ⌃
          </div>

          <div className='content'>
            <div style={{height:(this.state.panelOpen ? 70 : 90)+'%'}}>
              <Switch>
                <Route exact path='/listings' render={()=> (
                    <Listings listings={this.state.listings}/>
                  )}/>
                <Route exact path='/listing/:id' component={ListingDetail} />
                <Redirect from='/' to='/listings'/>
              </Switch>
            </div>

            <div style={{height:(this.state.panelOpen ? 30 : 10)+'%'}}>
              { this.state.token?(                          // if true show the the list if not still show login
                <MakeListing triggerReload={this.reload} token={this.state.token}/>
              ):(
                <Login onLogin={this.setToken}/>
              )}
            </div>
          </div>
        </div>
      </Router>
  );
}}

export default App;
