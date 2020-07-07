// require("utility/error_display.scss");
import React, { Component } from 'react';
import './../css/error_display.css';

export default class ErrorDisplay extends Component {
	constructor(props) {
		super();
		// autobind(this);
		this.state = {
			errorText: null, errors: null
		};
	}

	setError(error, type) {
		this.setState({ errorText: error, errors: null, type: type });
	}

	setErrors(errors, type) {
		if (errors.length == 1) {
			this.setError(errors[0], type);
		} else {
			this.setState({ errors: errors, errorText: null });
		}
	}

	reset = () => {
		console.log("reset")
		this.props.updateErrors();
		// e.preventDefault();
		this.setState({ errorText: null, errors: null });
	}

	render() {
		var errorContent, errors, closeButton;

		if (this.state.errorText) {
			errorContent = this.state.errorText
			if (this.state.type == "duplicate") {
				var errorClassName = "duplicateError";
			} else if (this.state.type == "invalid") {
				var errorClassName = "invalidError";
			}
		} else if (this.state.errors && this.state.errors.length == 1) {
			errorContent = this.state.errors[0]
			var errorClassName = "errorTwo";
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
		
		// closeButton = (
		// 	<span>
		// 		<span className="x">x</span>
		// 		<a className="closeLink btn-link" aria-label="Close" onClick={ this.reset.bind(this) }>
		// 			<span aria-hidden="true">Got it </span>
		// 		</a>
		// 	</span>
		// )

		if (errorContent) {
			return (
				<div className="errorDisplay notificationText" role="alert">
					<p className={ "errorContent " + errorClassName}>
						{ errorContent }
					</p>
				</div>
			)			
		} else {
			return null;
		}
	}
};
