const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as myConstClass from './Constants';
import * as userActions from './redux/actions/user';
import * as sunsetActions from './redux/actions/sunset';

import Header from './Header';
import Notification from './Notification';
import HorizontalLayout from './HorizontalLayout';
import VerticalLayout from './VerticalLayout';

import checkImage from "./../assets/images/icons/check.png";
import clockImg from "./../assets/images/clock.png";
import thermometerImg from "./../assets/images/thermometer.png";
import pencilImg from "./../assets/images/pencil.png";
import changeTempImg from "./../assets/images/change-temp.png";

import qualityQuestionImg from "./../assets/images/question-orange.png";
import minimizeImg from "./../assets/images/minimize.png";
import compassImg from "./../assets/images/compass.png";
import ReactTooltip from 'react-tooltip';

import './../assets/css/app.css';
import './../assets/css/horizontal_header.css';
import './../assets/css/sunset_content.css';

const moment = require('moment');

export class SunsetContent extends Component {
	constructor(props) {
		super();
		this.state = { showFindSunsetButton: true, orientation: "horizontal", isLoadingSunset: false, isLoadingUser: false };
	}
	getPosition = () => {
	    // Simple Wrapper
	    return new Promise((res, rej) => {
	        navigator.geolocation.getCurrentPosition(res, rej);
	    });
	}
	findMySunset = () => {
	    if ("geolocation" in navigator) {
	        this.setState({ isLoadingSunset: true })
	        setTimeout(() => {
	            this.getPosition().then((position) => {
	                const lat = position.coords.latitude;
	                const long = position.coords.longitude;
	                console.log(lat, long)
	                this.props.fetchSunset(lat, long);
	                 setTimeout(() => {
	                    this.setState({ isLoadingSunset: false })
	                 }, 2000)
	            }).catch(function(rej) {
	                this.props.triggerLocationError();
	                this.setState({ isLoadingSunset: false })
	            }.bind(this))
	        }, 2000)
	    }
	}
	submitUser = (phoneNumber) => {
	    if ("geolocation" in navigator) {
	        this.setState({ isLoadingUser: true })
	        setTimeout(() => {
	            phoneNumber = phoneNumber.replace(/[^\d]/g, '')
	            const phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
	            const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
	            if (invalidPhoneNumber) {
	                this.props.invalidPhoneNumber();
	                this.setState({ isLoadingUser: false })
	            } else {
	                this.getPosition().then((position) => {
	                    const lat = position.coords.latitude;
	                    const long = position.coords.longitude;
	                    this.props.submitUser(phoneNumber, lat, long)
	                })
	            }
	         }, 800)
	    }
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
	toggleQualityInfo = () => {
		if (this.state.showQualityInfo) {
			this.setState({ showQualityInfo: false })
		} else {
			this.setState({ showQualityInfo: true })
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
	    return (<Notification closeNotification={ this.closeNotification }/>)
	}
	renderHorizontalLayout = () => {
		return (<HorizontalLayout changeOrientation={ this.changeOrientation } clearResults={ this.clearResults }
					showSignupForm={ this.showSignupForm } submitUser={ this.submitUser } isLoadingUser={ this.state.isLoadingUser }
					isLoadingSunset={ this.state.isLoadingSunset } findMySunset={ this.findMySunset }
		/>)
	}
	renderVerticalLayout = () => {
		return (<VerticalLayout changeOrientation={ this.changeOrientation } clearResults={ this.clearResults } />)
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
		if (this.state.orientation == myConstClass.HORIZONTAL || this.state.showMobile) {
			var content = this.renderHorizontalLayout();
		} else {
			var content = this.renderVerticalLayout();
		}
		var sunsetError = this.props.sunset.error || this.props.sunset.locationError;
		const { duplicatePhoneNumber, invalidPhoneNumber, submissionSuccess} = this.props.user;
		
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

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(SunsetContent)
