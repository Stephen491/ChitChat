import React from 'react';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import { Switch, Route} from 'react-router-dom';
import RegistrationForm from './Pages/RegistrationForm'
import LoginForm from './Pages/LoginForm'
import LobbyPage from './Pages/LobbyPage'
import ProtectedRoute from './protected.route'
import ls from 'local-storage'
import axios from 'axios';
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
    

    auth.createAxiosResponseInterceptor();

    //POST request to server to authenticate access token, attempt to renew if expired
    auth.authAxios.post('/auth/authenticatetoken', null, {headers: {'authorization': accessTokenData }}).then((response, err) => {
      console.log(response);
     
      if(response.status===200) {
       this.login();
       console.log("Access token successfully renewed")
       //TO DO: push client to lobby page

     }
      

    }).catch((err)=> {console.log("Access Denied")});
    
    auth.authAxios.interceptors.response.eject();
    
  } 

  logout() {
    var accessToken = ls.get("accessToken");
    var accessTokenData = "bearer "
    accessTokenData = accessTokenData.concat(accessToken)
    
    //POST request to server to void refresh token
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
