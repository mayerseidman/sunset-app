import React, { Component } from 'react';
import sunFullImage from './../images/sun-full.png';
import './../css/results_section.css';

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
	render() {
		if (this.props.sunset) {
			var className = this.fetchBackground()
		} else {
			if (this.state.spin) {
			    var sunClassName = "spin";
			    var containerClass = "shrink";
			}
		}
		return (
			<div className={ "section resultsSection " + className }>
				<div className="innerContent">
				</div>
			</div>
		)
	}
};