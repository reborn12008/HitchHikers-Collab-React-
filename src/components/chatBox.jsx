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
    
  render() {
    return (
    <>
    <Switch>
        <Route exact path="/chat" component={ChatPage}/>
    </Switch> 
    
    <div className="float-right btn-group dropup" style={this.state.style}>
        <button className="btn btn-secondary drpdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Conversas de Grupo
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
        This is chat {this.state.chatName}
        </>
        );
    }
}

export default ChatBox;