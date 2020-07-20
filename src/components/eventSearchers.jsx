import React from "react";
import axios from "axios";
import '../App.css';
import { BrowserRouter as Switch, Route, Link} from "react-router-dom";
import { LazyLoadImage} from 'react-lazy-load-image-component';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import ChatBox from "./chatBox";


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
			<ChatBox/>
			
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

		var today = new Date();
		var dd = String(today.getDate()).padStart('2',0);
		var nn = String(today.getMonth() + 1).padStart(2,'0');
		var yyyy = today.getFullYear();
		const  minDate = yyyy + "-" + nn + "-" + dd;

		this.state ={
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"start.gte": minDate,
					"offset": 0,
					"sort" : "start",
					"q" : this.props.location.state.textInput,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		}
	}
	nextpage(e) {
		let newOffset =Number(e.target.value) + 10;

		this.setState({
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"start.gte": this.props.location.minDate,
					"sort" : "start",
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
		
		this.setState({
			logged : localStorage.getItem("logged"),
			requestURL : "https://api.predicthq.com/v1/events",
			apiSettings:{
				headers: {
					"Accept" : "application/json",
					"Authorization" : "Bearer JK2DXXqhuW8FF-FHbPqlg3cdbVaqPLn8Siaies--",
				},
				params : {
					"start.gte": this.props.location.minDate,
					"sort" : "start",
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

	getTimeLeft(eventDate) {
		var today = new Date();
		var dd = String(today.getDate()).padStart('2',0);
		var nn = String(today.getMonth() + 1).padStart(2,'0');
		var yyyy = today.getFullYear();

		var d1 = new Date (yyyy + "/" + nn + "/" + dd);
		var td = String(eventDate).replace(/-/g,"/");
		var d2 = new Date(td);

		var cd = 24 * 60 * 60 * 1000;
		var daysLeft = Math.floor(Math.abs(d1 - d2) / cd);

		return (daysLeft);
	}

	componentDidMount(){
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results,
																																	resultAmount : searchResultsList })});
																																	
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
		if(this.state.resultAmount === 0){
			resultsnavigation=(
				<>
					<h3>Não foram encontrados resultados relacionados com a sua pesquisa!</h3>
					<a href="/festivals"> Regressar á página de pesquisa</a>
				</>
			);
		}
		return(
			<div className="list-group">
				{ this.state.searchResultsList.map(searchResultsList =>
				<Link className ="list-group-item list-group-item-action flex-column align-items-start" id="textSearch" to={{ pathname: "/juvafestival", state:{
																																eventName : searchResultsList.title,
																																eventPlace : searchResultsList.location,
																																eventSpot : searchResultsList.entities.map(entity => entity.name),
																																eventDate : searchResultsList.start,
																																eventEndDate : searchResultsList.end,
																																eventDescription : searchResultsList.description,
																																eventCategory : searchResultsList.category,
																																} }}>
					<div className="d-flex w-100 justify-content-between">
						<h5 className="mb-1 font-weight-bold">{searchResultsList.title}</h5>
					</div>
					<div className="mb-1 ml-2 list-inline-item"> Inicio de evento: {(searchResultsList.start).split("T", 1)}</div>
					<div className="mb-1 ml-3 list-inline-item">  Fim de evento: {(searchResultsList.end).split("T", 1)} </div>
					<div className="mb-1 ml-3 list-inline-item">  Local: {searchResultsList.entities.map(entity => entity.name)}
					</div>
					<br/><small className="ml-2">Dentro de {this.getTimeLeft((searchResultsList.start).split("T", 1))} dias </small>
				</Link>
				)
				}
				{resultsnavigation}
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
					"sort" : "start",
					"offset": 0,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		}
	}
	nextpage(e) {
		let newOffset =Number(e.target.value) + 10;
		this.setState({
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
					"sort" : "start",
					"offset": newOffset,
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
					"start.gte" : this.props.location.state.startDate,
					"start.lte" : this.props.location.state.endDate,
					"country" : this.props.location.state.countrySelected,
					"sort" : "start",
					"category" : this.props.location.state.categorySelected,
				}
			},
			resultAmount : 0,
			searchResultsList : [],
		});
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const searchResultsList = res.data; this.setState({ searchResultsList : searchResultsList.results,
			resultAmount : searchResultsList.count })});
	}

	getTimeLeft(eventDate) {
		var today = new Date();
		var dd = String(today.getDate()).padStart('2',0);
		var nn = String(today.getMonth() + 1).padStart(2,'0');
		var yyyy = today.getFullYear();

		var d1 = new Date (yyyy + "/" + nn + "/" + dd);
		var td = String(eventDate).replace(/-/g,"/");
		var d2 = new Date(td);

		var cd = 24 * 60 * 60 * 1000;
		var daysLeft = Math.floor(Math.abs(d1 - d2) / cd);

		return (daysLeft);
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
		if(this.state.resultAmount === 0){
			resultsnavigation=(
				<>
					<h3>Não foram encontrados resultados relacionados com a sua pesquisa!</h3>
					<a href="/festivals"> Regressar á página de pesquisa</a>
				</>
			);
		}
		return(
			<div className="list-group">
				{ this.state.searchResultsList.map(searchResultsList =>
				<Link className ="list-group-item list-group-item-action flex-column align-items-start" id="textSearch" to={{ pathname: "/juvafestival", state:{
																																eventName : searchResultsList.title,
																																eventPlace : searchResultsList.location,
																																eventDate : searchResultsList.start,
																																eventEndDate : searchResultsList.end,
																																eventCategory : searchResultsList.category,
																																eventDescription : searchResultsList.description
																																} }}>
					<div className="d-flex w-100 justify-content-between">
						<h5 className="mb-1 font-weight-bold">{searchResultsList.title}</h5>
					</div>
					<div className="mb-1 ml-2 list-inline-item"> Inicio de evento: {(searchResultsList.start).split("T", 1)}</div>
					<div className="mb-1 ml-3 list-inline-item">  Fim de evento: {(searchResultsList.end).split("T", 1)} </div>
					<div className="mb-1 ml-3 list-inline-item">  Local: {searchResultsList.entities.map(entity => entity.name)}
					</div>
					<br/><small className="ml-2">Dentro de {this.getTimeLeft((searchResultsList.start).split("T", 1))} dias </small>
				</Link>
				)
				}
				{resultsnavigation}
			</div>
			
		);
	}
}

class EventInfo extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			eventName : this.props.location.state.eventName,
			eventPlace : String(this.props.location.state.eventPlace).split(","),
			eventDate : this.props.location.state.eventDate,
			eventEndDate : this.props.location.state.eventEndDate,
			eventSpot : this.props.location.state.eventSpot,
			eventCategory : this.props.location.state.eventCategory,
			eventDescription : this.props.location.state.eventDescription,
			requestURL : "https://eu1.locationiq.com/v1/reverse.php?",
			apiSettings:{
				headers: {
					"Connection" : "keep-alive",
				},
				params : {
						"key": "8fc7cde8f94f2b",
						"lon" : this.props.location.state.eventPlace[0],
						"lat" : this.props.location.state.eventPlace[1],
						"zoom" : "10",
						"format" : "json",
						}
			},
			fullAddress : "",
		}
	}

	componentDidMount(){
		axios.get(this.state.requestURL, this.state.apiSettings).then( res => { const address = res.data; this.setState({ fullAddress : address.address })});
		
	}
	
	render(){
		let addressToPlace = this.state.fullAddress;
		const adressOutput = String(addressToPlace.county + ", ") + String(addressToPlace.city + ", ") + String(addressToPlace.state + ", ") + String(addressToPlace.country + ", ");
		
		let imgsrc = require("../images/other.png");

		if(this.state.eventCategory=="concerts"){
			imgsrc = require("../images/concerts_image.png");
		}
		if(this.state.eventCategory=="conferences"){
			imgsrc = require("../images/conferences_image.png");
		}
		if(this.state.eventCategory=="comunity"){
			imgsrc = require("../images/comunity_image.png");
		}
		if(this.state.eventCategory=="sports"){
			imgsrc = require("../images/sports_image.png");
		}
		if(this.state.eventCategory=="performing-arts"){
			imgsrc = require("../images/perfoming-arts_image.png");
		}
		if(this.state.eventCategory=="expos"){
			imgsrc = require("../images/expos_image.png");
		}
		if(this.state.eventCategory=="festivals"){
			imgsrc = require("../images/festivals_image.png");
		}


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
				<div className="row">
					<div className="col">
						<div className="card" style={{width:"35rem"}}>
							<LazyLoadImage className="card-img-top" src={imgsrc} alt="Image related to event"/>
							<div className="card-body">
								<p className="card-text">Nome: {this.state.eventName}</p>
								<p className="card-text">Morada: {adressOutput}</p>
								<p className="card-text">Entidade Associada: {this.state.eventSpot}</p>
								<p className="card-text">Inicio do evento: {(this.state.eventDate).split("T", 1)}  Fim do evento:{(this.state.eventEndDate).split("T",1)}</p>
								<br/><br/>
								{loggedOptions}
							</div>
						</div>
					</div>
					<div className="col">
						{this.state.eventDescription}
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

	formStyle = {
		border:"1px solid #33ccff",
		padding:"30px",
	}

	submit = () => {
		confirmAlert({
			title: 'Confirmar Inscrição',
			message: 'Tem a certeza que pretende realizar a sua inscrição com estes dados?',
			buttons: [
			{
				label: 'Confirmar',
				onClick: () => window.location.href="/"
			},
			{
				label: 'Cancelar',
				onClick: () => ""
			}
			],
		});
	};

	componentDidMount(){
		document.getElementsByClassName("leaflet-container")[0].style.height ="100%";
		document.getElementsByClassName("leaflet-container")[0].style.width ="100%";
	}

	render(){
		return(
			<div className="row">
				<div className="col-6" style={this.formStyle}>
					<div className="d-flex justify-content-center">
						<h3>{this.state.eventName}</h3>
					</div>
					<form>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="carSelect">Tipo de carro:</label>
								<select className="custom-select mr-sm-2" id="carSelect">
									<option selected>Escolha uma opção</option>
									<option>SUV</option>
									<option>Carrinha de caixa aberta</option>
									<option>Carro Desportivo</option>
									<option>Carrinha Fechada</option>
									<option>Híbrido</option>
									<option>Elétrico</option>
								</select>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="maxLotationInput">Lotação máxima:</label>
								<input type="number" className="form-control" id="maxLotationInput"/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group col-md-6">
								<label htmlFor="leaveDateInput">Data de partida:</label>
								<input type="date" className="form-control" id="leaveDateInput"/>
							</div>
							<div className="form-group col-md-6">
								<label htmlFor="returnDateInput">Data de regresso: </label>
								<input type="date" className="form-control" id="returnDateInput"/>
							</div>
						</div>
						<div className="form-row">
							<label htmlFor="locationlatlong">Ponto de Partida</label>
							<input type="text" className="form-control" id="locationlatlong"/>
						</div>
							
						<div className="form-row">
							<label htmlFor="commentInput">Adicionar comentário:</label>
							<textarea className="form-control" rows="3" id="commentInput"/>
						</div>
						<div className="form-row mt-3">
							<a onClick={this.submit} className="btn btn-primary mx-auto">Confirmar</a>
						</div>
						</form>
				</div>
				<div className="col">
					{loadMap([0.0000, 0.0000])}
				</div>
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
				eventPlace : this.props.location.state.eventPlace,
			}
		}
	}

	
	render(){
		return(
			<ul>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "José Maria", eventPlace : this.state.availableRidesList.eventPlace}}}>
					José Maria
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Maria José", eventPlace : this.state.availableRidesList.eventPlace}}}>
					Maria José
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Tiago Joaquim", eventPlace : this.state.availableRidesList.eventPlace}}}>
					Tiago Joaquim
				</Link>
				<Link className="list-group-item list-group-item-action" to={{ pathname: "/signrideForm" , state:{personName : "Maria Francisca", eventPlace : this.state.availableRidesList.eventPlace}}}>
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
			eventPlace : this.props.location.state.eventPlace,
			accompaniedBy : "",
		}
	}

	mapProperties = {
		height:"100%",
		width:"100%",
	}

	signRideFormstyle = {
		border : "1px solid #33ccff",
		padding: "15px",
	}

	submit = () => {
		confirmAlert({
			title: 'Confirmar Inscrição',
			message: 'Tem a certeza que pretende realizar a sua inscrição com estes dados?',
			buttons: [
			{
				label: 'Confirmar',
				onClick: () => window.location.href="/"
			},
			{
				label: 'Cancelar',
				onClick: () => ""
			}
			],
		});
	};
	

	componentDidMount(){
		document.getElementsByClassName("leaflet-container")[0].style.height ="100%";
		document.getElementsByClassName("leaflet-container")[0].style.width ="100%";
	}

	changeRadioCheck(e){
		this.setState({
			accompaniedBy : e.target.value,
		});
		if(e.target.value == 1){
			document.getElementById("amountCompany").style.display = "block";
		}else{
			document.getElementById("amountCompany").style.display = "none";
		}
	}
	

	render(){
		const position = [this.state.eventPlace[1], this.state.eventPlace[0]];
		console.log(position);
		return(
			<div className="row">
				<div className="col" style={this.signRideFormstyle}>
					<br/>
					<h3>Condutor: {this.state.driverPersonName}</h3>
					<form className="ml-2">
						<div className="form-row mt-2">
							<label htmlFor="locationlatlong">A sua localização: </label>
							<input type="text" className="form-control" id="locationlatlong"/>
						</div>
						<div className="form-row">
							<fieldset className="form-group col-md-6">
								<legend>Irá acompanhado?</legend>
								<div className="form-check">
									<label className="form-check-label">
										<input type="radio" id ="companyOptionYes" className="form-check-input" value="1" checked={this.state.accompaniedBy === "1"} onChange={this.changeRadioCheck.bind(this)}/>
										Sim
									</label>
								</div>
								<div className="form-check">
									<label className="form-check-label">
										<input type="radio" id ="companyOptionNo" className="form-check-input" value="0" checked={this.state.accompaniedBy === "0"} onChange={this.changeRadioCheck.bind(this)}/>
										Não
									</label>
								</div>
							</fieldset>
							<div id="amountCompany" className="form-group col-md-6" style={{display: "none"}}>
								<br/>
								<label htmlFor="peopleAmountInput">Quantas pessoas?</label>
								<input id="peopleAmountInput" type="number" min="1"/>
							</div>
						</div>

			

						<label>Comentários: </label><br/>
						<textarea className="form-control" rows="2"/><br/><br/>
						<a className="btn btn-success mx-auto" onClick={this.submit}>Submeter</a>
						
					</form>
				</div>
				<div className="col">
					<div id="map" style={this.mapProperties}>
						{loadMap(position)}
					</div>
				</div>
			</div>
			);
		}
	}

	
	function loadMap(position){
		var mapMarker = (<Marker position={position}>
							<Popup>Your location<br />This is you location</Popup>
						</Marker>);

		function handleMapClick(e) {
			const { lat, lng } = e.latlng;
			console.log(`Clicked at ${lat}, ${lng}`);
			var placeInput = document.getElementById("locationlatlong");
			placeInput.value = String(lat + "," + lng);
			var newPosition = [lat, lng];
			this.mapMarker = (<Marker position= {newPosition}>
							<Popup>Your location<br />This is you location</Popup>
						</Marker>);
		}
		return(
			<Map center={position} zoom={13} onClick={handleMapClick}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
				{mapMarker}
				
			</Map>
		);
	}
	


export default SearchPageContent


