const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import './../assets/css/notifications.css';

import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

import errorImage from "./../assets/images/icons/error.png";

export class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var sunset = this.props.sunset;
        var user = this.props.user;
        if (sunset.error) {
            var notificationStatus = "Forecast Error 👎";
            var notificationText = "We weren't able to get your sunset forecast. Please refresh this page and try again. Still no luck? Try again in 30 minutes.";
        } else if (sunset.locationError) {
            var notificationStatus = "Location Error 🧭";
            var notificationText = "Please turn on your location permissions so we can get your sunset forecast.";
        } else if (user.duplicatePhoneNumber || user.invalidPhoneNumber) {
            var notificationStatus = "Phone Number Error ☎️";
            var notificationText = this.props.user.errors[0];
        } else if (this.props.user.submissionSuccess) {
            var notificationStatus = "Signed Up 🎉";
            var notificationText = "You are now signed up for a daily sunset SMS. Enjoy those sunset vibes!";
        }
        if (this.props.user.submissionSuccess) {
            var image = <img className="check" src={ checkImage } />;
            var dividingLine = <span className="line"></span>;
        } else {
            var image = <img className="check" src={ errorImage } />;
            var dividingLine = <span className="line error"></span>;
        }
        var notificationContainer = (
            <div className="notificationContainer">
                { dividingLine }
                { image }
                <div className="notificationText">
                    <p className="status">{ notificationStatus }</p><span className="escape" onClick={ this.props.closeNotification }>X</span>
                    <p className="text">{ notificationText }</p>
                </div>
            </div>
        )
        return notificationContainer;
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(Notification)
