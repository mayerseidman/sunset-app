import React, { Component } from 'react';
import sunFullImage from './../images/sun-full.png';

export default class ResultsSection extends Component {
	constructor(props) {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className="section resultsSection">
				<div className="innerContent">
					<img src={ sunFullImage } alt="sun-inner" className="sunImg" />
				</div>
			</div>
		)
	}
};
