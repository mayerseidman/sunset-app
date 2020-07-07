import React, { Component } from 'react';
import BarLoader from "react-spinners/BarLoader";
import ErrorDisplay from './ErrorDisplay';
import './../css/information_section.css';
import { css } from "@emotion/core";

export default class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = { showSignupForm: false, showFindSunsetButton: true };
	}

	showSignupForm = () => {
		this.setState({ showSignupForm: true })
	}

	showFindSunsetButton = () =>  {
		this.setState({ showSignupForm: false, showFindSunsetButton: true })
	}

	handleChange = ({ target: { value } }) => {   
	    this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
	};

	submitUser = () => {
		const phoneNumber = this.refs.phone_number.value;
		console.log(phoneNumber)
		this.props.submitUser(phoneNumber);
	}

	renderLoadingBar = (mobile = false) => {
	    if (mobile) {
	        var override = css`
	            height: 5px;
	            display: inline-block;
	            width: 100%;
	            margin-bottom: 4px;
	        `
	    } else {
	       var override = css`
	           height: 5px;
	           display: inline-block;
	           width: 175px;
	           margin-bottom: 4px;
	       `
	    }
	    return (
	        <BarLoader css={ override } color={ "#bbb" } loading={ this.state.loading } />
	    )
	}

	renderSubmitButton = () => {
	    return (
	    	<div className="linksContainer">
	    		<a onClick={ this.showFindSunsetButton }>BACK</a>
	    		<button onClick={ this.submitUser } className="successButton"
	    		    ref="submitBtn">Send Sunsets</button>
	    	</div>
	    )
	}

	renderActionsSection = () => {
	    if (this.state.loading) {
	        var loadingBar = this.renderLoadingBar();
	    } else {
	        var submitButton = this.renderSubmitButton();
	    }
		if (this.state.showSignupForm) {
			if (!this.state.submissionSuccess) {
				return (
					<div className="actionsContainer">
						<div className="inputContainer">
							<label className="phoneNumberLabel">PHONE NUMBER</label>
							<input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
							    onChange={ this.handleChange } value={ this.state.phone } />
						</div>
					    { loadingBar }
					    { submitButton }
					</div>
				)	
			}
		} else if (this.state.showFindSunsetButton) {
			return (
				<div>
					<button onClick={ this.props.findMySunset } className="findSunsetButton successButton">Find My Sunset</button>
					<a className="signupLink link" onClick={ this.showSignupForm }>Sign Up For Daily SMS</a>
				</div>
			)
		}
	}
	render() {
		if (this.props.invalidPhoneNumber) {
			this.refs.errors.setErrors(this.props.errors, "invalid");
		} else if (this.props.duplicatePhoneNumber) {
			this.refs.errors.setErrors(this.props.errors, "duplicate");
		}
		if (this.props.hideInformationView) {
			var className = "hideInformationView"
		}
		var actionsSection = this.renderActionsSection();

		if (this.props.submissionSuccess) {
			var successText = (
			    <p className="notificationText successNotification">
			    	Congrats 🎉! You signed up for a daily suns°et SMS. Enjoy those sunset vibes!
			    </p>    
			)
		} else {
			var errorDisplay = <ErrorDisplay ref="errors" />
		}

		return (
			<div className={ "section informationSection  " + className }>
				<div className="innerContent">
					<p className="header">SUNSETS ARE AWESOME</p>
					<p className="valuePropText">Dont miss another great sunset! <br/>
						View the sunset forecast for your area.
					</p>
					{ actionsSection }
					{ successText }
					{ errorDisplay }
				</div>
			</div>
		)
	}
};

const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
  
    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return currentValue;
        if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
};
