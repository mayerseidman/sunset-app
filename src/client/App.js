import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import ImageUploader from 'react-images-upload';

export default class App extends Component {
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
        var params = "username=mzseidman@gmail.com&password=Victory251&grant_type=password"
        var options = fetch('https://sunburst.sunsetwx.com/v1/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        })
    }

    onDrop(picture) {
        var imgName = picture[0].name;
        console.log(picture[0])
        this.setState({
            pictures: this.state.pictures.concat(picture),
            imgName: imgName,
        });
    }

    extractText() {
        fetch('api/extractText?imgName=' + this.state.imgName)
        .then(res => res.json())
        .then(image => this.setState({ results: image.text }))
    }

    render() {
        const { username } = this.state;
        return (
            <div>
                <ImageUploader
                    withIcon={ true }
                    buttonText='Choose images'
                    onChange={ this.onDrop.bind(this) }
                    imgExtension={ ['.jpg', '.gif', '.png', '.gif'] }
                    maxFileSize={ 5242880 }
                  />
                {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
                <p>HIP HIP HOORAY</p>
                <a onClick={ this.extractText.bind(this) }>GET TEXT FROM IMAGE</a>
                <p>{ this.state.results }</p>
            </div>
        );
    }
}
