import React, { Component } from 'react';
import { connect } from 'react-redux';
import BarLoader from "react-spinners/BarLoader";
import ErrorDisplay from './ErrorDisplay';
import './../assets/css/horizontal_header.css';
import './../assets/css/information_section.css';
import { css } from "@emotion/core";
import * as userActions from './redux/actions/user';
import * as sunsetActions from './redux/actions/sunset';

import checkImage from "./../assets/images/icons/check.png";
import errorImage from "./../assets/images/icons/error.png";
import clockImg from "./../assets/images/clock.png";
import thermometerImg from "./../assets/images/thermometer.png";
import pencilImg from "./../assets/images/pencil.png";
import changeTempImg from "./../assets/images/change-temp.png";

import chevronImage from "./../assets/images/icons/chevron.png";
import qualityQuestionImg from "./../assets/images/question-orange.png";
import minimizeImg from "./../assets/images/minimize.png";
import compassImg from "./../assets/images/compass.png";
import backArrow from "./../assets/images/back.png";
import avatar from "./../assets/images/profile.png";
import colorAvatar from "./../assets/images/color-profile.png";
import verticalIcon from "./../assets/images/vertical-control.png";
import horizontalIcon from "./../assets/images/horizontal-control.png";
import ReactTooltip from 'react-tooltip';
const moment = require('moment');

export class InformationSection extends Component {
	constructor(props) {
		super();
		this.state = { showSignupForm: false, showFindSunsetButton: true, phone: '', orientation: "horizontal" };
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
	    return (
	    	<span className="loadingContainer">
	    		<button className="loadingBar">
	    			<span className="progressBar"></span>
	    		</button>
	    		<span className="horizontalText">🤙 Hang loose and hang tight...</span>
	    	</span>
	    )
	}
	renderLoadingBarVertical = () => {
		if (this.props.isLoadingSunset) {
			var className = "loadingSunset";
		}
		return (
			<span className={ "loadingContainer " + className }>
				<span className="text">🤙 Hang loose and hang tight</span><span class="loading"></span>
			</span>
		)
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

	// renderSubmitButton = () => {
	// 	if (!this.props.sunset.sunsetSuccess) {
	// 		var backLink = <a onClick={ this.showFindSunsetButton }>BACK</a>
	// 	}
	//     return (
	//     	<div className="linksContainer ">
	//     		{ backLink }
	//     		<button onClick={ this.submitUser } className="successButton sendSunsets"
	//     		    ref="submitBtn">Send Sunsets</button>
	//     	</div>
	//     )
	// }

	// renderActionsSection = () => {
	// 	var isLoading = this.props.user.loading || this.props.loadingUser;
	//     if (isLoading  && !this.props.user.duplicatePhoneNumber) {
	//         var loadingBar = this.renderLoadingBar();
	//     } else {
	//         var submitButton = this.renderSubmitButton();
	//     }
	// 	if (this.state.showSignupForm && !this.props.user.submissionSuccess) {
	// 		return (
	// 			<div className="actionsContainer">
	// 				<div className="inputContainer">
	// 					<label className="phoneNumberLabel">PHONE NUMBER</label>
	// 					<input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
	// 					    onChange={ this.handleChange } value={ this.state.phone } />
	// 				</div>
	// 			    { loadingBar }
	// 			    { submitButton }
	// 			</div>
	// 		)	
	// 	} else {
	// 		if (this.props.sunset.sunsetSuccess && !this.props.user.submissionSuccess) {
	// 			var sunsetButton = (
	// 				<button onClick={ this.showSignupForm } className="signupButton successButton">Sign Up For Daily SMS</button>
	// 			)
	// 		} else {
	// 			if (this.props.user.submissionSuccess) {
	// 				var className = "extraWide"
	// 			}
	// 			if (!this.props.sunset.sunsetSuccess) {
	// 				var sunsetButton = (
	// 					<button onClick={ this.props.findMySunset } className={ "findSunsetButton successButton " + className }>Find My Sunset</button>
	// 				)
	// 			}
	// 			if (!this.props.user.submissionSuccess) {
	// 				var signupAction = (
	// 					<a className="signupLink link" onClick={ this.showSignupForm }>Sign Up For Daily SMS</a>
	// 				)
	// 			}
	// 		}
	// 		return (
	// 			<div>
	// 				{ sunsetButton }
	// 				{ signupAction }
	// 			</div>
	// 		)
	// 	}
	// }

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
	toggleQualityInfo = () => {
		if (this.state.showQualityInfo) {
			this.setState({ showQualityInfo: false })
			// setTimeout(() => {
				
			// }, 250)
		} else {
			// setTimeout(() => {
				this.setState({ showQualityInfo: true })
			// }, 250)
		}
	}
	renderQualityInfo = () => {
		var quality = this.props.sunset.info.quality;
		if (quality == "Poor") {
			var info = "Little to no color, with precipitation or a thick cloud layer often blocking a direct view of the sun.";
		} else if (quality == "Fair") {
			var info = "Some color for a short time, with conditions ranging from mostly cloudy, or hazy, to clear, with little to no clouds at all levels.";
		} else if (quality == "Good") {
			var info = "A fair amount of color, often multi-colored, lasting a considerable amount of time. Often caused by scattered clouds at multiple elvels.";
		} else if (quality == "Great") {
			var info = "Extremely vibrant color lasting 30 minutes or more. Often caused by multiple arrangements of clouds at multiple levels, transitioning through multiple stages of vivid color.";
		}
		return <p className="qualityInfo">{info}</p>
	}
	goBack = () => {
	    this.setState({ showSignupForm: false })
	}
	closeNotification = () => {
		this.props.clearNotification();
	}
	clearResults = () => {
		this.props.clearSunsetResults();
	}
	changeOrientation = (orientation) => {
		this.setState({ orientation: orientation })
	}
	renderNotification = () => {
		var sunset = this.props.sunset;
		var user = this.props.user;
		if (sunset.error) {
			var notificationStatus = "Forecast Error 👎";
			var notificationText = "We weren't able to get your sunset forecast. Please refresh this page and try again. Still no luck? Try again in 30 minutes.";
		} else if (sunset.locationError) {
			var notificationStatus = "Location Error 🧭";
			var notificationText = "Please turn on your location permissions so we can get your sunset forecast.";
		} else if (user.duplicatePhoneNumber || user.invalidPhoneNumber) {
			var notificationStatus = "Phone Number Error ☎️";
			var notificationText = this.props.user.errors[0];
		} else if (this.props.user.submissionSuccess) {
			var notificationStatus = "Signed Up 🎉";
			var notificationText = "You are now signed up for a daily sunset SMS. Enjoy those sunset vibes!";
		}
		if (this.props.user.submissionSuccess) {
			var image = <img className="check" src={ checkImage } />;
			var dividingLine = <span className="line"></span>;
		} else {
			var image = <img className="check" src={ errorImage } />;
			var dividingLine = <span className="line error"></span>;
		}
        var notificationContainer = (
            <div className="notificationContainer">
        		{ dividingLine }
                { image }
                <div className="notificationText">
                    <p className="status">{ notificationStatus }</p><span className="escape" onClick={ this.closeNotification }>X</span>
                    <p className="text">{ notificationText }</p>
                </div>
            </div>
        )
	    return notificationContainer;
	}
	renderHeader = () => {
		var horizontalButton = (
			<button type="button" id="horizontal-screen" onClick={ this.changeOrientation.bind(this, HORIZONTAL) }>
			    <span data-tip="Horizontal Layout">
			        <img src={ horizontalIcon } alt="horizontal" className="horizontal-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		var verticalButton = (
			<button type="button" id="vertical-screen" onClick={ this.changeOrientation.bind(this, VERTICAL) }>
			    <span data-tip="Vertical Layout">
			        <img src={ verticalIcon } alt="vertical" className="vertical-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		if (this.props.sunset.sunsetSuccess && this.props.sunset.showSunsetResults) {
			var backLink = (
				<span>
		    		<img className="backLink" src={ chevronImage } onClick={ this.clearResults } data-tip="Go Back"/>
			    	<ReactTooltip />
				</span>
			)
		}
		return (
			<header id="header">
			    <div className="made-by">
			    	<a href="http://mayerseidman.com" target="_blank">
			    		<span>Made By</span>
			    		<img className="avatar" src={ colorAvatar } />
			    	</a>
		    		{ backLink }
			    </div>
			    <div className="screen-orientation">
			    	{ verticalButton }
			        { horizontalButton }
			    </div>
			</header>
		)
	}
	renderHorizontal = () => {
		// ERROR HANDLING should go between landing and "actions"
		var isLoading = this.props.user.loading || this.props.isLoadingUser;
	    if (isLoading  && !this.props.user.duplicatePhoneNumber) {
	        var loadingBar = this.renderLoadingBar();
	    } else {
	        var submitButton = <button className="actionBtn send" onClick={ this.submitUser }>Send Daily SMS</button>
	    }
		if (this.props.isLoadingSunset) {
			var loadingBar = this.renderLoadingBar();
			} else {
			var findSunsetButton = (
				<button className="actionBtn findSunset" onClick={ this.props.findMySunset }>Find My Sunset</button>
			)
		}
		if (this.state.showSignupForm && !this.props.user.submissionSuccess) {
			var phoneNumber = <span className="phoneNumberLabel">PHONE NUMBER</span>
			var backLink = (
				<a className="backLink" onClick={ this.goBack }><img src={ backArrow } /></a>
			)
			var buttons = (
				<div className="formContainer">
					{ backLink }
					<input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
					    onChange={ this.handleChange } value={ this.state.phone } />
				    { loadingBar }
				    { submitButton }
				</div>
			)
		} else {
			var buttons = (
				<div>
					{ findSunsetButton }
					{ loadingBar }
					<button className="actionBtn signUp" onClick={ this.showSignupForm }>Sign  Up For Daily SMS</button>
				</div>
			)
		}
		var sunset = this.props.sunset;
		if (sunset.sunsetSuccess && this.props.sunset.showSunsetResults) {
			var bgClassName = this.fetchBackground();
			var className = "results";
			var momentTime = moment(sunset.valid_at).format('LT');
			if (this.state.showFahrenheit) {
				var temperatureWidget = (
					<img className="control" src={ changeTempImg } onClick={ () => this.changeTemperature("C") } data-tip="Change to Celsius" />
				) 
			} else {
			    var temperatureWidget = (
			        <img className="control" src={ changeTempImg } onClick={ () => this.changeTemperature("F") } data-tip="Change to Fahrenheit" />
			    ) 
			}
		    if (this.state.temperature) {
		    	var temperature = this.state.temperature;
		    } else {
		    	if (sunset.lat < 49) {
					this.changeTemperature("F")
				}
		    	var temperature = sunset.info.temperature;
		    }
		    if (this.state.showQualityInfo) {
		    	var qualityClass = " expanded";
		    	var qualityImg = (
		    		<img className="control" src={ minimizeImg } onClick={ this.toggleQualityInfo } data-tip="Close" />
		    	)
		    	var qualityInfo = this.renderQualityInfo();
		    } else {
		    	var quality = sunset.info.quality.toLocaleLowerCase()
		    	var qualityImg = (
		    		<img className="control" src={ qualityQuestionImg } onClick={ this.toggleQualityInfo } data-tip={ 'What does ' + quality + ' mean?' } />
		    	)
		    }
		    
			var pageContent = (
			    <div className="landing">
			        <div className="intro">
			            <h1>YOUR SUNSET FORECAST</h1>
			            <h1 className="mobileHeader">YOUR SUNSET</h1>
			        </div>
			        <div className="card first">
			        	<div className="circle"><img src={ clockImg } /></div>
			        	<div className="inner">
			        		<p className="header">TIME</p>
			        		<span className="value">{ momentTime }</span>
			        	</div>
			        </div>
			        <div className="card">
			        	<div className="circle"><img src={ thermometerImg } /></div>
			        	<div className="inner">
			        		<p className="header">TEMP</p>
			        		<span className="value temp">{ Math.floor(temperature) }°</span>
			        		{ temperatureWidget }
			        	</div>
			        	<ReactTooltip />
			        </div>
			        <div className={ "card " + qualityClass }>
			        	<div className="circle"><img src={ pencilImg } /></div>
			        	<div className="inner">
			        		<p className="header">QUALITY</p>
			        		<span className="value quality">{ sunset.info.quality } ({ Math.floor(sunset.info.quality_percent) }%)</span>
			       			{ qualityImg }
			       			{ qualityInfo }
			        	</div>
			        	<ReactTooltip />
			        </div>
			    </div>
			)
		} else {
			var pageContent = (
			    <div className="landing">
			        <div className="intro">
			            <h1>SUNSETS ARE AWESOME</h1>
			            <span className="subHeader regular">Dont miss another great sunset! View the sunset forecast for your area.</span>
			             <span className="subHeader mobile">Dont miss another great sunset! View your sunset forecast.</span>
			        </div>
			        <div className="actions">
			        	{ buttons }
			        </div>
			    </div>
			)
		}


		// var type = "duplicate";
		// var type = "invalid";
		// if (invalidPhoneNumber  || duplicatePhoneNumber) {
		// 	var errorDisplay = (<ErrorDisplay ref="errors" type={ type } errors={ errors } />)
		// }
		
		var sunsWave = (
		    <footer id="footer">
		        <div className="animation"></div>
		    </footer>
		)
		return (
			<div className={ "horizontalWrapper " + bgClassName }>
				<div className={ className }> 
					{ this.renderHeader() }
					{ pageContent }
					{ sunsWave }
				</div>
			</div>
		)
	}
	renderVertical = () => {
		var isLoading = this.props.user.loading || this.props.isLoadingUser;
	    if (isLoading  && !this.props.user.duplicatePhoneNumber) {
	        var loadingBar = this.renderLoadingBarVertical();
	    } else {
	        var submitButton = <button className="send" onClick={ this.submitUser }>Send Daily SMS</button>
	    }
		if (this.props.isLoadingSunset) {
			var loadingBar = this.renderLoadingBarVertical();
			} else {
			var findSunsetButton = (
				<button className="actionBtn" onClick={ this.props.findMySunset }>Find My Sunset</button>
			)
		}
		if (this.state.showSignupForm && !this.props.user.submissionSuccess) {
			var phoneNumber = <span className="phoneNumberLabel">PHONE NUMBER</span>
			var backLink = (
				<a className="backLink" onClick={ this.goBack }><img src={ backArrow } /></a>
			)
			var buttons = (
				<div className="formContainer">
					{ backLink }
					<input type="text" className="phone" ref="phone_number" placeholder="(123) 456-7890"
					    onChange={ this.handleChange } value={ this.state.phone } />
				    { loadingBar }
				    { submitButton }
				</div>
			)
		} else {
			var buttons = (
				<div>
					{ findSunsetButton }
					{ loadingBar }
					<button className="signUp actionBtn" onClick={ this.showSignupForm }>Sign  Up For Daily SMS</button>
				</div>
			)
		}
		var sunset = this.props.sunset;
		var horizontalButton = (
			<button type="button" id="horizontal-screen" onClick={ this.changeOrientation.bind(this, HORIZONTAL) }>
			    <span data-tip="Horizontal Layout">
			        <img src={ horizontalIcon } alt="horizontal" className="horizontal-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		var verticalButton = (
			<button type="button" id="vertical-screen" onClick={ this.changeOrientation.bind(this, VERTICAL) }>
			    <span data-tip="Vertical Layout">
			        <img src={ verticalIcon } alt="vertical" className="vertical-icon" />
			    </span>
			    <ReactTooltip />
			</button>
		)
		var header = (
			<header id="header">
			    <div className="screen-orientation">
			    	{ verticalButton }
			        { horizontalButton }
			    </div>
			</header>
		)
		var pageContent = (
		    <div className="landing">
		        <div className="intro">
		            <h1>SUNSETS ARE AWESOME</h1>
		            <span>Dont miss another great sunset! View the sunset forecast for your area.</span>
		        </div>
		        <div className="actions">
		            { buttons }
		        </div>
		    </div>
		)
		var sunsWave = (
		    <footer id="footer">
		        <div className="animation"></div>
		    </footer>
		)
		var sunset = this.props.sunset;
		if (sunset.sunsetSuccess && this.props.sunset.showSunsetResults) {
			var bgClassName = this.fetchBackground();
			var className = "results";
			var momentTime = moment(sunset.valid_at).format('LT');
			if (this.state.showFahrenheit) {
				var temperatureWidget = (
					<img className="control" src={ changeTempImg } onClick={ () => this.changeTemperature("C") } data-tip="Change to Celsius" />
				) 
			} else {
			    var temperatureWidget = (
			        <img className="control" src={ changeTempImg } onClick={ () => this.changeTemperature("F") } data-tip="Change to Fahrenheit" />
			    ) 
			}
		    if (this.state.temperature) {
		    	var temperature = this.state.temperature;
		    } else {
		    	if (sunset.lat < 49) {
					this.changeTemperature("F")
				}
		    	var temperature = sunset.info.temperature;
		    }
		    if (this.state.showQualityInfo) {
		    	var qualityClass = " expanded";
		    	var qualityImg = (
		    		<img className="control" src={ minimizeImg } onClick={ this.toggleQualityInfo } data-tip="Close" />
		    	)
		    	var qualityInfo = this.renderQualityInfo();
		    } else {
		    	var quality = sunset.info.quality.toLocaleLowerCase()
		    	var qualityImg = (
		    		<img className="control" src={ qualityQuestionImg } onClick={ this.toggleQualityInfo } data-tip={ 'What does ' + quality + ' mean?' } />
		    	)
		    }
		    
			var pageContent = (
			    <div className="landing">
			        <div className="intro">
			            <h1>YOUR SUNSET</h1>
			        </div>
			        <div className="card first">
			        	<div className="circle"><img src={ clockImg } /></div>
			        	<div className="inner">
			        		<p className="header">TIME</p>
			        		<span className="value">{ momentTime }</span>
			        	</div>
			        </div>
			        <div className="card">
			        	<div className="circle"><img src={ thermometerImg } /></div>
			        	<div className="inner">
			        		<p className="header">TEMP</p>
			        		<span className="value temp">{ Math.floor(temperature) }°</span>
			        		{ temperatureWidget }
			        	</div>
			        	<ReactTooltip />
			        </div>
			        <div className={ "card " + qualityClass }>
			        	<div className="circle"><img src={ pencilImg } /></div>
			        	<div className="inner">
			        		<p className="header">QUALITY</p>
			        		<span className="value quality">{ sunset.info.quality } ({ Math.floor(sunset.info.quality_percent) }%)</span>
			       			{ qualityImg }
			       			{ qualityInfo }
			        	</div>
			        	<ReactTooltip />
			        </div>
			    </div>
			)
		} else {
			var pageContent = (
			    <div className="landing">
			        <div className="intro">
			            <h1>SUNSETS ARE AWESOME</h1>
			            <span className="subHeader">Dont miss another great sunset! View the sunset forecast for your area.</span>
			        </div>
			        <div className="actions">
			        	{ buttons }
			        </div>
			    </div>
			)
		}
		return (
			<div className={ "verticalWrapper " + bgClassName }>
				<div className={ "column " + className }>
					{ this.renderHeader() }
					{ pageContent }
				</div>
				<div className="column">{ sunsWave }</div>
			</div>
		)
	}
	resizeScreen = () => {
		if (window.innerWidth < 700) {
		    this.setState({ showMobile: true });
		} else {
			this.setState({ showMobile: false });
		}
	}
	componentDidMount = () => {
		window.addEventListener("resize", this.resizeScreen.bind(this));
	}
	render() {
		// Create separate horizontal and vertical layout components and pass them in below...
		if (this.state.orientation == HORIZONTAL || this.state.showMobile) {
			var content = this.renderHorizontal();
		} else {
			var content = this.renderVertical();
		}
		var orientation = this.state.orientation;
		var sunsetError = this.props.sunset.error || this.props.sunset.locationError;
		const { duplicatePhoneNumber, invalidPhoneNumber, submissionSuccess} = this.props.user;
		const sunsetSuccess = this.props.sunset.sunsetSuccess;
		const requiresNotification = duplicatePhoneNumber || invalidPhoneNumber || submissionSuccess || sunsetError;
		if (requiresNotification && this.props.user.showNotification || this.props.sunset.showNotification) {
			var notification = this.renderNotification();
		}
		return (
			<div>
				{ content }
				{ notification }
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
}), { ...sunsetActions, ...userActions })(InformationSection)
