// LIBRARIES
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
const moment = require('moment');

// IMAGES
import sunFullImg from './../assets/images/sun-new.png';
import downIcon from './../assets/images/down-icon.png';
import profileImg from './../assets/images/profile-min.png';

// COMPONENTS
import ErrorDisplay from './ErrorDisplay';
import * as userActions from './redux/actions/user';

// CSS
import { css } from "@emotion/core";
import './../assets/css/results_section.css';


export class ResultsSection extends Component {
	constructor(props) {
		super();
		this.state = { showRubric: false, showSignupForm: false, phone: '', showDocs: false };
	}
	fetchBackground = () => {
		var quality = this.props.sunset.info.quality;
		switch (quality) {
			case "Poor":
				var className = "poorResult";
				break;
			case "Fair":
		    	var className = "fairResult";
				break;
			case "Good":
				var className = "goodResult";
				break;
			case "Great":
				var className = "greatResult";
				break;
		}
		return className;
	}
	showRubric = () => {
		this.setState({ showRubric: true, showSignupForm: false })
	}
	renderRubric = () =>  {
		var poorDescription = "Little to no color, with precipitation or a thick cloud layer often blocking a direct view of the sun.";
		var fairDescription = "Some color for a short time, with conditions ranging from mostly cloudy, or hazy, to clear, with little to no clouds at all levels.";
		var goodDescripton = "A fair amount of color, often multi-colored, lasting a considerable amount of time. Often caused by scattered clouds at multiple elvels.";
		var greatDescription = "Extremely vibrant color lasting 30 minutes or more. Often caused by multiple arrangements of clouds at multiple levels, transitioning through multiple stages of vivid color.";
		return (
			<div>
				<table className="rubricTable">
					<tr>
						<td data-th="Quality">Poor <br/>(0-25%)</td>
						<td data-th="Description">{ poorDescription }</td>
					</tr>
					<tr>
						<td data-th="Quality">Fair <br/>(25-50%)</td>
						<td data-th="Description">{ fairDescription }</td>
					</tr>
					<tr>
						<td data-th="Quality">Good <br/>(50-75%)</td>
						<td data-th="Description">{ goodDescripton }</td>
					</tr>
					<tr>
						<td data-th="Quality">Great <br/>(75-100%)</td>
						<td data-th="Description">{ greatDescription }</td>
					</tr>
				</table>
			</div>
		)
	}
	changeTemperature = (type) => {
		const sunset = this.props.sunset.info;
		if (sunset) {
			const celsius = Math.floor(sunset.temperature);
			const fahrenheit = Math.floor(( (9 * celsius) + 160 ) / 5)
			if (type == "F") {
			    this.setState({ showFahrenheit: true, temperature: fahrenheit })
			} else {
			    this.setState({ showFahrenheit: false, temperature: celsius })
			}
		}
	}
	goBack = () => {
		this.setState({ showRubric: false, showDocs: false })
		this.props.goBack()
	}
	showSignupForm = () => {
		this.setState({ showSignupForm: true })
	}
	renderSunsetSuccess = () => {
		var sunset = this.props.sunset.info;
	    if (this.state.showRandomSunset) {
	        var locationText = (
	            <p>{ this.state.city } Suns°et Forecast: </p>
	        )
	        var randomLocation = "randomLocation";
	        const offset = this.state.offset;
	        var momentTime = moment.utc(sunset.valid_at).utcOffset(offset).format("H:mm");
	    } else {
	        var momentTime = moment(sunset.valid_at).format("H:mm");
	    }
	    if (this.state.showFahrenheit) {
	    	var temperatureWidget = (
	    	    <a className="changeTemperatureLink link" onClick={ () => this.changeTemperature("C") }>F</a>
	    	) 
	    } else {
	        var temperatureWidget = (
	            <a className="changeTemperatureLink link" onClick={ () => this.changeTemperature("F") }>C</a>
	        ) 
	    }
	    if (this.state.temperature) {
	    	var temperature = this.state.temperature;
	    } else {
	    	var temperature = sunset.temperature;
	    }
	    if (!this.props.submissionSuccess && !this.state.showSignupForm) {
	    	var signUpButton = (
	    		<button className="successButton showMobile" onClick={ this.showSignupForm }>
	    			Sign Up For Daily SMS
	    		</button>
	    	)
	    }
		return (
			<div>
				<div className="resultsContainer">
					<p className="header">YOUR SUNSET:</p>
					<p className="mediumText time"><span>TIME</span>: { momentTime }</p>
					<p className="mediumText temperature"><span>TEMP</span>: { Math.floor(temperature) }° { temperatureWidget }</p>
					<p className="mediumText quality"><span>QUALITY</span>:
						<a className="detailsLink link" onClick={ this.showRubric }> { sunset.quality } ({ Math.floor(sunset.quality_percent) }%)</a>
					</p>
				</div>
				{ signUpButton }
			</div>
	    )
	}
	renderSunsetError() {
		return (
			<div className="fetchErrorText">
				<p>
					Sorry! We were not able to get your sunset forecast. 
				</p>
				<p>	Please refresh this page and try again. 
					Still no luck? Try again in 30 minutes.
				</p>
			</div>
		)
	}
	renderDocs() {
		return (
			<div className="docsContainer">
				<p className="headline">
					I found myself constantly wondering what the day’s sunset would be like. <br/>
					Should I head to the beach or stay at home?
				</p>
				<p className="text">
					Using the <a href="https://sunsetwx.com/" target="_blank">SunsetWx</a> API I created a simple way to find 
					this valuable information via the website or a daily text message (<a href="https://www.twilio.com/" target="_blank">Twilio</a>). 
					If you are curious, you can read about my design process while creating this. 
					<br/> Lastly, if you enjoy Sunsets Are Awesome, feel free to 
					<a className="donateLink" href="https://www.buymeacoffee.com/mayerseidman" target="_blank"> donate💰</a> to help keep it around.
				</p>
				<div className="bioSection">
					<div className="showMobile">
						<p>Howdy, I'm Mayer 👨‍🌾! I'm always down to connect-say hi.</p>
						<span className="links">
							<a href="https://mayerseidman.com" target="_blank">Portfolio</a>
							<a href="https://twitter.com/mayerseidman" target="_blank">Twitter</a>
							<a href="https://www.linkedin.com/in/mayer-seidman/" target="_blank">LinkedIn</a>
						</span>
					</div>
					<div className="hideMobile">
						<img src={ profileImg } alt="profile"/>
						<p className="text bioText">
							Hi, I’m Mayer! .........................talk about what im passionate 
							about............................connect with me, Id love to connect.
							<span className="links">
								<a href="https://mayerseidman.com" target="_blank">Portfolio</a>
								<a href="https://twitter.com/mayerseidman" target="_blank">Twitter</a>
								<a href="https://www.linkedin.com/in/mayer-seidman/" target="_blank">LinkedIn</a>
							</span>
						</p>
					</div>
				</div>
			</div>
		)
	}
	showDocs = () => {
		this.setState({ showDocs: true, showRubric: false, showSignupForm: false })
		this.props.showDocs();
	}
	renderNav() {
		var docsLink = <a className="docsLink" onClick={ this.showDocs }>DOCS</a>
		var backLink = (
			<a className="backLink" style={{ visibility: this.state.showRubric || this.state.showDocs ? "visible" : "hidden" }}
				onClick={ this.goBack }>BACK</a>
		)
		return (
			<div className="navbar">
				{ backLink }
				{ docsLink }
			</div>
		)
	}
	submitUser = () => {
		const phoneNumber = this.refs.phone_number.value;
		this.props.sendUser(phoneNumber);
	}
	renderLoadingBar = () => {
		var override = css`
		   height: 15px;
		   width: 100%;
		`
	    return (
	        <BarLoader css={ override } color={ "#bbb" } loading={ true } />
	    )
	}

	renderSubmitButton = () => {
		if (!this.props.sunset.sunsetSuccess) {
			var backLink = <a onClick={ this.showFindSunsetButton }>BACK</a>
		} else {
			var className = "linksContainerPlain";
		}
	    return (
	    	<div className={ "linksContainer "  + className }>
	    		{ backLink }
	    		<button onClick={ this.submitUser } className="successButton sendSunsets"
	    		    ref="submitBtn">Send Sunsets</button>
	    	</div>
	    )
	}
	handleChange = ({ target: { value } }) => {   
	    this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
	};
	showFullView = () => {
		this.setState({ showSignupForm: false })
		this.props.clearErrors()
	}
	renderSignUpForm() {
		if (this.state.showSignupForm && !this.props.user.submissionSuccess) {
			var isLoading = this.props.user.loading || this.props.loadingUser;
		    if (isLoading) {
		        var loadingBar = this.renderLoadingBar();
		    } else {
		        var submitButton = this.renderSubmitButton();
		    }
			var signUpForm = (
				<div className="formContainer">
					<div className="inputContainer">
						<label className="phoneNumberLabel">PHONE NUMBER</label>
						<input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
						    onChange={ this.handleChange } value={ this.state.phone } />
					</div>
				    { loadingBar }
				    { submitButton }
				</div>
			)
			return (
				<div>
					{ signUpForm }
				</div>
			)
		} else {
			return "";
		}
	}
	render() {
		var sunset = this.props.sunset;
		var sunsetInfo = sunset.info;
		var isLoadingSunset = sunset.loading || this.props.loadingSunset;

		if (isLoadingSunset) {
		    var sunClassName = "spin";
		}
		if (sunset.sunsetSuccess) {
			var className = this.fetchBackground()  + " fullView ";
			var resultsClassName = "resultsView ";
			if (this.state.showRubric) {
				var content = this.renderRubric();
			} else if (this.state.showDocs) {
				var content = this.renderDocs();
				var docsClassName = " docsView"
			} else {
				var content = this.renderSunsetSuccess();
			}
			if (this.state.showRubric) {
				resultsClassName = resultsClassName + " rubricView"
			}
			if (this.state.showSignupForm) {
				var showSignupFormClassName = " shortened ";
			}
		} else if (sunset.error) {
			var content = this.renderSunsetError();
			var className = "poorResult";
		} else {
			if (this.state.showDocs) {
				var className = " fullView docsView ";
				var content = this.renderDocs();
			} else {
				var sunsetImage = (
					<img className={ "sunImage " + sunClassName } src={ sunFullImg } alt=""
						onClick={ this.props.fetchSunset } />
				)
			}
		}
		const { duplicatePhoneNumber, errors, invalidPhoneNumber, submissionSuccess} = this.props.user;
		if (invalidPhoneNumber) {
			var type = "invalid";
		} else if (duplicatePhoneNumber) {
			var type = "duplicate";
		}
		if (invalidPhoneNumber  || duplicatePhoneNumber) {
			var errorDisplay = (<ErrorDisplay ref="errors" type={ type } errors={ errors } />)
		}
		if (this.state.showSignupForm) {
			var revealButton = (<img className="downButton" onClick={ this.showFullView }src={ downIcon } alt=""/>)
		} else {
			var classNameForm = "hideForm ";
		}
		if (this.state.showSignupForm && submissionSuccess) {
			var successNotification = (
				<p className="successText">
		    		Congrats 🎉! You signed up for a daily sunset SMS. Enjoy those sunset vibes!
		    	</p>
			)
		}
		var sunsetContent = (
			<div className={ "innerContent " + resultsClassName }>
				{ sunset && content }
				{ sunsetImage }
				{ revealButton }
			</div>
		)
	
		var content = (
			<div className="outerContainer">
				<div className={ "section resultsSection " + className + showSignupFormClassName + docsClassName }>
					{ this.renderNav() }
					{ sunsetContent }
				</div>
				<div className={ classNameForm + " formArea" }>
					{ this.renderSignUpForm() }
					{ this.state.showSignupForm && !submissionSuccess && errorDisplay }
					{ successNotification }
				</div>
			</div>
		)
		
		return (
			<div className="outerContainer">
				{ content }
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
}), { ...userActions })(ResultsSection)