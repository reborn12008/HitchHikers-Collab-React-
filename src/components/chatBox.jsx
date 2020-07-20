import React from "react";
import { BrowserRouter as Switch, Route, Link} from "react-router-dom";


class ChatBox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            style : {
                gravity:"left",

            }
        }
    }

    chatIcon={
        widht: "60px",
        height: "50px",
    }
    
    render() {
    return (
    <>
    <div className="float-right btn-group dropup" style={this.state.style}>
        <button className="btn btn-secondary drpdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Conversas de Grupo 
            <img className="ml-1" style={this.chatIcon} src={require("../images/chat_icon.png")} alt="Chat Icon"/>
        </button>
        <div className="dropdown-menu">
            <Link className="dropdown-item" to={{ pathname: "/chat", state:{chatName:"MISTER AMERICA"} }}>
				MISTER AMERICA
			</Link>
            <Link className="dropdown-item" to={{ pathname: "/chat", state:{chatName:"Guns n'Roses"} }}>
				Guns n'Roses
			</Link>
        </div>
    </div>
    </>
    );
    }
}

export default ChatBox;