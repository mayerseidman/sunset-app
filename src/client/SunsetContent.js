const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import * as myConstClass from './Constants';
import * as userActions from './redux/actions/user';
import * as sunsetActions from './redux/actions/sunset';

import Header from './Header';
import Notification from './Notification';
import HorizontalLayout from './HorizontalLayout';
import VerticalLayout from './VerticalLayout';

import './../assets/css/app.css';
import './../assets/css/horizontal_header.css';

export class SunsetContent extends Component {
	constructor(props) {
		super();
		this.state = { showFindSunsetButton: true, orientation: "horizontal", isLoadingSunset: false, isLoadingUser: false };
	}
	getPosition = () => {
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
