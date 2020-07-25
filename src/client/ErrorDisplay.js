import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userActions from './redux/actions/user';
import './../css/error_display.css';

export class ErrorDisplay extends Component {
	constructor(props) {
		super();
		// autobind(this);
		this.state = {
			errorText: null, errors: null
		};
	}

	setErrors(errors, type) {
		if (errors.length == 1) {
			this.setError(errors[0], type);
		} else {
			this.setState({ errors: errors, errorText: null });
		}
	}

	render() {
		var errorContent, errors;
		var errorContent = this.props.invalid || this.props.duplicate;
		console.log(errorContent)

		if (this.props.errors) {
			errorContent = this.props.errors[0];
			if (this.props.type == "duplicate") {
				var errorClassName = "duplicateError";
			} else if (this.props.type == "invalid") {
				var errorClassName = "invalidError";
			}
		}

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

export default connect((state) => ({
    user: state.user
}), { ...userActions })(ErrorDisplay)
