// LIBRARIES
const _ = require('underscore');
const moment = require('moment');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import InformationSection from "./InformationSection";
import ResultsSection from "./ResultsSection";

// CSS 
import { css } from "@emotion/core";
import './../css/app.css';

// REDUX ACTIONS 
import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

export class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { loadingSunset: false, loadingUser: false };
    }
    getPosition() {
        // Simple Wrapper
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    }

    findMySunset = () => {
        if ("geolocation" in navigator) {
            this.setState({ loadingSunset: true })
            setTimeout(() => {
                this.getPosition().then((position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    this.props.fetchSunset(lat, long);
                })
            }, 2000)
        }
    }

    submitUser = (phoneNumber) => {
        if ("geolocation" in navigator) {
            this.setState({ loadingUser: true })
            setTimeout(() => {
                phoneNumber = phoneNumber.replace(/[^\d]/g, '')
                const phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
                const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
                if (invalidPhoneNumber) {
                    this.props.invalidPhoneNumber();
                    this.setState({ loadingUser: false })
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

    render() {
        return (
            <div className="sunsetContainer">
                <InformationSection 
                    findMySunset={ this.findMySunset } 
                    sendUser={ this.submitUser }
                    loadingUser={ this.state.loadingUser } />
                <ResultsSection
                    fetchSunset={ this.findMySunset }
                    loadingSunset={ this.state.loadingSunset }
                    sendUser={ this.submitUser }
                    loadingUser={ this.state.loadingUser }
                    submissionSuccess={ this.props.user.submissionSuccess } />
                <div className="bottomSection"></div>
            </div>
        );
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(SunsetTracker)
