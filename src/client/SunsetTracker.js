// LIBRARIES //
import React, { Component } from 'react';
import Modal from "react-responsive-modal";

import ErrorDisplay from './ErrorDisplay';
const _ = require('underscore')
const moment = require('moment');
import BarLoader from "react-spinners/BarLoader";

//  IMA GES //
import sunInnerImage from './../images/sun-inner.png';
import sunOuterImage from './../images/sun-outer-shell.png';
import sunFullImage from './../images/sun-full.png';
import questionImage from './../images/question.png';
import sunsetInfoImage from './../images/sunset-info.png';
import cropsImage from './../images/crops.png';

// CSS //
import { css } from "@emotion/core";
import './../css/app.css';

const normalizeInput = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
  
    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return currentValue;
        if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
        return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
};

export default class SunsetTracker extends Component {
    constructor(props) {
        super(props);
        this.state = { pictures: [], username: null, imgName: null, results: null, 
            showSunsetInfo: false, sunsetInfo: null, submissionSuccess: false, spin: false, 
            fetchingError: false, loading: false
         };
    }

    showSunsetInfo() {
        this.setState({ showSunsetInfo: true })
    }

    hideSunsetInfo() {
        this.setState({ showSunsetInfo: false })
    }

    submitCoordinates() {
        if ("geolocation" in navigator) {
          /* geolocation is available */
            this.setState({ spin: true })
            this.getPosition().then((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                this.setState({ lat: lat, long: long })
                this.fetchSunset(lat, long)
            })
        } else {
          /* geolocation IS NOT available */
        }
    }

    getPosition() {
        // Simple wrapper
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej);
        });
    }

    findMyCoordinates() {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            this.setState({ loading: true })
            this.getPosition().then((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                this.setState({ lat: lat, long: long, loading: false  })
            })
        } else {
            /* geolocation IS NOT available */
        }
    }

    fetchSunset(lat, long) { 
        fetch("/api/fetch-sunset", {
            method: 'POST',
            body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then((response) => {
            if (!response.ok) {
                setTimeout(function(){
                    this.setState({ spin :false, fetchingError: true })
                 }.bind(this), 2000)
            } else {
                return response.json();
            }
        }).then((sunset) => {
            var sunset = sunset.sunset;
            setTimeout(function(){
                this.setState({ spin :false, sunsetInfo: sunset, 
                    temperature: Math.floor(sunset.temperature) 
                })
            }.bind(this), 2000)
        })
    }

    submitUser() {
         /* geolocation is available */
        if ("geolocation" in navigator) {
            this.refs.errors.reset();
            var errors = [];

            const lat = this.state.lat;
            const long = this.state.long;
            const phoneNumber = this.refs.phone_number.value.replace(/[^\d]/g, '')
            const phoneRegEx = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/
            const invalidPhoneNumber = !phoneNumber.match(phoneRegEx)
            if (invalidPhoneNumber) {
                errors.push("This phone number does not look right. Phone numbers should have 10 digits.")
                // this.setState({ errorPhoneNumber: true })
                this.refs.errors.setErrors(errors, "invalid");
            } else {
                this.setState({ loading: true })
                fetch('/api/create-user', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       'Accept': 'application/json'
                   },
                   body: JSON.stringify({
                       user: {
                           phone_number: phoneNumber,
                           lat: this.state.lat,
                           long: this.state.long
                       }
                   })
                }).then(response => {
                    return response.json()
                }).then(value => {
                   if (value.error) {
                       errors.push("This phone number is already in our system. Please enter another phone number. ")
                       this.refs.errors.setErrors(errors, "duplicate");
                       this.setState({ loading: false })
                   } else {
                       this.setState({ submissionSuccess: true, loading: false })
                   }
                })
            }
        } else {
          /* geolocation IS NOT available */
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
    
    mouseOver() {
        this.setState({hover: true});
    }
    mouseOut() {
        this.setState({hover: false});
    }

    onOpenModal() {
        this.setState({ open: true });
    };

    onCloseModal() {
        this.setState({ open: false });
    };

    handleChange({ target: { value } }) {   
        this.setState(prevState=> ({ phone: normalizeInput(value, prevState.phone) }));
    };

    changeTemperature(type) {
        const celsius = Math.floor(this.state.sunsetInfo.temperature);
        if (type == "F") {
            this.setState({ showFahrenheitLink: false, temperature: celsius })
        } else {
            const fahrenheit = Math.floor(( (9 * celsius) + 160 ) / 5)
            this.setState({ showFahrenheitLink: true, temperature: fahrenheit })
        }
    }
    renderTopSection() {
        return (
            <div className="topSection">
                <p className="header">Suns°ets are awesome. Don't miss another!</p>
            </div>
        )
    }
    renderMobileText() {
        var sunsetWxLink = (
            <a href="https://sunsetwx.com/" target="_blank">SunsetWx</a>
        )
        return (
            <p className="subHeader webHide">Wondering whether today's sunset will be a banger? Get your sunset forecast here 
                <span className="sunsetwxLink"> (powered by { sunsetWxLink })</span> or sign up for a daily SMS!
            </p>
        )
    }
    renderSunsetError() {
        return (
            <div className="infoContainer">
                <div className="infoBubble errorBubble">
                   <p>We couldn't get your sunset forecast.</p>
                   <p>Try <a onClick={ this.reloadPage.bind(this) }>refreshing</a> the page.</p>
                   <p>If that does not work, try again in 30 minutes.</p>
                </div>
                <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
            </div>
        )
    }
    renderSunsetSuccess() {
        const { open } = this.state;
        const sunset = this.state.sunsetInfo;
        if (this.state.showRandomSunset) {
            var locationText = (
                <p>{ this.state.city } Suns°et Forecast: </p>
            )
            var randomLocation = "randomLocation";
            const offset = this.state.offset;
            var momentTime = moment.utc(sunset.valid_at).utcOffset(offset).format("H:mm");
        } else {
            var momentTime = moment(sunset.valid_at).format("H:mm");
            var locationText = (
                <p>Your Suns°et Forecast: </p>
            )
        }
        if (this.state.showFahrenheitLink) {
            var temperatureWidget = (
                <a className="changeTemperatureLink" onClick={ this.changeTemperature.bind(this, "F") }>F</a>
            ) 
        } else {
            var temperatureWidget = (
                <a className="changeTemperatureLink" onClick={ this.changeTemperature.bind(this, "C") }>C</a>
            ) 
        }
        return (
            <div className="infoContainer">
                <div className="infoBubble">
                    { locationText }
                    <p>Time: { momentTime }</p>
                    <p>
                        Quality: { sunset.quality } ({ Math.floor(sunset.quality_percent) }%)
                        <img src={ questionImage } alt="question" className="questionImage mobileHide" 
                            onMouseOver={this.mouseOver.bind(this)} onMouseOut={this.mouseOut.bind(this)} />
                        <img src={ questionImage } alt="question" className="questionImage webHide" 
                            onClick={ this.onOpenModal.bind(this) } />    
                    </p>
                    <p>Temperature: { this.state.temperature }° { temperatureWidget }</p>
                </div>
                <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
                <Modal open={ open } onClose={ this.onCloseModal.bind(this) } className="modal">
                    <img src={ sunsetInfoImage } alt="question" className="questionImage" />
                </Modal>
            </div>
        )
    }
    renderLoadingBubble() {
        return (
            <div className="infoContainer loadingContainer">
                <div className="infoBubble loadingBubble">
                    <div className="dots"></div>
                </div>
                <img src={ sunFullImage } alt="sun-full" className="sunFullImage" />
            </div>
        )
    }
    renderInfoBubble() {
        if (this.state.spin) {
            var imgClassName = "spin";
            var containerClass = "shrink";
        }
        return (
            <div className={ "sunImageContainer "  + containerClass }>
                <img src={ sunInnerImage } alt="sun-inner" className="sunInnerImg" onClick={ this.submitCoordinates.bind(this) } />
                <img src={ sunOuterImage } alt="sun-outer" className={ "sunOuterImg " + imgClassName } />
            </div>
        )
    }
    renderLeftSection() {
        const sunset = this.state.sunsetInfo;
        if (this.state.fetchingError) {
            var sunsetInfo = this.renderSunsetError()
            var links =  (
                <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
            )
            const linksClassName = "altLinksContainer";
        } else {
            if (sunset) {
                var sunsetInfo = this.renderSunsetSuccess()
                var links =  (
                    <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
                )
                const linksClassName = "altLinksContainer";
                if (this.state.showRandomSunset) {
                    var randomLocation = "randomLocation";
                }
            } else {
                if (this.state.loadingRandomSunset) {
                    var displayImage = this.renderLoadingBubble();
                    var links =  (
                        <a onClick={ this.showRandomSunset.bind(this) }>Show Random Sunset</a>
                    )
                    var linksClassName = "altLinksContainer";
                } else {
                    var displayImage = this.renderInfoBubble();
                    var links =  (
                        <div>
                            <a onClick={ this.submitCoordinates.bind(this) } className="showMySunsetLink">Show My Sunset</a>
                            <a onClick={ this.showRandomSunset.bind(this) } className="showRandomSunsetLink">Random Sunset</a>
                        </div>
                    )
                }
            }
        }
        return (
            <div className="leftContainer">
                <div>
                    <div className={ "imagesContainer " + randomLocation }>
                        { displayImage }
                        { sunsetInfo }
                    </div>
                    <div className={ "linksContainer " + linksClassName }>
                        { links }
                    </div>
                </div>
            </div>  
        )
    }
    renderRightContent() {
        var sunsetWxLink = (
            <a href="https://sunsetwx.com/" target="_blank">SunsetWx</a>
        )
        return (
            <div>
                <img src={ sunsetInfoImage } alt="sunset-info" className="infoImage" style={{ display: this.state.hover ? "inline-block" : "none" }}/>
                <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>                       
                <p className="descriptionText">Wondering whether today's sunset will be a banger? 
                    Get your sunset forecast here (powered by { sunsetWxLink }) or sign up for a daily SMS!
                </p>
                <p>Sunsets are awesome. Dont miss another! Sunsets are awesome. Dont miss another!</p>
                <ErrorDisplay ref="errors"/>
            </div>
        )
    }
    renderLoadingBar(mobile=false) {
        if (mobile) {
            var override = css`
                height: 5px;
                display: inline-block;
                width: 100%;
                margin-bottom: 4px;
            `
        } else {
           var override = css`
               height: 5px;
               display: inline-block;
               width: 175px;
               margin-bottom: 4px;
           `
        }
        return (
            <BarLoader css={ override } color={ "#bbb" } loading={ this.state.loading } />
        )
    }
    renderSubmitButton() {
        return (
            <button onClick={ this.submitUser.bind(this) } className="submitButton"
                ref="submitBtn">Send Suns°ets</button>
        )
    }
    renderCoordinatesButton() {
        return (
            <button onClick={ this.findMyCoordinates.bind(this) } className="findLocationButton">Find My Location</button>
        )
    }
    renderForm() {
        var readyForSubmit = this.state.lat && this.state.long;
        if (readyForSubmit) {
            if (this.state.loading) {
                var loadingBar = this.renderLoadingBar();
            } else {
                var submitButton = this.renderSubmitButton();
            }
        } else {
            if (this.state.loading) {
                var loadingBar = this.renderLoadingBar();
            } else {
                var findCoordinatesButton = this.renderCoordinatesButton();
            }
        }
        if (!this.state.submissionSuccess) {
            return (
                <div className="actionsContainer">
                    <label className="phoneNumberLabel">Phone Number</label>
                    <input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
                        onChange={ this.handleChange.bind(this) } value={ this.state.phone } />
                    { loadingBar }
                    { findCoordinatesButton }
                    { submitButton }
                </div>
            )
        }
    }
    renderBottomMobile() {
        var readyForSubmit = this.state.lat && this.state.long;
           if (readyForSubmit) {
               if (this.state.loading) {
                   var loadingBar = this.renderLoadingBar();
               } else {
                   var submitButton = this.renderSubmitButton();
               }
           } else {
               if (this.state.loading) {
                   var loadingBar = this.renderLoadingBar();
               } else {
                   var findCoordinatesButton = this.renderCoordinatesButton();
            }
        }

        if (this.state.submissionSuccess) {
            var notificationText = (
                <p className="notificationText successNotification">Congrats 🎉! You signed up for a daily suns°et SMS. Enjoy those sunset vibes!</p>    
            )
        }

        // Mobile //
        if (window.innerWidth <= 480 && window.innerHeight <= 820) {
            var loadingBar = this.renderLoadingBar("mobile");
            var formContainer = (
                <div className="formContainer webHide">                       
                    <ErrorDisplay ref="errors"/>
                    <input type="text" className="form-control phoneNumberField" ref="phone_number" placeholder="(123) 456-7890"
                        onChange={ this.handleChange.bind(this) } value={ this.state.phone } />
                    { findCoordinatesButton }
                    { submitButton }
                    { loadingBar }
                </div>
            )
        }

        if (window.innerWidth <= 480 && window.innerHeight <= 820) {
            return (
                <div>
                    { formContainer }
                    { notificationText } 
                </div>
            )
        }
    }
    renderFooter() {
        return (
            <footer className="footer">
                <p className="footerText"><a>Project Docs</a></p>
                <p className="footerText name mobileHide">Made by Mayer</p>
                <p className="footerText"><a>About Me</a></p>
                <p className="footerText name webHide">Made by Mayer</p>
            </footer>
        )
    }

    render() {
        if (this.state.submissionSuccess) {
            var notificationText = (
                <p className="notificationText successNotification">
                    Congrats 🎉! You signed up for a daily suns°et SMS. Enjoy those sunset vibes!
                </p>    
            )
        }

        return (
            <div className="sunsetContainer">
               { this.renderTopSection() }
                <div className="container middleContainer">
                    { this.renderMobileText() }
                    { this.renderLeftSection() }      
                    <div className="rightContainer formContainer">
                        { this.renderRightContent() }
                        { this.renderForm() }
                        { notificationText }
                    </div>
                    { this.renderBottomMobile() }
                </div>
                { this.renderFooter() }
            </div>
        );
    }
}

const randomLocations = [
    { "city" : "SD", "lat" : 32.7157, "long" : -117.1611, offset: -7 }, { "city" : "DEN", "lat" : 39.7392, "long" : -104.9903, offset: -6 },
    { "city" : "NYC", "lat" : 40.7128, "long" : -74.0060, offset: -4 }, { "city" : "SEA", "lat" : 47.6062, "long" : -122.3321, offset: -7 },
    { "city" : "LA", "lat" : 34.0522, "long" : -118.2437, offset: -7 }, { "city" : "SF", "lat" : 37.7749, "long" : -122.4194, offset: -7 },
    { "city" : "CHI", "lat" : 41.8781, "long" : -87.6298, offset: -5 }, { "city" : "MIA", "lat" : 25.7617, "long" : -80.1918, offset: -4 },
    { "city" : "ATX", "lat" : 30.2672, "long" : -97.7431, offset: -5 }, { "city" : "PHX", "lat" : 33.4484, "long" : -112.0740, offset: -6 } 
]
