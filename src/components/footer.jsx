import React from "react";


class Footer extends React.Component{
  render() {
    return (
    <div style={{ marginTop:"50px" }}>
      <div className="container">
        <div className="row">
          <div className="col-xs-4 col-md-4">
            <a href="/mensagem">Reportar Erro</a>
          </div>
          <div className="col-xs-4 col-md-4">
            <a href="/contacts">Contactos</a>
          </div>
	  <div className="col-xs-4 col-md-4">
            <a href="/faq">Dúvidas Frequentes</a>
          </div>
        </div>
      </div>
    </div>);
  }
}

export default Footer;
