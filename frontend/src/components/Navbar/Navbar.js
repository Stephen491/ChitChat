import React from 'react';
import {menuItems} from "./Menuitems"
import { Link } from "react-router-dom";
import './Navbar.css'
import auth from '../../auth.js';

class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            clicked: false,
            authenticated: false,
        }//end state
        this.logout = this.logout.bind(this);
    }
    


    handleClick = () => {
        console.log(auth.isAuthenticated());
        this.setState({clicked: !this.state.clicked})
        
    }

    login() {
        this.setState({authenticated: true})
    }
    logout() {
        console.log("called");
        this.props.onLogout();
    }


    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">ChitChat<i className="fab fa-react"></i></h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times': 'fas fa-bars'}></i>
                </div>
                <ul className = {this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {menuItems.map((item, index) => {
                        if(this.props.isAuthenticated&&(item.authRequired==='yes'||item.authRequired==='neutral')) {
                            if(item.title==='Logout') {
                                return(
                                <li>                                  
                                    <button className="menuItem" onClick={this.logout} >Logout</button>
                                
                                </li>
                                );

                            }
                            else {
                             return(
                                <li>
                                        <Link to={item.url}>                                 
                                            <button className="menuItem">{item.title}</button>           
                                        </Link>
                                </li>
                                );
                                
                            }
                        }
                        else if(!this.props.isAuthenticated&&(item.authRequired==='no'||item.authRequired==='neutral')) {
                            return(
                                <li>
                                       <Link to={item.url}>
                                   
                                           <button className="menuItem">{item.title}</button>
                               
                                       </Link>
                                   </li>
                               );
                        }
                    })
                    
                    
                    }
                    
                    
                    

                        
                    
                    



                </ul>
            </nav>
        );//end return

    }//end render


}//end navbar

export default Navbar