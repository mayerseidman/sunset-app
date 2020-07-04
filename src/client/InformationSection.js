import React, { Component } from 'react';
import BarLoader from "react-spinners/BarLoader";
import './../css/information_section.css';
import { css } from "@emotion/core";

export default class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = { showSignupForm: false };
	}

	showSignupForm = () => {
		this.setState({ showSignupForm: true })
	}

	handleChange = ({ target: { value } }) => {   
	    this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
	};

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
	        <button onClick={ this.props.submitUser } className="submitButton"
	            ref="submitBtn">Send Sunsets</button>
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
					    <label className="phoneNumberLabel">Phone Number</label>
					    <input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
					        onChange={ this.handleChange } value={ this.state.phone } />
					    { loadingBar }
					    { submitButton }
					</div>
				)	
			}
		} else {
			return (
				<div>
					<button onClick={ this.props.findMySunset } className="findSunsetButton">Find My Sunset</button>
					<a className="signupLink link" onClick={ this.showSignupForm }>Sign Up For Daily SMS</a>
				</div>
			)
		}
	}

	render() {
		if (this.props.hideInformationView) {
			var className = "hideInformationView"
		}
		var actionsSection = this.renderActionsSection();

		return (
			<div className={ "section informationSection  " + className }>
				<div className="innerContent">
					<p className="header">SUNSETS ARE AWESOME</p>
					<p className="valuePropText">Dont miss another great sunset! <br/>
						View the sunset forecast for your area.
					</p>
					{ actionsSection }
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
