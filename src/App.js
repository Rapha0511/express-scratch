import React from 'react';
import './App.css';
import MakeListing from './MakeListing.js';
import Listings from './Listing.js'
import Login from './Login.js';
import ListingDetail from './ListingDetail';
import {subscribe} from './Cart';
import ShoppingCartIcon from './ShoppingCartIcon';
import Checkout from './checkout'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';


class Navbar extends React.Component {
  
  state ={
    shoppingCartLength:0,
    token:null,
  }

  componentDidMount(){

    subscribe('items', items=> // items => is the callback
    this.setState({shoppingCartLength : items.length})); // function call every time u add something on the cart
  }

  render(){
    return (
      <div className='Navbar'>
        <Link to='/'>
          <h1>YAD3</h1>
        </Link>
        <Link to='/checkout'>
        <ShoppingCartIcon className='ShoppingCartIcon' number ={this.state.shoppingCartLength}/>
        </Link>
      </div>
    );
  }
};

class AdminPage extends React.Component{
  render(){
    return(
      <div className='AdminPage'>

          nique ta pute de mere

      </div>
    );
  }
}


class App extends React.Component{

  state={
    listings:[], // will contain all our info from the database (needs the same name as the model)
    token : null, // not logged in so the token is null
    isAdmin:false,
    shoppingCartLength: 0
  }

  componentDidMount(){ // we cannot call it multiple time
    this.reload()

    subscribe('items', items=>
    this.setState({shoppingCartLength : items.length}));

  }

  reload = ()=>fetch('/listing') // fetch request from listing
    .then(response=>response.json()) // response in a json format
    .then(listings => this.setState({listings})) // put the response in the state


    setToken = (token) => this.setState({token},()=>{  // set the token and see if admin or not
      fetch ('/chekAdmin',{
        headers:{Authorization : 'Bearer ' +token}
      })
      .then(({status})=>{
        this.setState({isAdmin:status === 200})
      })
    })

    togglePanel = () =>this.setState({panelOpen: !this.state.panelOpen})


  render() {


    // Router is the Component who connects to the url of the page
    //   he tells the browser that the browser should not make a new request
    //                 for a new file
    //   instead, the Router will handle the request for a new url
    return (

      <Router>
        <div className="App">
          {this.state.token ? (
            null
          ) : (
            <Navbar/>
          )}
          {this.state.isAdmin ? (
          <div className='Admin-link'>
            <Navbar/>
            <Link to ='/admin'>admin</Link>
            <Link to = '/'>HOME</Link>
          </div>
          ) : null}

          <div className = {'toggle-panel '+(this.state.panelOpen? 'reversed' : '')} onClick={this.togglePanel}>
           ⌃
          </div>

          <div className='content'>
            <div style={{height:(this.state.panelOpen ? 70 : 90)+'%'}}>
              {/*
                Switch: the Switch has <Route/>s as children, and will choose always
                        ONE of the Routes to render

                Route: exact means only match the path exactly
                       path is the path in the url that has to match to render this Route

                Route (component): when this Route is matched, render this Component
                Route (render): render is a function which returns a JSX
                                it allows us to pass data to a prop on the Component we're rendering
                Redirect: when we didn't match any Component, redirect to /listings page
                */}
              <Switch>
                <Route exact path='/listings' render={()=> (
                    <Listings listings={this.state.listings}/>
                  )}/>
                <Route exact path='/listing/:id' component={ListingDetail} />
                <Route exact path='/checkout' render={()=>(
                    <Checkout token={this.state.token}/>
                )}/>

                {this.state.isAdmin ?(
                  <Route exact path='/admin' component ={AdminPage}/>
                ):null}

                <Redirect from='/' to='/listings'/>
              </Switch>
            </div>

            <div style={{height:(this.state.panelOpen ? 30 : 10)+'%'}}>
              { this.state.token?(    // if true show the the list if not still show login
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
