const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Footer from './Footer';

import * as sunsetActions from './redux/actions/sunset';
// import * as userActions from './redux/actions/user';

import backArrow from "./../assets/images/back.png";

export class HorizontalLayout extends Component {
    constructor(props) {
        super(props);
        this.state = { showSignupForm: false, phone: "" };
    }
    componentDidUpdate(prevProps) {
    	if (prevProps.user.submissionSuccess !== this.props.user.submissionSuccess) {
    		this.setState({ phone: '' })
    	}
    }
    handleChange = ({ target: { value } }) => {   
        this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
    }
    showSignupForm = () => {
    	this.setState({ showSignupForm: true })
    }
    goBack = () => {
	    this.setState({ showSignupForm: false })
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
    render() {
		var isLoading = this.props.user.loading || this.props.isLoadingUser;
	    if (isLoading  && !this.props.user.duplicatePhoneNumber) {
	        var loadingBar = this.renderLoadingBar();
	    } else {
	        var submitButton = <button className="actionBtn send" onClick={ this.props.submitUser.bind(this, this.refs.phone_number ? this.refs.phone_number.value : "") }>Send Daily SMS</button>
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
		return (
			<div className={ "horizontalWrapper " + bgClassName }>
				<div className={ className }> 
					<Header changeOrientation={ this.props.changeOrientation } clearResults={ this.props.clearResults } />
					{ pageContent }
					<Footer />
				</div>
			</div>
		)
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions })(HorizontalLayout)

const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
  
    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return currentValue;
        if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
}
