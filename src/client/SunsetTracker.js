// LIBRARIES
const _ = require('underscore');
const moment = require('moment');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ErrorDisplay from './ErrorDisplay';
import InformationSection from "./InformationSection";
import ResultsSection from "./ResultsSection";
import BarLoader from "react-spinners/BarLoader";

// IMAGES 
import sunInnerImage from './../images/sun-inner.png';
import sunOuterImage from './../images/sun-outer-shell.png';
import sunFullImage from './../images/sun-full.png';
import sunsetInfoImage from './../images/sunset-info.png';

// CSS 
import { css } from "@emotion/core";
import './../css/app.css';

// REDUX ACTIONS 
import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

export class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            submissionSuccess: false, spin: false, 
            fetchingError: false, loading: false, 
            hideInformationView: false
         };
    }
    getPosition() {
        // Simple Wrapper
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    }

    findMySunset = () => {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            // this.setState({ loadingSunset: true })
            // this.setState({ loading: true })
            this.getPosition().then((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                this.props.fetchSunset(lat, long)
                // this.setState({ loading: false })
                // hideInformationView: true 
            })
        }
    }

    submitUser = (phoneNumber) => {
        if ("geolocation" in navigator) {
            phoneNumber = phoneNumber.replace(/[^\d]/g, '')
            const phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
            const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
            if (invalidPhoneNumber) {
                this.props.invalidPhoneNumber();
            } else {
                this.getPosition().then((position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    this.props.submitUser(phoneNumber, lat, long)
                })
            }
        }
    }

    render() {
        return (
            <div className="sunsetContainer">
                <InformationSection 
                    findMySunset={ this.findMySunset } 
                    submitUser={ this.submitUser } />
                <ResultsSection />
                <div className="bottomSection"></div>
            </div>
        );
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(SunsetTracker)
