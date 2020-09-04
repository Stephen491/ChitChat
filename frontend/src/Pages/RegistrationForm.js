
import React from 'react';
import { Router, Route, Link, Switch } from 'react-router'
import '../App.css';
import './RegistrationForm.css'
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class RegistrationForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        passwordsMismatch: false,
        passwordWeak: false,
        usernameTaken: false,
        emailTaken: false,
        invalidEmail: false,
        invalidUsername: false,
        tooYoung: false,
        email: 'dummy@dummy.com',
        username: 'dummy',
        password: '',
        passwordConfirmation: '',
        dob: new Date(),
      }
      this.props = {
        errorMessagePasswordMismatch: '<h3 className="ErrorMessage">The passwords entered do not match</h3>',
        errorMessagePasswordWeak: '<h3 className="ErrorMessage">The password entered is too weak: Your password must contain a special character, capital letter, lowercase letter, a number, and must be at least 8 characters long</h3>',
        errorMessageUsernameTaken: '<h3 className="ErrorMessage">The username has already been taken</h3>',
        errorMessageEmailTaken: '<h3 className="ErrorMessage">The email has already been taken</h3>',
        errorMessageInvalidEmail: '<h3 className="ErrorMessage">The email is invalid</h3>',
        errorMessageInvalidUsername: '<h3 className="ErrorMessage">The username is invalid</h3>',
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
    }
  
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value,
      })
  
    }

    handleDateChange(date){
      this.setState({
        dob: date,
      });
    }
  
    handleSubmit(event) {
      event.preventDefault();
      let password = this.state.password;
      let passwordConfirmation = this.state.passwordConfirmation;
      let username = this.state.username;
      let dob = this.state.dob;
      let submitHasError = false; 
      console.log("form submitted");


      if(password!==passwordConfirmation) {
        console.log("password mismatch");
        submitHasError = true; 
        this.setState({
          passwordsMismatch: true,
        });
      }

      if(!this.hasNumerical(password)) {
        submitHasError = true;
        this.setState({
          passwordWeak: true,
        })//end set state
        console.log("password has no numerical");
      }//end if

      if(!this.hasUpperCase(password)){
        submitHasError = true;
        this.setState({
          passwordWeak: true,
        })
        console.log("password has no uppercase")
      }
      if(!this.hasLowerCase(password)){
        submitHasError = true;
        this.setState({
          passwordWeak: true,
        })
        console.log("password has no lowercase")
      }
      if(!this.hasSpecial(password)) {
        submitHasError = true;
        this.setState({
          passwordWeak: true,
        })//end set state
        console.log("password has no special");
      }//end if

      if(password.length<8){
        submitHasError = true;
        this.setState({
          passwordWeak: true,
        })
        console.log("password too short");
      }
      if(this.isInvalidUsername(username)) {
          submitHasError = true;
          this.setState({
            invalidUsername: true,
          })
          console.log("invalid username")
      }
      
      if(!this.verifyAge(dob)){
        submitHasError = true;
        
        this.setState({
          tooYoung: true,
        })
        console.log("Registrant is too young");
      }




      if(!submitHasError) {
        const registrationData = {
          email: this.state.email, 
          username: this.state.username, 
          password: this.state.password, 
          dob: this.state.dob,};



        // Attempt to submit form, if email or username is taken, change submitHasError to true and retry
        axios
        .post('http://localhost:9000/register', registrationData)
        .then((response) => {
          console.log(response.data);
          
          if(response.data.hasError){
            console.log(response.data.hasError);
            if(response.data.emailTaken) {
              console.log("email taken");
              this.setState({
                emailTaken: true,
              })
              submitHasError = true;
            }
            if(response.data.usernameTaken){
              console.log("username taken");
              this.setState({
                usernameTaken: true,
              })
              submitHasError = true;
            }
          }
          this.setState({
            hasError: submitHasError,
          })
  
        })
        .catch(err => {
          console.error(err);
        });//end axios       
      }
      else{
        this.setState({
          hasError: true,
        })
      }

      
      
      
      event.preventDefault();
    }
    
    isInvalidUsername(username) {
      let pattern = /[^A_Za-z0-9]/;
      return pattern.test(username);
    }

    hasNumerical(password) {
      let pattern = /[0-9]/;
      return pattern.test(password);
    }
    hasUpperCase(password){
      let pattern = /[A-Z]/;
      return pattern.test(password);
    }
    hasLowerCase(password){
      let pattern = /[a-z]/;
      return pattern.test(password);
    }

    hasSpecial(password){
      let pattern = /[^A-Za-z0-9]/; 
      return pattern.test(password);
    }
    
    verifyAge(date){
      
      var today = new Date();
      var birthdate = date;
      var age = today.getFullYear()-birthdate.getFullYear();
      var mDiff = today.getMonth()-birthdate.getMonth();
      console.log(age);
      if(mDiff<0||(mDiff===0&&today.getDate()<birthdate.getDate())) {
        age--;
      }
      if(age<13){
        return false;
      }
      return true; 
    }

    checkEmailTaken(props) {
  
  
    }
    checkUsernameTaken(props) {
  
    }
  
  
    render() {
      return (
        <div>
          <div className={this.state.hasError? "ErrorContainer": "ErrorContainerHidden"}>
              Registration has error 
          </div>
         <form onSubmit={this.handleSubmit} className="RegistrationContainer">
          <h2>
            Email Address:
           </h2>
          <input 
            type="email" 
            name="email" 
            value={this.state.email} 
            onChange={this.handleChange} 
            required>
          </input>
          <h2>
             Username:
          </h2>
           <input 
            type = "text" 
            name = "username"
            value={this.state.username}
            onChange={this.handleChange}
            required>
            </input>
           <h2>
            Password:
          </h2>
          <input 
          type = "password" 
          name= "password"
          value={this.state.password}
          onChange={this.handleChange}
          required>
          </input>
          <h2>
            Please re-enter Password: 
          </h2>
          <input 
          type = "password" 
          name= "passwordConfirmation"
          value={this.state.passwordConfirmation}
          onChange={this.handleChange}
          required>
          </input>
          <h2>
            Date of birth
          </h2>
          <DatePicker selected={this.state.dob} onChange={this.handleDateChange} />
           <button type = "submit">Submit Registraion</button>
         </form>
        </div>
      );//end return
  
    }//end render()
  
  
  }//end RegistrationForm
  export default RegistrationForm;