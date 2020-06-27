import React, { Component } from 'react';
import sunFullImage from './../images/sun-full.png';
import './../css/results_section.css';
const moment = require('moment');

export default class ResultsSection extends Component {
	constructor(props) {
		super();
		this.state = {};
	}
	fetchBackground = () => {
		var quality = this.props.sunset.quality;
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
	renderSunsetSuccess() {
		const sunset = this.props.sunset;
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
	    // if (this.state.showFahrenheitLink) {
	    //     var temperatureWidget = (
	    //         <a className="changeTemperatureLink" onClick={ this.changeTemperature.bind(this, "F") }>F</a>
	    //     ) 
	    // } else {
	    //     var temperatureWidget = (
	    //         <a className="changeTemperatureLink" onClick={ this.changeTemperature.bind(this, "C") }>C</a>
	    //     ) 
	    // }
	    var temperatureWidget = (<span>widget</span>)
		return (
	    	<div className="resultsContainer">
	    		<p className="header">YOUR SUNSET:</p>
	    		<p className="time mediumText">TIME: { momentTime }</p>
	    		<p className="temperature mediumText">TEMP: { Math.floor(sunset.temperature) }° { temperatureWidget }</p>
	    		<p className="quality mediumText">QUALITY: { sunset.quality } ({ Math.floor(sunset.quality_percent) }%) </p>
	    	</div>
	    )
	}
	render() {
		if (this.props.sunset) {
			var className = this.fetchBackground();
			var resultsContent = this.renderSunsetSuccess();
		} else {
			if (this.state.spin) {
			    var sunClassName = "spin";
			    var containerClass = "shrink";
			}
		}
		// var resultsContent = (
		// 	<div className="resultsContainer">
		// 		<p className="header">YOUR SUNSET:</p>
		// 		<p className="time mediumText">TIME:</p>
		// 		<p className="temperature mediumText">TEMP:</p>
		// 		<p className="quality mediumText">QUALITY:</p>
		// 	</div>
		// )
		return (
			<div className={ "section resultsSection " + className }>
				<div className="innerContent">
					{ resultsContent }
				</div>
			</div>
		)
	}
};