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
            showSunsetInfo: false, sunsetInfo: null, submissionSuccess: false, spin: false, 
            fetchingError: false
         };
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

    sendIT(lat, long) { 
        console.log("send it function", lat, long)
        fetch("/api/send", {
            method: 'POST',
            body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then((response) => {
            if (!response.ok) {
                setTimeout(function(){
                    console.log(response.status, "ERROR")
                    this.setState({ spin :false, fetchingError: true })
                 }.bind(this), 2000)
            } else {
                console.log("SUCCESS")
                return response.json();
            }
        }).then((sunset) => {
            setTimeout(function(){
                this.setState({ spin :false, sunsetInfo: sunset.quality })
            }.bind(this), 2000)
        })
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
        this.setState({ spin: true })
        var randomLocation = _.sample(randomLocations)
        var city = randomLocation.city;
        var lat = randomLocation.lat;
        var long = randomLocation.long;
        var offset = randomLocation.offset;
        console.log(city, lat, long)
        this.setState({ lat: lat, long: long, showRandomSunset: true, city: city, offset: offset })
        this.sendIT(lat, long);
        // this.setState({ pictures: city })
    }


    // FOMS - fear of missing a sunset

    componentDidMount() {
        fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => this.setState({ username: user.username }));
        var testDateUtc = moment.utc("2015-01-30 12:00:00");
        var localDate = moment(testDateUtc).local();
    }

    spin() {
        console.log("spin spin")
        this.setState({ spin: true })
    }

    reloadPage () {
        window.location.reload()
    }

    render() {
        var sunset = this.state.sunsetInfo;
        if (this.state.fetchingError) {
            var sunsetInfo = (
                <div className="infoContainer">
                    <div className="infoBubble errorBubble">
                       <p>We couldn't get your sunset forecast.</p>
                       <p>Try <a onClick={ this.reloadPage.bind(this) }>refreshing</a> the page.</p>
                       <p>If that does not work, try again in 30 minutes.</p>
                    </div>
                    <img src={ sunFullImage } alt="sun-full" className="errorImg" />
                </div>
            )
            var links =  (
                <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
            )
            var linksClassName = "altLinksContainer";
        } else {
            if (sunset) {
                if (this.state.showRandomSunset) {
                    var locationText = (
                        <p>{ this.state.city } Suns°et Forecast: </p>
                    )
                    var randomLocation = "randomLocation";
                    var offset = this.state.offset;
                    var momentTime = moment.utc(sunset.valid_at).utcOffset(offset).format("H:mm");
                } else {
                    var locationText = (
                        <p>Your Suns°et Forecast: </p>
                    )
                    var momentTime = moment(sunset.valid_at).format("H:mm");
                }
                
                var sunsetInfo = (
                    <div className="infoContainer">
                        <div className="">
                            <div className="infoBubble">
                                { locationText }
                                <p>Time: { momentTime }</p>
                                <p>Quality: { sunset.quality } ({ Math.floor(sunset.quality_percent) }%)</p>
                                <p>Temperature: { Math.floor(sunset.temperature) }°</p>
                            </div>
                        </div>
                        <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
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
        if (this.state.submissionSuccess) {
            var notificationText = (
                <p className={ "notificationText " + className }>You -DID ITTTTTTT</p>    
            )
        }
        if (!this.state.lat || !this.state.long) {
            var findCoordinatesButton = (
                <button onClick={ this.findMyCoordinates.bind(this) } className="findLocationButton">Find My Location</button>
            )
        }
        return (
            <div className="sunsetContainer">
                <div className="topSection">
                    <p className="header">Sunsets are awesome. Don't miss another!</p>
                </div>
                <div className="container middleContainer">
                    <p className="subHeader webHide">Wondering whether today's sunset will be a banger? Get your sunset forecast here <span className="sunsetwxLink">(powered by <a href="https://sunsetwx.com/" target="_blank">SunsetWx</a>)</span> or sign up for a daily SMS...!</p>
                    <div className="leftContainer">
                        <div>
                            <div className={ "imagesContainer " + randomLocation}>
                                { images }
                                { sunsetInfo }
                            </div>
                            <div className={ "linksContainer " + linksClassName }>
                                { links }
                            </div>
                        </div>
                    </div>        
                    <div className="rightContainer formContainer">
                        { notificationText } 
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>                       
                        <p className="descriptionText">Wondering whether today's sunset will be a banger? Get your sunset forecast here (powered by <a href="https://sunsetwx.com/" target="_blank">SunsetWx</a>) or sign up for a daily SMS...!</p>
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <ErrorDisplay ref="errors"/>
                        <div className="actionsContainer">
                            <input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="phone number..."/>
                            { findCoordinatesButton }
                            { submitButton }
                        </div>
                    </div>
                    <div className="formContainer webHide">
                        { notificationText }                        
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
    { "city" : "SD", "lat" : 32.7157, "long" : -117.1611, offset: -7 }, { "city" : "NYC", "lat" : 40.7128, "long" : -74.0060, offset: -4 }, { "city" : "LA", "lat" : 34.0522, "long" : -118.2437, offset: -7 }, 
    { "city" : "CHI", "lat" : 41.8781, "long" : -87.6298, offset: -5 }, { "city" : "Miami", "lat" : 25.7617, "long" : -80.1918, offset: -4 }, { "city" : "Denver", "lat" : 39.7392, "long" : -104.9903, offset: -6 },
    { "city" : "Austin", "lat" : 30.2672, "long" : -97.7431, offset: -5 }, { "city" : "SEA", "lat" : 47.6062, "long" : -122.3321, offset: -7 }, { "city" : "SF", "lat" : 37.7749, "long" : -122.4194, offset: -7 },
    { "city" : "PHX", "lat" : 33.4484, "long" : -112.0740, offset: -6 } 
]
