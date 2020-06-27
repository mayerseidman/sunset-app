import React, { Component } from 'react';
import './../css/information_section.css';

export default class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className="section informationSection">
				<div className="innerContent">
					<p className="header">SUNSETS ARE AWESOME</p>
					<p className="valuePropText">	Dont miss another great sunset! <br/>
						View the sunset forecast for your area.
					</p>
					<button onClick={ this.props.findMySunset } className="findSunsetButton">Find My Sunset</button>
					<a className="signupLink link">Sign Up For Daily SMS</a>
				</div>
			</div>
		)
	}
};
