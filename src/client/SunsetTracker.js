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
        });
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
                this.sendIT(position.coords.latitude, position.coords.longitude);
            }.bind(this))
          console.log("available")
        } else {
          /* geolocation IS NOT available */
        }
        localStorage.setItem("item", "value");
        fetch('/api/getUsername')
        .then(res => res.json())
        .then(user => this.setState({ username: user.username }));

        // fetch("/api/search-sunset")
        // var params = "username=mzseidman@gmail.com&password=Victory251&grant_type=password"
        // var options = fetch('https://sunburst.sunsetwx.com/v1/login', {
        //   method: 'POST',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   body: params
        // })
    }

    render() {
        return (
            <div>
                <p>Content goes here...</p>
            </div>
        );
    }
}
