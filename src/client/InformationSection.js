import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
import ErrorDisplay from './ErrorDisplay';
import './../assets/css/information_section.css';
import { css } from "@emotion/core";
import * as userActions from './redux/actions/user';

export class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = { showSignupForm: false, showFindSunsetButton: true, phone: '' };
	}

	componentDidUpdate(prevProps) {
		if (prevProps.user.submissionSuccess !== this.props.user.submissionSuccess) {
			this.setState({ phone: '' })
		}
	}

	showSignupForm = () => {
		this.setState({ showSignupForm: true })
	}

	showFindSunsetButton = () =>  {
		this.setState({ showSignupForm: false, showFindSunsetButton: true })
		this.props.clearErrors()
	}

	handleChange = ({ target: { value } }) => {   
	    this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
	};

	submitUser = () => {
		const phoneNumber = this.refs.phone_number.value;
		this.props.sendUser(phoneNumber);
	}

	renderLoadingBar = () => {
		var override = css`
		   height: 12px;
		   display: inline-block;
		   width: 47%;
		   margin-left: 7%;
		   vertical-align; middle;
		`
	    return (
	        <BarLoader css={ override } color={ "#bbb" } loading={ true } />
	    )
	}

	renderSubmitButton = () => {
		if (!this.props.sunset.sunsetSuccess) {
			var backLink = <a onClick={ this.showFindSunsetButton }>BACK</a>
		}
		// if (!this.props.sunset.sunsetSuccess) {
			
		// } else {
		// 	var className = "linksContainerPlain";
		// }
	    return (
	    	<div className="linksContainer ">
	    		{ backLink }
	    		<button onClick={ this.submitUser } className="successButton sendSunsets"
	    		    ref="submitBtn">Send Sunsets</button>
	    	</div>
	    )
	}

	renderActionsSection = () => {
		var isLoading = this.props.user.loading || this.props.loadingUser;
	    if (isLoading) {
	        var loadingBar = this.renderLoadingBar();
	    } else {
	        var submitButton = this.renderSubmitButton();
	    }
		if (this.state.showSignupForm && !this.props.user.submissionSuccess) {
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
		} else {
			if (this.props.sunset.sunsetSuccess && !this.props.user.submissionSuccess) {
				var sunsetButton = (
					<button onClick={ this.showSignupForm } className="signupButton successButton">Sign Up For Daily SMS</button>
				)
			} else {
				if (this.props.user.submissionSuccess) {
					var className = "extraWide"
				}
				if (!this.props.sunset.sunsetSuccess) {
					var sunsetButton = (
						<button onClick={ this.props.findMySunset } className={ "findSunsetButton successButton " + className }>Find My Sunset</button>
					)
				}
				if (!this.props.user.submissionSuccess) {
					var signupAction = (
						<a className="signupLink link" onClick={ this.showSignupForm }>Sign Up For Daily SMS</a>
					)
				}
			}
			return (
				<div>
					{ sunsetButton }
					{ signupAction }
				</div>
			)
		}
	}
	render() {
		var sunset = this.props.sunset;
		const { duplicatePhoneNumber, errors, invalidPhoneNumber, submissionSuccess} = this.props.user;
		if (invalidPhoneNumber) {
			var type = "invalid";
		} else if (duplicatePhoneNumber) {
			var type = "duplicate";
		} 
		if (sunset.sunsetSuccess || this.props.showDocs) {
			var className = "hideInformationSection";
		}
		var actionsSection = this.renderActionsSection();

		if (this.state.showSignupForm && submissionSuccess) {
			var successNotification = (
				<p className="successNotification">
		    		Congrats 🎉! You signed up for a daily sunset SMS. Enjoy those sunset vibes!
		    	</p>
			)
		}
		if (sunset.sunsetSuccess && submissionSuccess) {
			var successNotification = (
				<p className="notificationText successText">
		    		Congrats 🎉! You signed up for a daily sunset SMS. Enjoy those sunset vibes!
		    	</p>
			)
		}
		if (invalidPhoneNumber  || duplicatePhoneNumber) {
			var errorDisplay = (<ErrorDisplay ref="errors" type={ type } errors={ errors } />)
		}
		return (
			<div className={ "section informationSection  " + className }>
				<div className="innerContent">
					<p className="header">SUNSETS ARE AWESOME</p>
					<p className="valuePropText">Dont miss another great sunset! <br/>
						View the sunset forecast for your area.
					</p>
					{ actionsSection }
					{ successNotification }
					{ this.state.showSignupForm && !submissionSuccess && errorDisplay }
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

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...userActions })(InformationSection)
