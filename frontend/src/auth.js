import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ls from 'local-storage'
import Navbar from './components/Navbar/Navbar'

class Auth{
    constructor() {
        this.authenticated = false;
        this.accessToken = null;
    }

    login(accessToken){
        this.accessToken = accessToken;
        ls.set('accessToken', accessToken);
        this.authenticated = true;
       
        
        
    }
    logout(cb){
        this.accessToken = null;
        ls.set('accessToken', null);
        this.authenticated = false;
        
        

    }
    isAuthenticated(){
        return this.authenticated;
        
    }


}

export default new Auth(); 