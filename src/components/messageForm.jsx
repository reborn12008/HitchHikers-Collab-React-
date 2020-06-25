import React from "react";


class MessageForm extends React.Component{
  render() {
    return (
      <div className="container">
        <h2> Envie uma mensagem de erro </h2>
	<br/>
        <form id="messageForm">
            <input type="text" name="subject" placeholder="Assunto"/>
	    <br/>
	    <br/>
            <input type="email" name="email" placeholder="E-mail de contacto"/>
	    <br/>
	    <br/>
	    <textarea rows="4" cols="50" placeholder="Digite aqui a sua mensagem"></textarea>
	    <br/><br/><br/>
	    <button type="submit" className="btn btn-info">Enviar</button>
	  </form>
      </div>
  );
  }
}


export default MessageForm;
