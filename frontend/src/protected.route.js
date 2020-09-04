import React from 'react';
import {Route, Redirect} from 'react-router-dom'
import { render } from '@testing-library/react';
import auth from './auth'



export const ProtectedRoute = ({component: Component, isAuthenticated, ...rest}) => {
    return ( 
        <Route 
        {...rest} 
    
        render={props => { 
             if(isAuthenticated) {
                return <Component {...props}/>
             }
            else{
                console.log("failed");
                return (
                    <Redirect 
                        to= {{
                            pathname: '/',
                            state: {
                                 from: props.location
                            }
                        }}
                        />
                    );
                  }
                }}
              />
            );
        };
    export default ProtectedRoute;


