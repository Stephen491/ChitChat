import React from 'react';
import './LoginForm.css';
import axios from 'axios';
import auth from '../auth.js';
import ls from 'local-storage'


class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      email: '',
      password: '',
      loggedIn: false,
    }
    this.props = {
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event){
      event.preventDefault();
      let email = this.state.email;
      let password = this.state.password;

      let loginData = {
        email: email,
        password: password,
      }
      axios.post(
        'http://localhost:9000/auth/login', loginData, {withCredentials: true}
      ).then((response) => {




        console.log(response.data.accessToken);
        if(response.data.accessToken) {
          auth.login(response.data.accessToken);
          
          console.log("From loginform");
          console.log(ls.get('accessToken'));
         //need to propogate login to app
          this.props.onLogin();
        }
        else if(response.data.notFound) {
          console.log("user not found for that email");
        }
        else if(response.data.wrongPassword) {
          console.log("Incorrect password");
        }


      })
      
      event.preventDefault();
   }//end handlesubmit

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }



  render(){
      return(
          <div className="login-container">
            <form className="login" onSubmit={this.handleSubmit}>
                <h1 className="title">Login</h1>
                 <h3 className = "form-text">Email Address</h3>
                 <input 
                 className="text-input"
                  type="email"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  required
                  ></input>
                 <h3 className = "form-text">Password</h3>
                 <input 
                 className="text-input"
                  type="password" 
                  name="password" 
                  onChange={this.handleChange} 
                  value={this.state.password}
                  required>
                 </input>
                 <button className= "submit-button" type="submit" >Submit</button>
            </form>
          </div>
      );
  }
}
export default LoginForm;