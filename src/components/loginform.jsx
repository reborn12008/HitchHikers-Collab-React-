import React from "react";
import users from "../localData/users.json"


class LoginForm extends React.Component{
  constructor(props){
		super(props);

		this.state = {
      correctEmail : localStorage.getItem("email"),
      correctPassword : localStorage.getItem("password"),
			email: "",
      password: "",
		};
	}
	handleEmailChange(e){
		this.setState({email: e.target.value});
	}
	handlePasswordChange(e){
		this.setState({password: e.target.value});
  }
  
  render() {
    return (
      <div>
        <h2> Log in </h2>
        <form id="loginform">
          <div className="form-group">
            <input type="text" name="email" placeholder="E-mail" value={this.state.email} onChange={this.handleEmailChange.bind(this)}/><br/><br/>
            <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} />
          </div>
          <div className ="row">
            <div className="col-md-2">
              <button name="login_button" className="btn btn-primary" onClick={this.handleLogin.bind(this)}>Entrar</button><br/>
            </div>
            <div className="col-md-5">
              <a href="/faq" className="ml-6" style={{ fontSize:"14px" }}> Não consegue entrar? </a>
              <a href="/register" className="ml-1" style={{ fontSize:"14px" }}>Ainda não tem conta?</a>
            </div>
          </div>
        </form>
      </div>
  );
  }

  handleLogin(e){
    if(this.state.email === this.state.correctEmail && this.state.password === this.state.correctPassword){
      localStorage.setItem("logged", 1);
    }else{
      users.registered_users.map((data) => {
          if(this.state.email === data.email && this.state.password === data.password){
            localStorage.setItem("logged", 1);
            localStorage.setItem("firstname", data.name);
          }
        }
      )};
    }
  }



export default LoginForm;
