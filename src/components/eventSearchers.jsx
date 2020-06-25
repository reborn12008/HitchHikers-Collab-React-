import React from "react";
import axios from "axios";
import { BrowserRouter as Switch, Route, Link} from "react-router-dom";


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
				<Route exact path="/festivals/categorySearch" component={CategorySearch}/>
				<Route exact path="/festivals/textSearch" component={TextSearch}/>
				<Route path="/festivals/textSearch/search=" component={SearchResults}/>
        	</Switch>        
			<br/><br/>
		</div>
	);
	}
}

class CategorySearch extends React.Component{

	constructor(props) { 
		super(props);
		this.state = { 
			startDate : "",
			endDate : "",
			categorySelected: "",
			countrySelected: "",
			countries : [],
		};
	}

	componentDidMount(){
    	axios.get("https://restcountries.eu/rest/v2/all?fields=name;").then( res => { const countries = res.data; this.setState({ countries });
	})
	}

	handleStartDateChange(e){
		this.setState({startDate : e.target.value});
	}
	handleEndDateChange(e){
		this.setState({endDate : e.target.value});
	}
	handleCategoryChange(e){
		this.setState({categorySelected : e.target.value});	
	}
	handleCountryChange(e){
		this.setState({countrySelected : e.target.value});
	}
	render() {
    return (
		<div className="pt-5">	
			<label htmlFor="startDate" className="col-sm-10 col-form-label col-form-label-lg">Procurar eventos entre</label><br/>
				<div className="ml-4">
					<input type="date" id="startDate" onChange={this.handleStartDateChange.bind(this)}/>
					<label className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>e</label>
					<input type="date" id="endDate" onChange={this.handleEndDateChange.bind(this)}/> <br/>
				</div>

			<label htmlFor="type-select" className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>Selecione um género:</label>
			<select className="custom-select custom-select-lg mb-3 ml-4" id="type-select" onChange={this.handleCategoryChange.bind(this)}>
				<option value="select">...</option>
				{ Object.keys(categories).map((key, index) =>( <option value={key}> {categories[key]} </option>))}
			</select><br/>

			<label htmlFor="country-select" className="col-form-label col-form-label-lg" style={{ margin:"0px 10px" }}>Selecione o país onde decorrerá o evento</label>
			<select className="custom-select custom-select-lg mb-3 ml-4" id="country-select" onChange={this.handleCountryChange.bind(this)}>
				<option value="select">...</option>
				{ this.state.countries.map(countries => <option>{countries.name}</option>)}
			</select>
			<button className ="btn btn-info ml-4 mt-3" id="textSearch" onClick={this.handleSearchCategory.bind(this)}>Procurar</button>
		</div>
    );
	}

	handleSearchCategory(){
		console.log("S-" + this.state.startDate + " --- E -" + this.state.endDate + "\n Country - " + this.state.countrySelected + "Category - " + this.state.categorySelected);
	}
}

class TextSearch extends React.Component{
	constructor(props) { 
		super(props);
		this.state = { textkeysearch : "" };
	}

	handleSearchText(e){
		this.setState({ textkeysearch : e.target.value});
	}

	render() {
    return (
		<div className="mt-3">
			<br/><br/>
		    <input id="text-search" type="text" onChange={this.handleSearchText.bind(this)} />
			<Link to={{ pathname: "/festivals/textSearch/search=", state:{textInput : this.state.textkeysearch} }}>
				<a class ="btn btn-info ml-3" id="textSearch" href={"/festivals/textSearch/search="} >Procurar</a><br/>
			</Link>
			<span>*Insira uma palavra-chave - pode ser o nome do evento, o sítio onde irá decorrer, entre outros...</span>
			
		</div>
    );
	}
}

class SearchResults extends React.Component{
	componentDidMount(){
		const textInput = this.props.match.params
		//TODO fetch()
	}
		
	render() {
		return(
			<div>
				<p>IARARARA</p>
				<p>{this.textInput}</p>
			</div>
		);
	}
}


export default SearchPageContent


