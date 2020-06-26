import React from "react";


class ChatBox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            style : {
                gravity:"left",

            }
        }
    }
  render() {
    return (

    <div className="float-right btn-group dropup" style={this.state.style}>
        <button className="btn btn-secondary drpdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Conversas de Grupo
        </button>
        <div className="dropdown-menu">
            <a className="dropdown-item">Chat 1</a>
            <a className="dropdown-item">Chat 2</a>
            <a className="dropdown-item">Chat 3</a>
            <a className="dropdown-item">Chat 4</a>
        </div>
    </div>);
  }
}

export default ChatBox;