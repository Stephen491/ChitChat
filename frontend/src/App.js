import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import Routes from './Routes.js';
import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './Pages/RegistrationForm'
import LoginForm from './Pages/LoginForm'
import LobbyPage from './Pages/LobbyPage'
import ProtectedRoute from './protected.route'
import { Cookies } from 'react-cookie'
import ls from 'local-storage'
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    }; 
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    axios.defaults.withCredentials = true;
  }

  componentDidMount(){
    console.log(ls.get("accessToken"));
    var accessToken = ls.get("accessToken");
    var accessTokenData = {
      "bearer": accessToken,
    } 
    //TO DO: verify accessToken. If valid, call login method, else continue as non-logged in 
    //If accessToken is expired, make a renewal request using current refresh token
    axios.post('http://localhost:9000/auth/authenticatetoken', accessTokenData).then(
      (response) => {
        console.log(response);
    })

    
    // Post request to auth server, only call if current access token is expired 
    axios.post('http://localhost:9000/auth/accesstokenrenewal', {withCredentials: true, headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000',
      'Access-Control-Allow-Credentials': true
    }}).then((response) => {
      console.log(response);
    }).catch((err) => {console.log('err')}) ;
    

    //testing code; removing later 
    /** 
    axios.get('http://localhost:9000/main/',{withCredentials: true, headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000',
      'Access-Control-Allow-Credentials': true
    }}).then((response) => {
      console.log(response);
    }).catch((err) => {console.log('err')}) ;
    */
    

  } 

  logout() {
    console.log("logout called")
    ls.remove("accessToken");
    this.setState({isAuthenticated: false})
    //TO DO: Make a call to void refresh tokens db to void current refresh token
  }

  login() {
    this.setState({isAuthenticated: true});
    
  }

  render() {
   return(
     <div className="app">
        <Navbar onLogout={this.logout} isAuthenticated={this.state.isAuthenticated}/>
        <Switch>
            <Route path="/" exact render={(props) => <LoginForm {...props} onLogin={this.login} />}/> 
            <Route exact path="/RegistrationForm" component={RegistrationForm} ></Route>
            <ProtectedRoute exact path = "/Lobby" isAuthenticated = {this.state.isAuthenticated} component={LobbyPage} />
        </Switch>
     </div>
  
  
  
      );
  }
}

export default App;
