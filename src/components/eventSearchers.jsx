import React from "react";
import axios from "axios";
import { BrowserRouter as Switch, Route} from "react-router-dom";


var categories = {
  "concerts" : "Concertos",
  "conferences" : "Conferências",
  "comunity" : "Comunidade",
  "sports" : "Desporto",
  "perfoming-arts" : "Espetáculos",
  "expos" : "Exposições",
  "festivals" : "Festivais"
}


class SearchPageContent extends React.Component{
  render() {
    return (
      <div className="container">
				<a className="btn btn-primary" style={{ marginRight:"10px" }} href="/festivals/categorySearch" > Pesquisar por categoria </a>
				<a className="btn btn-primary" href="/festivals/textSearch"> Pesquisar por palavras-chave </a>
				<Switch>
          <Route path="/festivals/categorySearch" component={CategorySearch}/>
          <Route path="/festivals/textSearch" component={TextSearch}/>
        </Switch>        
				<br/><br/>
      </div>
  );
  }
}

class CategorySearch extends React.Component{

	constructor(props) { 
		super(props);
		this.state = { textkeysearch : "" , countries : [] };
	}

	searchtextEventHandler = (event) =>{
		this.setState({ textkeysearch : event.target.value});
}

  componentDidMount(){
    axios.get("https://restcountries.eu/rest/v2/all?fields=name;").then( res => { const countries = res.data; this.setState({ countries });
     })
  }
  render() {
    return (
      <div className="pt-5">
			
			  <label for="startDate" className="col-sm-10 col-form-label col-form-label-lg">Procurar eventos entre</label><br/>
				<div className="ml-4">
					<input type="date" id="startDate"/>
					<label className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>e</label>
					<input type="date" id="endDate"/> <br/>
				</div>

			  <label for="type-select" className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>Selecione um género:</label>
			  <select class="custom-select custom-select-lg mb-3 ml-4" id="type-select">
			    <option value="select">...</option>
			    { Object.keys(categories).map((key, index) =>( <option value={key}> {categories[key]} </option>))}
			  </select><br/>

			  <label for="country-select" className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>Selecione o país onde decorrerá o evento</label>
			  <select class="custom-select custom-select-lg mb-3 ml-4" id="country-select">
			    <option value="select">...</option>
		            { this.state.countries.map(countries => <option>{countries.name}</option>)}
		            
			  </select>
			  <button class ="btn btn-info ml-4 mt-3" id="textSearch">Procurar</button>
      </div>
    );
  }
}

class TextSearch extends React.Component{
	constructor(props) { 
		super(props);
		this.state = { textkeysearch : "" };
	}

	searchtextEventHandler=(event) =>{
		this.setState({ textkeysearch : event.target.value});
}

  render() {
    return (
      <div className="mt-3">
				<br/><br/>
		    <input id="text-search" type="text" onChange={this.searchtextEventHandler} />
				<a class ="btn btn-info ml-3" id="textSearch" href={"/festivals/textSearch/search=?" + this.state.textkeysearch} >Procurar</a><br/>
				<span>*Insira uma palavra-chave - pode ser o nomde do evento, o sítio onde irá decorrer, entre outros...</span>
      </div>
    );
  }
}



export default SearchPageContent


