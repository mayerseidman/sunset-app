import React, { Component } from 'react';
import { connect } from 'react-redux';
import sunFullImage from './../images/happy-sun-two.png';
import './../css/results_section.css';
const moment = require('moment');

export class ResultsSection extends Component {
	constructor(props) {
		super();
		this.state = { showRubric: false };
	}
	fetchBackground = () => {
		var quality = this.props.sunset.info.quality;
		switch (quality) {
			case "Poor":
				var className = "poorResult";
				break;
			case "Fair":
		    	var className = "fairResult";
				break;
			case "Good":
				var className = "goodResult";
				break;
			case "Great":
				var className = "greatResult";
				break;
		}
		return className;
	}
	showRubric = () => {
		this.setState({ showRubric: true })
	}
	renderRubric = () =>  {
		var poorDescription = "Little to no color, with precipitation or a thick cloud layer often blocking a direct view of the sun.";
		var fairDescription = "Some color for a short time, with conditions ranging from mostly cloudy, or hazy, to clear, with little to no clouds at all levels.";
		var goodDescripton = "A fair amount of color, often multi-colored, lasting a considerable amount of time. Often caused by scattered clouds at multiple elvels.";
		var greatDescription = "Extremely vibrant color lasting 30 minutes or more. Often caused by multiple arrangements of clouds at multiple levels, transitioning through multiple stages of vivid color.";
		return (
			<div>
				<table className="rubricTable">
					<tr>
						<td data-th="Quality">Poor <br/>(0-25%)</td>
						<td data-th="Description">{ poorDescription }</td>
					</tr>
					<tr>
						<td data-th="Quality">Fair <br/>(25-50%)</td>
						<td data-th="Description">{ fairDescription }</td>
					</tr>
					<tr>
						<td data-th="Quality">Good <br/>(50-75%)</td>
						<td data-th="Description">{ goodDescripton }</td>
					</tr>
					<tr>
						<td data-th="Quality">Great <br/>(75-100%)</td>
						<td data-th="Description">{ greatDescription }</td>
					</tr>
				</table>
			</div>
		)
	}
	changeTemperature = (type) => {
		const sunset = this.props.sunset.info;
		if (sunset) {
			const celsius = Math.floor(sunset.temperature);
			const fahrenheit = Math.floor(( (9 * celsius) + 160 ) / 5)
			if (type == "F") {
				console.log("F")
			    this.setState({ showFahrenheit: true, temperature: fahrenheit })
			} else {
				console.log("C")
			    this.setState({ showFahrenheit: false, temperature: celsius })
			}
		}
	}
	goBack = () => {
		this.setState({ showRubric: false })
	}
	renderSunsetSuccess = () => {
		var sunset = this.props.sunset.info;
	    if (this.state.showRandomSunset) {
	        var locationText = (
	            <p>{ this.state.city } Suns°et Forecast: </p>
	        )
	        var randomLocation = "randomLocation";
	        const offset = this.state.offset;
	        var momentTime = moment.utc(sunset.valid_at).utcOffset(offset).format("H:mm");
	    } else {
	        var momentTime = moment(sunset.valid_at).format("H:mm");
	    }
	    if (this.state.showFahrenheit) {
	    	var temperatureWidget = (
	    	    <a className="changeTemperatureLink link" onClick={ () => this.changeTemperature("C") }>F</a>
	    	) 
	    } else {
	        var temperatureWidget = (
	            <a className="changeTemperatureLink link" onClick={ () => this.changeTemperature("F") }>C</a>
	        ) 
	    }
	    if (this.state.temperature) {
	    	var temperature = this.state.temperature;
	    } else {
	    	var temperature = sunset.temperature;
	    }
	    if (!this.props.submissionSuccess) {
	    	var signUpButton = (
	    		<button className="findSunsetButton showMobile">
	    			Sign Up For Daily SMS
	    		</button>
	    	)
	    }
		return (
			<div>
				<div className="resultsContainer">
					<p className="header">YOUR SUNSET:</p>
					<p className="mediumText time">TIME: { momentTime }</p>
					<p className="mediumText temperature">TEMP: { Math.floor(temperature) }° { temperatureWidget }</p>
					<p className="mediumText quality"><span>QUALITY:</span> 
						<a className="detailsLink link" onClick={ this.showRubric }> { sunset.quality } ({ Math.floor(sunset.quality_percent) }%)</a>
					</p>
				</div>
				{ signUpButton }
			</div>
	    )
	}
	renderSunsetError() {
		return (
			<div className="fetchErrorText">
				<p>
					Sorry! We were not able to get your sunset forecast. 
				</p>
				<p>	Please refresh this page and try again. 
					Still no luck? Try again in 30 minutes.
				</p>
			</div>
		)
	}
	render() {
		var sunset = this.props.sunset;
		var sunsetInfo = sunset.info;
		var isLoadingSunset = sunset.loading || this.props.loadingSunset;

		if (isLoadingSunset) {
		    var sunClassName = "spin";
		}
		if (sunset.sunsetSuccess) {
			var className = this.fetchBackground()  + " fullView";
			var resultsClassName = "resultsView";
			if (this.state.showRubric) {
				var resultsContent = this.renderRubric();
			} else {
				var resultsContent = this.renderSunsetSuccess();
			}
			if (this.state.showRubric) {
				resultsClassName = resultsClassName + " rubricView"
			}
		} else if (sunset.error) {
			var resultsContent = this.renderSunsetError();
			var className = "poorResult";
		} else {
			var sunsetImage = (
				<img className={ "sunImage " + sunClassName } src={ sunFullImage } alt=""
					onClick={ this.props.fetchSunset } />
			)
		}
		var docksLink = <a className="docsLink">DOCS</a>
		var backLink = (
			<a className="backLink" style={{ visibility: this.state.showRubric ? "visible" : "hidden" }}
				onClick={ this.goBack }>BACK</a>
		)

		return (
			<div className={ "section resultsSection " + className }>
				<div className="navbar">
					{ backLink }
					{ docksLink }
				</div>
				<div className={ "innerContent " + resultsClassName }>
					{ sunset && resultsContent }
					{ sunsetImage }
				</div>
			</div>
		)
	}
};
export default connect((state) => ({
    sunset: state.sunset
}))(ResultsSection)