import React, { Component } from 'react';
import './../css/app.css';
import SunsetPhoneImage from './phone-view.png';
const _ = require('underscore')

export default class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null, 
            showSunsetInfo: false, sunsetInfo: null };
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
        // var errors = ....
        // if (true) {
        //     errors.push()
        // } else if (true) {
        //     errors.push()
        // }

        // if (errors.length > 0) {

        // } else {
        //     SUBMIT HERE
        // }
        if ("geolocation" in navigator) {
          /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords.latitude, position.coords.longitude)
                var lat = position.coords.latitude;
                var long = position.coords.longitude;

                fetch('/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: {
                            phone_number: this.refs.phone_number.value,
                            lat: lat,
                            long: long
                        }
                    })
                });
            }.bind(this))
        } else {
          /* geolocation IS NOT available */
        }
        
        console.log("SUBMITTED", this.refs.phone_number.value)
    }

    findCoordinates() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Lat: " + position.coords.latitude, "Long: " + position.coords.longitude)
        })
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

    componentDidMount() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
          console.log("GEOOOOOO")
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                this.sendIT(lat, long);
            }.bind(this))
        } else {
          /* geolocation IS NOT available */
        }

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
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                        <input type="text" ref="phone_number" placeholder="phone number..."/>
                        <input type="text" ref="location" placeholder="timezone..." /> 
                        <button onClick={ this.submitInfo.bind(this) }>Send Sunsets</button>
                    </div>
                </div>
                { viewLink }
                { sunsetInfo }
                <button onClick={ this.findCoordinates.bind(this) }>Find Coordinates</button>
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
