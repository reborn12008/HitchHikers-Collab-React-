import React from "react";
import { BrowserRouter as Switch, Route, withRouter } from "react-router-dom";
import './App.css';
import Header from "./components/header";
import Footer from "./components/footer";
import LoginForm from "./components/loginform";
import MessageForm from "./components/messageForm";
import RegistForm from "./components/registForm";
import SearchPageContent from "./components/eventSearchers";
import ChatBox from "./components/chatBox";

class App extends React.Component{
  render(){
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} state=""/>
          <Route path="/mensagem" component={MsgForm}/>
          <Route path="/contacts" component={Contacts}/>
          <Route path="/faq" component={FAQ}/>
          <Route path="/register" component={RegistPage}/>
          <Route path="/festivals" component={EventSearchPage}/>
          <Route path="/chat" component={ChatPage}/>
        </Switch>
      </div>
    );
  }
}

class HomePage extends React.Component{
  render(){
    var info = (<p id="intro-text-4">
                    <a id="regist_text" href="/register">Cria já a tua conta </a> e junta-te a quem partilha dos teus gostos!<br/>
    'Juntos Vamos' é a plataforma que te permite juntar com várias pessoas para atenderem a uma variedade enorme de eventos!<br/></p>);

    let loginForm=<LoginForm />
    if(localStorage.getItem("logged")==1){
      info = (<p id="intro-text-4">
                <a id="regist_text" href="/festivals">Procura o teu evento</a> e junta-te a quem partilha dos teus gostos!<br/>
              </p>);
      loginForm = <ChatBox />
    }
    return (
      <div>
        <Header />
        <div className="container">

          <div className="row"> <div className="col-md-12">
              <p id="intro-text-1">O teu artista favorito finalmente vem atuar naquele festival que tu sempre quiseste ir desde que te lembras?</p>
          </div></div>

          <div className="row"> <div className="col-md-12">
              <p id="intro-text-2">Os teus amigos não te querem acompanhar?<br/>A viagem sai muito cara só para ti?</p>
          </div></div>

	  <div className="row"> <div className="col-md-12">
              <p id="intro-text-3">Temos a solução para o teu problema!</p>
          </div></div>

	  <div className="row"> <div className="col-md-12">
                {info}
          </div></div>
          <br/><br/>
          {loginForm}
        </div>
        <Footer />
      </div>
    );
  }
}

class Contacts extends React.Component{
  render(){
    return (
      <div>
        <Header />
	      <p> 93482484829</p>
        <Footer />
      </div>
    );
  }
}

class MsgForm extends React.Component{
  render(){
    return (
      <div>
        <Header />
	<MessageForm/>
        <Footer />
      </div>
    );
  }
}

class FAQ extends React.Component{
  render(){
    return (
      <div>
        <Header />
	<div className="container">
	   <p> FAQ </p>
	</div>
        <Footer />
      </div>
    );
  }
}

class RegistPage extends React.Component{
  render(){
    return (
      <div>
        <Header />
	      <RegistForm />
        <Footer />
      </div>
    );
  }
}

class EventSearchPage extends React.Component{
  render(){
    return (
      <div>
        <Header />
	<div className="container">
		<SearchPageContent />
	</div>
        <Footer />
      </div>
    );
  }
}

class ChatPage extends React.Component{
  constructor(props){
      super(props);

      this.state={
          chatName : this.props.location.state.chatName,
      }
  }

  render(){
      return(
      <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div id="chatRooms" className="card">
              <div className="card-header">
                {this.state.chatName}
              </div>
              <ul className="list-group list-group-flush">
                <li class="list-group-item">CHAT1</li>
                <li class="list-group-item">CHAT2</li>
                <li class="list-group-item">CHAT3</li>
              </ul>
            </div>
          </div>
          <div className="col-sm-8">
            <div id="chatWindow" className="card" style={{height:"100%"}}>
              BLALBLABLALBAL
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-4">
            
          </div>
          <div className="col-sm-8">
            <div className="card">
              <div classBane="row">
                <textarea id="inputMessage" rows="3" style={{resize:"none"}}/>
                <button className="btn btn-info mg-2">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </>
      );
  }
}

export default App;
