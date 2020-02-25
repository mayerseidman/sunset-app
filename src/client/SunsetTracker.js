import React, { Component } from 'react';
import './../css/app.css';
import sunInnerImage from './sun-inner.png';
import sunOuterImage from './sun-outer-shell.png';
import sunFullImage from './sun-full.png';

import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';
import ErrorDisplay from './ErrorDisplay';
const _ = require('underscore')
const moment = require('moment');

export default class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null, 
            showSunsetInfo: false, sunsetInfo: null, ssubmissionSuccess: false, spin: false };
    }

    showSunsetInfo() {
        this.setState({ showSunsetInfo: true })
    }

    hideSunsetInfo() {
        this.setState({ showSunsetInfo: false })
    }

    findCoordinates() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
          this.setState({ spin: true })
          console.log("GEOOOOOO")
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                this.setState({ lat: lat, long: long  })
                console.log(lat, long)
                this.sendIT(lat, long)
            }.bind(this))
        } else {
          /* geolocation IS NOT available */
        }
    }

    sendIT() {
        // var params = "username=mzseidman@gmail.com&password=Victory251&grant_type=password"
        // fetch('api/send', {
        //     method: 'POST',
        //     headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body: params
        // })
        console.log("send it function")
        fetch("/api/send", {
            method: 'POST',
            body: JSON.stringify({ lat: this.state.lat, long: this.state.long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then(res => res.json().then(sunset =>
            setTimeout(function(){
                this.setState({ spin :false, sunsetInfo: sunset.quality });
            }.bind(this), 2000))
        )
    }

    submitInfo() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
            // navigator.geolocation.getCurrentPosition(function(position) {
                this.refs.errors.reset();
                var errors = [];

                var lat = this.state.lat;
                var long = this.state.long;
                var phoneNumber = this.refs.phone_number.value.replace(/[^\d]/g, '')
                var phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
                console.log(lat, long)
                const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
                if (invalidPhoneNumber) {
                    errors.push("Phone numbers must have 10 digits. Here's a simple format that works: 123-123-1234.")
                    // this.setState({ errorPhoneNumber: true })
                    this.refs.errors.setErrors(errors);
                } else {
                    console.log("Phone Number looks groovy")
                    // fetch("/api/sendIntroductoryText", {
                    //     method: 'POST',
                    //     body: JSON.stringify({ phoneNumber: phoneNumber }), // stringify JSON
                    //     headers: new Headers({ "Content-Type": "application/json" }) // add headers
                    // }).then(res => res.json().then(console.log("BATMAN!!")))
                    // setTimeout(() => {
                    //     this.setState({ 
                    //         submissionSuccess: false     
                    //     });
                    // }, 3000)
                   fetch('/api/submit-form', {
                       method: 'POST',
                       headers: {
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify({
                           user: {
                               phone_number: phoneNumber,
                               lat: this.state.lat,
                               long: this.state.long
                           }
                       })
                   }).then(res => res.json().then(function(value) {
                        console.log(value)
                        if (value) {
                            errors.push("Please enter another number. This number is already in our system.")
                            this.refs.errors.setErrors(errors);
                        } else {
                            this.setState({ submissionSuccess: true })
                        }
                   }.bind(this)))
                }
            // }.bind(this))
        } else {
          /* geolocation IS NOT available */
        }
    }

    findMyCoordinates() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                this.setState({ lat: lat, long: long  })
            }.bind(this))
        } else {

        }
    }

    showRandomSunset() {
        var randomLocation = _.sample(randomLocations)
        var city = randomLocation.city;
        var lat = randomLocation.lat;
        var long = randomLocation.long;
        // console.log(city, lat, long)
        this.sendIT(lat, long);
        this.setState({ pictures: city })
    }


    // FOMS - fear of missing a sunset

    componentDidMount() {
        fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => this.setState({ username: user.username }));
    }

    spin() {
        console.log("spin spin")
        this.setState({ spin: true })
    }

    render() {
        var sunset = this.state.sunsetInfo;
        if (sunset) {
            var momentTime = moment(sunset.quality.valid_at).format("H:mm");
            var sunsetInfo = (
                <div className="infoContainer">
                    <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
                    <div className="infoBubble">
                        <p>Your Suns°et Forecast: </p>
                        <p>Time: { momentTime }</p>
                        <p>Quality: { sunset.quality } ({ Math.floor(sunset.quality_percent) }%)</p>
                        <p>Temperature: { Math.floor(sunset.temperature) }°</p>
                    </div>
                </div>
            )
            var links =  (
                <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
            )
            var linksClassName = "altLinksContainer";
        } else {
            if (this.state.spin) {
                var imgClassName = "spin";
            }
            var images = (
                <span>
                    <img src={ sunInnerImage } alt="sun-inner" className="sunInnerImg" onClick={ this.findCoordinates.bind(this) } />
                    <img src={ sunOuterImage } alt="sun-outer" className={ "sunOuterImg " + imgClassName } />
                </span>
            )
            var links =  (
                <div>
                    <a onClick={ this.findCoordinates.bind(this) } className="showMySunsetLink">Show My Sunset</a>
                    <a onClick={ this.showRandomSunset.bind(this) } className="showRandomSunsetLink">Random Sunset</a>
                </div>
            )
        }

        if (this.state.errorPhoneNumber) {
            var errorText = (<p>Error HERE with phone number!</p>)
        }
        var readyForSubmit = this.state.lat && this.state.long;
        if (readyForSubmit) {
            var submitButton = (
                <button onClick={ this.submitInfo.bind(this) } className="submitButton">Send That Shade</button>
            )
        }

        const className = this.state.submissionSuccess ? 'success' : 'hidden'
        var notificationText = (
            <p className={ "notificationText " + className }>You -DID ITTTTTTT</p>    
        )
        if (!this.state.lat || !this.state.long) {
            var findCoordinatesButton = (
                <button onClick={ this.findMyCoordinates.bind(this) }>Find My Location</button>
            )
        }
        return (
            <div className="sunsetContainer">
                <div className="topSection">
                    <p className="header">Sunsets are awesome. Dont miss another!</p>
                </div>
                <div className="container middleContainer">
                    <p className="subHeader">Further explanation goes here…Further explanation goes here… Further explanation goes here…  how does this work?</p>
                    <div className="leftContainer">
                        <div className="imagesContainer">
                            { images }
                            { sunsetInfo }
                        </div>
                        <div className={ "linksContainer " + linksClassName }>
                            { links }
                        </div>
                    </div>        
                    <div className="rightContainer">
                        { notificationText }                        
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <ErrorDisplay ref="errors"/>
                        <input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="phone number..."/>
                        { findCoordinatesButton }
                        { submitButton }
                    </div>
                </div>
            </div>
        );
    }
}

var randomLocations = [
    { "city" : "San Diego", "lat" : 32.7157, "long" : -117.1611 }, { "city" : "New York City", "lat" : 40.7128, "long" : -74.0060 }, { "city" : "Los Angeles", "lat" : 34.0522, "long" : -118.2437 }, 
    { "city" : "Chicago", "lat" : 41.8781, "long" : -87.6298 }, { "city" : "Miami", "lat" : 25.7617, "long" : -80.1918 }, { "city" : "Philadelphia", "lat" : 39.9526, "long" : -75.1652 }, 
    { "city" : "Austin", "lat" : 30.2672, "long" : -97.7431 }, { "city" : "Boston", "lat" : 42.3601, "long" : -71.0589 }, { "city" : "Seattle", "lat" : 47.6062, "long" : -122.3321 }, 
    { "city" : "Denver", "lat" : 39.7392, "long" : -104.9903 }, { "city" : "San Francisco", "lat" : 37.7749, "long" : -122.4194 }, { "city" : "Toronto", "lat" : 43.6532, "long" : -79.3832 },
    { "city" : "Phoenix", "lat" : 33.4484, "long" : -112.0740 }, { "city" : "Houston", "lat" : 29.7604, "long" : -95.3698 }
]
