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
import ls from 'local-storage'
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Axios from 'axios';
import auth from './auth';


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
    var accessTokenData = "bearer "
    accessTokenData = accessTokenData.concat(accessToken)
    

    /*
    const authAxios = axios.create({baseURL: 'http://localhost:9000/auth/authenticatetoken'})

    function createAxiosResponseInterceptor() {
    const interceptor = authAxios.interceptors.response.use(response => response, err => {
      if(err.response.status!==401) {
        return Promise.reject(err);
      }
      authAxios.interceptors.response.eject(interceptor);

      return axios.post('http://localhost:9000/auth/accesstokenrenewal', {withCredentials: true, headers: {
        'Access-Control-Allow-Origin': 'http://localhost:9000',
        'Access-Control-Allow-Credentials': true
      }}).then((response) => {

        ls.set('accessToken', response.data.accessToken);
        
        console.log(response);
      }).catch((err) => {console.log('err')}).finally(createAxiosResponseInterceptor); ;

      

      })
    }
    **/
    auth.createAxiosResponseInterceptor();
    auth.authAxios.post('/auth/authenticatetoken', null, {headers: {'authorization': accessTokenData }}).then((response, err) => {
      console.log(response);
     
      if(response.status===200) {
       this.login();
       console.log("Access token successfully renewed")

     }
      

    }).catch((err)=> {console.log("Access Denied")});

    
    auth.authAxios.interceptors.response.eject();

  

    
    // Post request to auth server, only call if current access token is expired 
    /** 
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
    var accessToken = ls.get("accessToken");
    var accessTokenData = "bearer "
    accessTokenData = accessTokenData.concat(accessToken)
    

    auth.authAxios.post('/auth/voidrefreshtoken', null, {withCredentials: true, headers: {
    'authorization': accessTokenData, 
    'Access-Control-Allow-Origin': 'http://localhost:9000',
    'Access-Control-Allow-Credentials': true }}).then((response, err) => {
      console.log(response);
     
      if(response.status===200) {
       ls.remove("accessToken");
       this.setState({isAuthenticated: false})
       console.log("refresh token successful delisted")

     }
      
    }).catch((err)=> {console.log("Access Denied")});

    
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
