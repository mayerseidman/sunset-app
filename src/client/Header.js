const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as myConstClass from './Constants';
import SunsetContent from './SunsetContent';
import ReactTooltip from 'react-tooltip';

import './../assets/css/app.css';

import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

import horizontalIcon from "./../assets/images/icons/horizontal-control.png";
import verticalIcon from "./../assets/images/icons/vertical-control.png";
import chevronImage from "./../assets/images/icons/chevron.png";
import colorAvatar from "./../assets/images/color-profile.png";

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var verticalButton = (
            <button type="button" id="vertical-screen" onClick={ this.props.changeOrientation.bind(this, myConstClass.VERTICAL) }>
                <span data-tip="Vertical Layout">
                    <img src={ verticalIcon } alt="vertical" className="vertical-icon" />
                </span>
                <ReactTooltip />
            </button>
        )
        var horizontalButton = (
            <button type="button" id="horizontal-screen" onClick={ this.props.changeOrientation.bind(this, myConstClass.HORIZONTAL) }>
                <span data-tip="Horizontal Layout">
                    <img src={ horizontalIcon } alt="horizontal" className="horizontal-icon" />
                </span>
                <ReactTooltip />
            </button>
        )
        if (this.props.sunset.sunsetSuccess && this.props.sunset.showSunsetResults) {
            var backLink = (
                <span>
                    <img className="backLink" src={ chevronImage } onClick={ this.props.clearResults } data-tip="Go Back"/>
                    <ReactTooltip />
                </span>
            )
        }
        return (
            <header id="header">
                <div className="made-by">
                    <a href="http://mayerseidman.com" target="_blank">
                        <span>Made By</span>
                        <img className="avatar" src={ colorAvatar } />
                    </a>
                    { backLink }
                </div>
                <div className="screen-orientation">
                    { verticalButton }
                    { horizontalButton }
                </div>
            </header>
        )
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(Header)
