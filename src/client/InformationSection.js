import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
import ErrorDisplay from './ErrorDisplay';
import './../assets/css/horizontal_header.css';
import './../assets/css/information_section.css';
import { css } from "@emotion/core";
import * as userActions from './redux/actions/user';

import avatar from "./../assets/images/profile.png";
import colorAvatar from "./../assets/images/color-profile.png";
import verticalIcon from "./../assets/images/vertical-control.png";
import horizontalIcon from "./../assets/images/horizontal-control.png";
import ReactTooltip from 'react-tooltip';

export class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = { showSignupForm: false, showFindSunsetButton: true, phone: '', orientation: "vertical" };
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
		   width: 44%;
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
	    if (isLoading  && !this.props.user.duplicatePhoneNumber) {
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
	changeOrientation = () => {
		if (this.state.orientation === VERTICAL) {
			this.setState({ orientation: "horizontal" })
		} else {
			this.setState({ orientation: VERTICAL })
		}
	}
	renderHorizontal = () => {
		var horizontalButton = (
			<button type="button" id="horizontal-screen">
			    <span data-tip="Horizontal Layout">
			        <img src={ horizontalIcon } alt="horizontal" className="horizontal-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		var verticalButton = (
			<button type="button" id="vertical-screen">
			    <span data-tip="Vertical Layout">
			        <img src={ verticalIcon } alt="vertical" className="vertical-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		var header = (
			<header id="header">
			    <div className="made-by">
			    	<a href="http://mayerseidman.com" target="_blank">
			    		<span>Made By</span>
			    		<img src={ avatar } />
			    		<img src={ colorAvatar } />
			    	</a>
			    </div>
			    <div className="screen-orientation">
			    	{ verticalButton }
			        { horizontalButton }
			    </div>
			</header>
		)
		// ERROR HANDLING goes between landing and "actions"
		var pageContent = (
		    <div className="landing">
		        <div className="intro">
		            <h1>SUNSETS ARE AWESOME</h1>
		            <span>Dont miss another great sunset! View the sunset forecast for your area.</span>
		        </div>
		        <div className="actions">
		            <button>Find My Sunset</button>
		            <button>Sign  Up For Daily SMS</button>
		        </div>
		    </div>
		)
		var sunsWave = (
		    <footer id="footer">
		        <div className="animation"></div>
		    </footer>
		)
		return (
			<div className="horizontalContainer">
				{ header }
				{ pageContent }
				{ sunsWave }
			</div>
		)
	}
	renderVertical = () => {
		return (
			<div className="verticalContainer">
			</div>
		)
	}
	render() {
		if (this.state.orientation == HORIZONTAL) {
			var content = this.renderHorizontal()
		} else {
			var content = this.renderVertical()
		}
		var orientation = this.state.orientation;
		return (
			<div className="wrapper">
				{ content }
				<a href="#" onClick={ this.changeOrientation }>Turn me vertical</a>
			</div>
		)
	}
};

var HORIZONTAL = "horizontal";
var VERTICAL = "vertical";

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
