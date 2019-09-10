// require("utility/error_display.scss");
import React, { Component } from 'react';

export default class ErrorDisplay extends Component {
	constructor(props) {
		super();
		// autobind(this);
		this.state = {
			errorText: null, errors: null
		};
	}

	setError(error) {
		this.setState({ errorText: error, errors: null });
	}

	setErrors(errors) {
		if (errors.length == 1) {
			this.setError(errors[0]);
		} else {
			this.setState({ errors: errors, errorText: null });
		}
	}

	reset() {
		// e.preventDefault();
		this.setState({ errorText: null, errors: null });
	}

	render() {
		var errorContent, errors, closeButton;

		if (this.state.errorText) {
			errorContent = (
				<span className="errorContent">{ this.state.errorText }</span>
			);
			
		} else if (this.state.errors && this.state.errors.length == 1) {
			errorContent = (
				<span className="errorContent">{ this.state.errors[0] }</span>
			);

		} else if (this.state.errors) {
			errors = this.state.errors.map(function(error, i) {
				return <li key={ "error" + i }>{ error }</li>;
			});
			errorContent = (
				<div className="errorContent">
					<ul className="move-in">{ errors }</ul>
				</div>
			);
		}
		
		closeButton = (
			<a className="closeLink btn-link" aria-label="Close" onClick={ this.reset.bind(this) }>
				<span aria-hidden="true">Got it</span>
			</a>
		)

		if (errorContent) {
			return (
				<div className="errorDisplay" role="alert">
					{ errorContent }
					{ closeButton }
				</div>
			)			
		} else {
			return null;
		}
	}
};
