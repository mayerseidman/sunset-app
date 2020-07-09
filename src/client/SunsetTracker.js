// LIBRARIES //
const _ = require('underscore');
const moment = require('moment');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ErrorDisplay from './ErrorDisplay';
import InformationSection from "./InformationSection";
import ResultsSection from "./ResultsSection";
import BarLoader from "react-spinners/BarLoader";

// IMAGES //
import sunInnerImage from './../images/sun-inner.png';
import sunOuterImage from './../images/sun-outer-shell.png';
import sunFullImage from './../images/sun-full.png';
import sunsetInfoImage from './../images/sunset-info.png';

// CSS //
import { css } from "@emotion/core";
import './../css/app.css';

import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

export class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { imgName: null, submissionSuccess: false, spin: false, 
            fetchingError: false, loading: false, hideInformationView: false, showFullView: false
         };
    }
    getPosition() {
        // Simple wrapper
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
            })
        }
    }
    // fetchSunset(lat, long) { 
    //     fetch("/api/fetch-sunset", {
    //         method: 'POST',
    //         body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
    //         headers: new Headers({ "Content-Type": "application/json" }) // add headers
    //     }).then((response) => {
    //         if (!response.ok) {
    //             setTimeout(function(){
    //                 this.setState({ loadingSunset: false, fetchingError: true })
    //              }.bind(this), 2000)
    //         } else {
    //             return response.json();
    //         }
    //     }).then((sunset) => {
    //         var sunset = sunset.sunset;
    //         setTimeout(function(){
    //             this.setState({ 
    //                 loadingSunset: false,
    //                 hideInformationView: true 
    //             })
    //         }.bind(this), 2000)
    //     })
    // }

    submitUser = (phoneNumber) => {
         /* geolocation is available */
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

    showRandomSunset() {
        if (this.state.sunsetInfo) {
            this.setState({ sunsetInfo: null, loadingRandomSunset: true })
        } else {
            this.setState({ spin: true })
        }
        const randomLocation = _.sample(randomLocations)
        const city = randomLocation.city;
        const lat = randomLocation.lat;
        const long = randomLocation.long;
        const offset = randomLocation.offset;
        this.setState({ lat: lat, long: long, showRandomSunset: true, 
            city: city, offset: offset 
        })
        this.fetchSunset(lat, long);
    }

    // FOMS - fear of missing a sunset

    spin() {
        this.setState({ spin: true })
    }

    reloadPage () {
        window.location.reload()
    }
    renderSunsetError() {
        return (
            <div className="infoContainer">
                <div className="infoBubble errorBubble">
                   <p>We could not get your sunset forecast.</p>
                   <p>If <a onClick={ this.reloadPage.bind(this) }>refreshing</a> the page does not work, try again in 30 minutes.</p>
                </div>
                <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
            </div>
        )
    }
    // renderSunsetSuccess() {
    //     const sunset = this.state.sunsetInfo;
    //     if (this.state.showRandomSunset) {
    //         var locationText = (
    //             <p>{ this.state.city } Suns°et Forecast: </p>
    //         )
    //         var randomLocation = "randomLocation";
    //         const offset = this.state.offset;
    //         var momentTime = moment.utc(sunset.valid_at).utcOffset(offset).format("H:mm");
    //     }
    // }
    // renderLoadingBubble() {
    //     return (
    //         <div className="infoContainer loadingContainer">
    //             <div className="infoBubble loadingBubble">
    //                 <div className="dots"></div>
    //             </div>
    //         </div>
    //     )
    // }
    // renderInfoBubble() {
    //     if (this.state.spin) {
    //         var imgClassName = "spin";
    //         var containerClass = "shrink";
    //     }
    //     return (
    //         <div className={ "sunImageContainer "  + containerClass }>
    //             <img src={ sunInnerImage } alt="sun-inner" className="sunInnerImg" onClick={ this.submitCoordinates.bind(this) } />
    //             <img src={ sunOuterImage } alt="sun-outer" className={ "sunOuterImg " + imgClassName } />
    //         </div>
    //     )
    // }
    // renderLeftSection() {
    //     const sunset = this.state.sunsetInfo;
    //     if (this.state.fetchingError) {
    //         var sunsetInfo = this.renderSunsetError()
    //         var links =  (
    //             <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
    //         )
    //         const linksClassName = "altLinksContainer";
    //     } else {
    //         if (sunset) {
    //             var sunsetInfo = this.renderSunsetSuccess()
    //             var links =  (
    //                 <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
    //             )
    //             const linksClassName = "altLinksContainer";
    //             if (this.state.showRandomSunset) {
    //                 var randomLocation = "randomLocation";
    //             }
    //         } else {
    //             if (this.state.loadingRandomSunset) {
    //                 var displayImage = this.renderLoadingBubble();
    //                 var links =  (
    //                     <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
    //                 )
    //                 var linksClassName = "altLinksContainer";
    //             } else {
    //                 var displayImage = this.renderInfoBubble();
    //                 var links =  (
    //                     <div>
    //                         <a onClick={ this.submitCoordinates.bind(this) } className="showMySunsetLink">Show My Sunset</a>
    //                         <a onClick={ this.showRandomSunset.bind(this) } className="showRandomSunsetLink">Random Sunset</a>
    //                     </div>
    //                 )
    //             }
    //         }
    //     }
    //     return (
    //         <div className="leftContainer">
    //             <div>
    //                 <div className={ "imagesContainer " + randomLocation }>
    //                     { displayImage }
    //                     { sunsetInfo }
    //                 </div>
    //                 <div className={ "linksContainer " + linksClassName }>
    //                     { links }
    //                 </div>
    //             </div>
    //         </div>  
    //     )
    // }
    render() {
        // const loadingSunset = this.state.loadingSunset;
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

const randomLocations = [
    { "city" : "SD", "lat" : 32.7157, "long" : -117.1611, offset: -7 }, { "city" : "DEN", "lat" : 39.7392, "long" : -104.9903, offset: -6 },
    { "city" : "NYC", "lat" : 40.7128, "long" : -74.0060, offset: -4 }, { "city" : "SEA", "lat" : 47.6062, "long" : -122.3321, offset: -7 },
    { "city" : "LA", "lat" : 34.0522, "long" : -118.2437, offset: -7 }, { "city" : "SF", "lat" : 37.7749, "long" : -122.4194, offset: -7 },
    { "city" : "CHI", "lat" : 41.8781, "long" : -87.6298, offset: -5 }, { "city" : "MIA", "lat" : 25.7617, "long" : -80.1918, offset: -4 },
    { "city" : "ATX", "lat" : 30.2672, "long" : -97.7431, offset: -5 }, { "city" : "PHX", "lat" : 33.4484, "long" : -112.0740, offset: -6 } 
]
