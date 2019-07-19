import React, { Component } from 'react';
import './app.css';

export default class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null };
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

        fetch("/api/send", {
            method: 'POST',
            body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then(res => res.json())
          .then(sunset => console.log(sunset))
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
                this.sendIT(position.coords.latitude, position.coords.longitude);
            }.bind(this))
        } else {
          /* geolocation IS NOT available */
        }
        fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => this.setState({ username: user.username }));
    }

    render() {
        return (
            <div>
                <p>Content goes here...</p>
            </div>
        );
    }
}
