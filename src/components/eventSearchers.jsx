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
				<Route path="/festivals/textSearchResults=" component={TextSearchResults}/>
				<Route exact path="/festivals/categorySearchResults=" component={CategorySearchResults}/>
				<Route exact path="/juvafestival" component={EventInfo}/>
				<Route exact path="/giverideForm" component={GiveRideForm}/>
				<Route exact path="/findrideForm" component={FindRideForm}/>
				<Route exact path="/signrideForm" component={SignRideForm}/>
        	</Switch>        
			
		</>
	);
	}
}

class SearchTypeToggler extends React.Component{
	render(){
		return(
			<div className="container">
				<p>Aqui poderá consultar todos os eventos aderentes!<br/> Encontre o seu evento através de detalhes na pesquisa por palavras-chave ou preencha os campos de acordo, na pesquisa por categorias.</p><br/><br/>
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
		<>
			<SearchTypeToggler/>
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
				<Link className ="btn btn-info ml-3" id="categorySearch" to={{ pathname: "/festivals/categorySearchResults=", 
																		state:{startDate : this.state.startDate,
																			endDate: this.state.endDate,
																			categorySelected : this.state.categorySelected,
																			countrySelected : this.state.countrySelected,
																			} }}>
					Procurar
				</Link><br/>
			</div>
		</>
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
		<>
			<SearchTypeToggler/>
			<div className="mt-3 ml-4">
				<br/><br/>
				<input id="text-search" type="text" onChange={this.handleSearchText.bind(this)} />
				<Link className ="btn btn-info ml-3" id="textSearch" to={{ pathname: "/festivals/textSearchResults=", state:{textInput : this.state.textkeysearch,
																																searchOffset : 0} }}>
					Procurar
				</Link><br/>
				<span>*Insira uma palavra-chave - pode ser o nome do evento, o sítio onde irá decorrer, entre outros...</span>
				
			</div>
		</>
    );
	}
}

class TextSearchResults extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"offset": 0,
					"q" : this.props.location.state.textInput,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		}
	}
	nextpage(e) {
		let newOffset =Number(e.target.value) + 10;
		console.log(newOffset);
		this.setState({
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"offset": newOffset,
					"q" : this.props.location.state.textInput,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		});
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results,
			resultAmount : searchResultsList.count })});
	}

	previouspage(e) {
		let newOffset =Number(e.target.value) - 10;
		console.log(newOffset);
		this.setState({
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"offset": newOffset,
					"q" : this.props.location.state.textInput,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		});
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results,
			resultAmount : searchResultsList.count })});
	}

	componentDidMount(){
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results,
																																	resultAmount : searchResultsList.count })});
		
	}
		
	render() {
		let resultsnavigation;
		if(this.state.apiSettings.params.offset==0){
			resultsnavigation=(
				<div className="row">
					<div className="col"> </div>
					<div className="col">
						<button className = "btn btn-link" value={this.state.apiSettings.params.offset} onClick={this.nextpage.bind(this)}>Página Seguinte</button>
					</div>
				</div>);
		}else if(this.state.apiSettings.params.offset>0){
			resultsnavigation=(
				<div className="row">
					<div className="col">
						<button className = "btn btn-link" value={this.state.apiSettings.params.offset} onClick={this.previouspage.bind(this)}>Página Anterior</button>
					</div>
					<div className="col">
						<button className = "btn btn-link" value={this.state.apiSettings.params.offset} onClick={this.nextpage.bind(this)}>Página Seguinte</button>
					</div>
				</div>);
		} else if(this.state.apiSettings.params.offset>=this.state.resultAmount){
			resultsnavigation=(
				<div className="row">
					<div className="col">
						<button className = "btn btn-link" value={this.state.apiSettings.params.offset} onClick={this.previouspage.bind(this)}>Página Anterior</button>
					</div>
					<div className="col">
						
					</div>
				</div>);
		}
		return(
			<div className="list-group">
				{ this.state.searchResultsList.map(searchResultsList =>
				<Link className ="list-group-item list-group-item-action flex-column align-items-start" id="textSearch" to={{ pathname: "/juvafestival", state:{
																																eventName : searchResultsList.title,
																																eventPlace : searchResultsList.location,
																																eventDate : searchResultsList.start,
																																eventCategory : searchResultsList.category,
																																} }}>
					<div className="d-flex w-100 justify-content-between">
						<h5 className="mb-1 font-weight-bold">{searchResultsList.title}</h5>
					</div>
					<div className="mb-1 ml-2 list-inline-item"> Inicio de evento: {(searchResultsList.start).split("T", 1)}</div>
					<div className="mb-1 ml-3 list-inline-item">  Fim de evento: {(searchResultsList.end).split("T", 1)} </div>
					<div className="mb-1 ml-3 list-inline-item">  Local: {searchResultsList.location}
					</div>
					<br/><small className="ml-2">Dentro de 0 dias </small>
				</Link>
				)
				}
				{resultsnavigation};
			</div>
			
		);
	}
}

class CategorySearchResults extends React.Component{
	constructor(props){
		super(props);

		this.state ={
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"start.gte" : this.props.location.state.startDate,
					"start.lte" : this.props.location.state.endDate,
					"country" : this.props.location.state.countrySelected,
					"category" : this.props.location.state.categorySelected,
				}
			},
			searchResultsList : [],
		}
	}
	componentDidMount(){
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results })});

	}
		
	render() {
		return(
			<ul>
				{ this.state.searchResultsList.map(searchResultsList => 
				<Link className ="list-group-item list-group-item-action" id="textSearch" to={{ pathname: "/juvafestival", state:{
																																eventName : searchResultsList.title,
																																eventPlace : searchResultsList.location,
																																eventDate : searchResultsList.start,
																																eventCategory : searchResultsList.category,
																																} }}>
					{searchResultsList.title}
				</Link>
				)
				}
			</ul>
		
		);
	}
}

class EventInfo extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			eventName : this.props.location.state.eventName,
			eventPlace : this.props.location.state.eventPlace,
			eventDate : this.props.location.state.eventDate,
			eventCategory : this.props.location.state.eventCategory,
			imageurl : ""
			
		}

		if(this.state.eventCategory=="concerts"){
			this.setState({imageurl : require("../images/concerts_image.png")});
		}
		if(this.state.eventCategory=="conferences"){
			this.setState({imageurl : require("../images/conferences_image.png")});
		}
		if(this.state.eventCategory=="comunity"){
			this.setState({imageurl : require("../images/comunity_image.png")});
		}
		if(this.state.eventCategory=="sports"){
			this.setState({imageurl : require("../images/sports_image.png")});
		}
		if(this.state.eventCategory=="performing-arts"){
			this.setState({imageurl : require("../images/perfoming-arts_image.png")});
		}
		if(this.state.eventCategory=="expos"){
			this.setState({imageurl : require("../images/expos_image.png")});
		}
		if(this.state.eventCategory=="festivals"){
			this.setState({imageurl : require("../images/festivals_image.png")});
		}
	}
	render(){
		let loggedOptions = (
				<span>Aceda através da sua conta pessoal para poder ver outros utilizadores interessados neste evento!</span>
			);

		if(localStorage.getItem("logged")==1){ 
			loggedOptions = (
				<div>
					<Link className="btn btn-primary ml-4" to={{ pathname: "/giverideForm", state:{
																								eventName : this.state.eventName,
																								eventPlace : this.state.eventPlace,
																								eventDate : this.state.eventDate,
																								eventCategory : this.state.eventCategory,
																								} }}>
						Voluntariar para boleia
					</Link>
					
					<Link className="btn btn-success ml-4" to={{ pathname: "/findrideForm", state:{
																								eventName : this.state.eventName,
																								eventPlace : this.state.eventPlace,
																								eventDate : this.state.eventDate,
																								eventCategory : this.state.eventCategory,
																								} }}>
						Ver boleias disponiveis
					</Link>
				</div>
				);
		}
		return(
			<div className="container">
				<div className="card" style={{width:"35rem"}}>
					<img className="card-img-top" src={this.state.imageurl} alt="Image related to event"/>
					<div className="card-body">
						<p classname="card-text">Nome: {this.state.eventName}</p>
						<p classname="card-text">Local: {this.state.eventPlace}</p>
						<p classname="card-text">Inicio do evento: {this.state.eventDate}</p>
						<br/><br/>
						{loggedOptions}
					</div>
				</div>
			</div>
		);
	}
}

class GiveRideForm extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			eventName : this.props.location.state.eventName,
			eventPlace : this.props.location.state.eventPlace,
			eventDate : this.props.location.state.eventDate,
			eventCategory : this.props.location.state.eventCategory,
			
		}
	}

	render(){
		return(
			<div className="container" style={{border:"2px solid black"}}>
				<div className="d-flex justify-content-center">
					<h2>{this.state.eventName}</h2>
				</div>
				<form>
						<label>Tipo de carro:</label>
						<select>
							<option>SUV</option>
							<option>Carrinha de caixa aberta</option>
						</select>
						<br/>
						<label>Data de partida:</label>
						<input type="date"/>
						<label>Data de regresso: </label>
						<input type="date"/>
						<br/>
						<label>Ponto de Partida</label>
						<input type="text"/>
						<br/>
						<label>Lotação máxima:</label>
						<input type="number"/>
						<br/>
						<label>Adicionar comentário:</label>
						<textarea/>
						<button>Confirmar</button>
					</form>
			</div>
		);
	}

}

class FindRideForm extends React.Component{
	constructor(props){
		super(props);

		this.state={
			availableRidesList : {
				driverName: "José Maria",
			}
		}
	}
	render(){
		return(
			<ul>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "José Maria"}}}>
					José Maria
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Maria José"}}}>
					Maria José
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Tiago Joaquim"}}}>
					Tiago Joaquim
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Maria Francisca"}}}>
					Maria Francisca
				</Link>

			</ul>
		);
	}
}

class SignRideForm extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			driverPersonName : this.props.location.state.personName,
		}
	}

	render(){
		return(
			<>
			Condutor: {this.state.driverPersonName}
				<form className="was-validated">
					<label>A sua localização: </label>
					<input type="text"/><br/>
					<label>Irá acompanhado?</label>
					<div className="custom-control custom-radio custom-control-inline">
						<input type="radio" id ="signRideRadioBtn" name ="signRideRadioBtn" className="custom-control-input"/>
						<label className="custom-control-label">Sim</label>
					</div>
					<div className="custom-control custom-radio custom-control-inline">
						<input type="radio" id ="signRideRadioBtn" name ="signRideRadioBtn" className="custom-control-input"/>
						<label className="custom-control-label">Não</label>
					</div><br/>
					<label>Comentários: </label><br/>
					<textarea/><br/><br/>
					<a className="btn btn-success" href="/">Submeter</a>
					
				</form>
			</>
			);
		}
	}

	function getAddress(coordinates){
		console.log(coordinates);
		const apiSettings = {
			params : {
				"key": "8fc7cde8f94f2b",
				"q" : coordinates,
				"format" : "json",
			}
		};

		const baseURL = "https://eu1.locationiq.com/v1/search.php?";
		axios.get(baseURL, apiSettings).then( res => { const address = res.data; return address});
	}


export default SearchPageContent


