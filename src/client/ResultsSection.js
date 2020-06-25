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

		}
		return (
			<div className={ "section resultsSection " + className }>
				<div className="innerContent">
					<img src={ sunFullImage } alt="sun-inner" className="sunImg" />
				</div>
			</div>
		)
	}
};
