import React from "react";
import ReactDOM from "react-dom";


class RegistForm extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
			passwordConfirm: "",
			firstName: "",
			lastName: "",
			phoneNumber: "",
		};
	}
	handleEmailChange(e){
		this.setState({email: e.target.value});
	}
	handlePasswordChange(e){
		this.setState({password: e.target.value});
	}
	handlePasswordConfirmChange(e){
		this.setState({passwordConfirm: e.target.value});
	}
	handleFirstNameChange(e){
		this.setState({firstName: e.target.value});
	}
	handleLastNameChange(e){
		this.setState({lastName: e.target.value});
	}
	handlePhoneNumberChange(e){
		if(e.target.validity.valid){
			this.setState({phoneNumber: e.target.value});
		}
	}

	passwordSpan = {
		fontSize:"14px",
		color:"red"
	}
    render() {
    return (
      <div className="container">
        <h2> Registar </h2>
		<br/>
        <form id="registForm">
            <input type="email" id="email" placeholder="E-mail" required={true} value={this.state.email} onChange={this.handleEmailChange.bind(this)}/>
	    	<br/><br/>
            <input type="text" id="firstname" placeholder="Primeiro Nome" required={true} value={this.state.firstName} onChange={this.handleFirstNameChange.bind(this)}/>
	    	<br/><br/>
	    	<input type="text" id="lastname" placeholder="Último Nome" required={true} value={this.state.lastName} onChange={this.handleLastNameChange.bind(this)}/>
	    	<br/><br/>
	    	<input type="password" id="password1" placeholder="Password" required={true} value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
	    	<br/><br/>
	    	<input type="password" id="password2" placeholder="Repita a Password" required={true} value={this.state.passwordConfirm} onChange={this.handlePasswordConfirmChange.bind(this)}/><span id="passwordNotMatch" style={this.passwordSpan}></span>
	    	<br/><br/>
			<input type="text" pattern ="[0-9]*" id="phonenumber" placeholder="Telemovel" size="9" required={true} value={this.state.phoneNumber} onChange={this.handlePhoneNumberChange.bind(this)}/>
			<br/><br/>
			<button id="registbutton" className="btn btn-success" onClick={this.handleRegister.bind(this)}>Enviar</button>
	  </form>
      </div>
  );
  }

	handleRegister(){
		const {password, passwordConfirm} = this.state;
		if(password !== passwordConfirm){
			ReactDOM.render(" Your passwords do not match", document.getElementById("passwordNotMatch"))
		}else{
			localStorage.setItem("email", this.state.email);
			localStorage.setItem("password", this.state.password);
			localStorage.setItem("firstname", this.state.firstName);
		}
  	}
}


export default RegistForm;
