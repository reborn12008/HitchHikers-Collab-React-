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
		<>
			<Switch>
				<Route exact path="/festivals" component={SearchTypeToggler}/>
				<Route exact path="/festivals/categorySearch" component={CategorySearch}/>
				<Route exact path="/festivals/textSearch" component={TextSearch}/>
				<Route exact path="/festivals/searchResults=" component={SearchResults}/>
        	</Switch>        
			
		</>
	);
	}
}

class SearchTypeToggler extends React.Component{
	render(){
		return(
			<div className="container">
				<a className="btn btn-primary" style={{ marginRight:"10px" }} href="/festivals/categorySearch" > Pesquisar por categoria </a>
				<a className="btn btn-primary" href="/festivals/textSearch"> Pesquisar por palavras-chave </a>
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
			<Link className ="btn btn-info ml-3" id="textSearch" to={{ pathname: "/festivals/searchResults=", 
																	state:{startDate : this.state.startDate,
																		endDate: this.state.endDate,
																		categorySelected : this.state.categorySelected,
																		countrySelected : this.state.countrySelected,
																		} }}>
				Procurar
			</Link><br/>
		</div>
    );
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
			<Link className ="btn btn-info ml-3" id="textSearch" to={{ pathname: "/festivals/searchResults=", state:{textInput : this.state.textkeysearch} }}>
				Procurar
			</Link><br/>
			<span>*Insira uma palavra-chave - pode ser o nome do evento, o sítio onde irá decorrer, entre outros...</span>
			
		</div>
    );
	}
}

class SearchResults extends React.Component{
	constructor(props){
		super(props);

		if(this.props.location.state.textInput != null){
			this.setState({apiSettings: {params : {"q" : this.props.location.state.textInput}}})
		}
		if(this.props.location.state.startDate == null){
			this.setState({apiSettings: {params : {"start.gte" : this.props.location.state.startDate}}})
		}
		if(this.props.location.state.endDate == null){
			this.setState({apiSettings: {params : {"start.lte" : this.props.location.state.endDate}}})
		}
		if(this.props.location.state.startDate == null){
			this.setState({apiSettings: {params : {"country" : this.props.location.state.countrySelected}}})
		}
		if(this.props.location.state.startDate == null){
			this.setState({apiSettings: {params : {"category" : this.props.location.state.categorySelected}}})
		}

		this.state ={
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {

				}
			},
			searchResultsList : [],
		}
	}
	componentDidMount(){
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results })});
	}
		
	render() {
		if(this.state.logged == 1)
		{
			return(
				<ul>
					{ this.state.searchResultsList.map(searchResultsList => <button class="list-group-item list-group-item-action">{searchResultsList.title}</button>)}
				</ul>
			);
		}else{
			return(
				<ul>
					{ this.state.searchResultsList.map(searchResultsList => <li class="list-group-item">{searchResultsList.title}</li>)}
				</ul>
			);
		}
	}
}


export default SearchPageContent


