import React, { Component } from 'react';
import ReactImage from './react.png';
import ImageUploader from 'react-images-upload';

export default class CityDevelopments extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null };
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
            <div className="cityContainer">
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
