import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RegistrationForm from './Pages/RegistrationForm'
import LoginForm from './Pages/LoginForm'
import LobbyPage from './Pages/LobbyPage'
import ProtectedRoute from './protected.route'
import Navbar from './components/Navbar/Navbar';
import auth from './auth'




const Routes = () => {
    return(
        <div>
        
        <Switch>
            <Route path="/" exact render={(props) => <LoginForm {...props}  />}/> 
            <Route exact path="/RegistrationForm" component={RegistrationForm} ></Route>
            <ProtectedRoute exact path = "/Lobby" component={LobbyPage} />
        </Switch>
        </div>
    )
}

export default Routes; 