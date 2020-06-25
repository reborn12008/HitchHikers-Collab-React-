import React from "react";
import "../styles.scss";


class Header extends React.Component{
  constructor(props){
		super(props);

		this.state = {
      name : localStorage.getItem("firstname"),
		};
  }
  
  render() {
    let buttonNavList =( 
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/">Home </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/festivals">Eventos</a>
        </li> 
      </ul> );

    if(localStorage.getItem("logged")==1){
      buttonNavList =( 
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/">Home </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/festivals">Eventos</a>
        </li> 
        <li className="nav-item">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" id ="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Bem vindo, {this.state.name}  
              <img id="user_icon.png" alt="Logged User Icon" src={require("../images/user_icon.png")} width="30px" height="30px"/>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdowwMenuButton">
              <a className="dropdown-item" href="/faq">Meu Perfil</a>
              <a className="dropdown-item" href="/faq">Meus Pedidos</a>
              <a className="dropdown-item" href="/" onClick= { this.handleLogout }>Logout</a>
            </div>
          </div>
        </li>
      </ul>);
      }
    

    return (
    <div className="wrap">
      <nav id="topHeader" className="navbar navbar-expand-lg navbar-light mb-5" style={{ backgroundColor:"#e3f2fd" }}>
	<a className="navbar-brand" href="/">OCUCM  </a>
	<button 
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {buttonNavList}
        </div>
      </nav>
    </div> );
  }


  handleLogout(){
    localStorage.setItem("logged", 0)
  }
}


export default Header;
