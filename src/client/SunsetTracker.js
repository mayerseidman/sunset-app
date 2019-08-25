import React, { Component } from 'react';
import './../css/app.css';
import SunsetPhoneImage from './phone-view.png';
import toaster from 'toasted-notes';
import 'toasted-notes/src/styles.css';
const _ = require('underscore')

export default class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null, 
            showSunsetInfo: false, sunsetInfo: null, errorPhoneNumber: false, submissionSuccess: false };
    }

    showSunsetInfo() {
        this.setState({ showSunsetInfo: true })
    }

    hideSunsetInfo() {
        this.setState({ showSunsetInfo: false })
    }

    sendIT(lat, long) {
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
            body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then(res => res.json().then(sunset => this.setState({ sunsetInfo: JSON.stringify(sunset.quality) })))
    }

    submitInfo() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
            // navigator.geolocation.getCurrentPosition(function(position) {
                var lat = this.state.lat;
                var long = this.state.long;
                var phoneNumber = this.refs.phone_number.value.trim()
                var phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
                console.log(lat, long)
                const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
                if (invalidPhoneNumber) {
                    this.setState({ errorPhoneNumber: true })
                } else {
                    console.log("ALL GROOVY")
                    this.setState({ submissionSuccess: true })
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
                   })
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
        // if ("geolocation" in navigator) {
        //   /* geolocation is available */
        //   console.log("GEOOOOOO")
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         var lat = position.coords.latitude;
        //         var long = position.coords.longitude;
        //         this.sendIT(lat, long);
        //     }.bind(this))
        // } else {
        //   /* geolocation IS NOT available */
        // }

        fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => this.setState({ username: user.username }));
    }

    render() {
        if (this.state.showSunsetInfo) {
            var sunsetInfo = (<p>{ this.state.sunsetInfo }</p>)
            var viewLink = (<a onClick={ this.hideSunsetInfo.bind(this) }>Hide Info</a>)
        } else {
            var viewLink = (<a onClick={ this.showSunsetInfo.bind(this) }>Show Info</a>)
        }

        if (this.state.errorPhoneNumber) {
            var errorText = (<p>Error HERE with phone number!</p>)
        }
        var readyForSubmit = this.state.lat && this.state.long;
        if (readyForSubmit) {
            var submitButton = (
                <button onClick={ this.submitInfo.bind(this) }>Send Sunsets</button>
            )
        }

        const className = this.state.submissionSuccess ? 'success' : 'hidden'
        var notificationText = (
            <p className={ "notificationText " + className }>You -DID ITTTTTTT</p>    
        )
        return (
            <div className="sunsetContainer">
                <div className="topSection">
                    <p className="header">Sunsets are awesome. Dont miss another!</p>
                    <p className="subHeader">Further explanation goes here…Further explanation goes here… Further explanation goes here…  how does this work?</p>
                </div>
                <div className="middleContainer">
                    <div className="leftContainer">
                        <img src={ SunsetPhoneImage } alt="sunset-phone"/>
                        <div className="linksContainer">
                            <a href="">Show My Sunset</a>
                            <a onClick={ this.showRandomSunset.bind(this) }>Random Sunset</a>
                        </div>
                    </div>        
                    <div className="rightContainer">
                        { notificationText }                        
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        { errorText }
                        <input type="text" ref="phone_number" placeholder="phone number..."/>
                        <button onClick={ this.findMyCoordinates.bind(this) }>Find Coordinates</button>
                        { submitButton }
                    </div>
                </div>
                { viewLink }
                { sunsetInfo }
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
