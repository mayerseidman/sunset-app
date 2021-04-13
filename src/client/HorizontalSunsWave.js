const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

import sunsHorizontalImg from "./../assets/images/suns/new-hz.png";

import './../assets/css/app.css';
import './../assets/css/horizontal_suns_wave.css';

export class HorizontalSunsWave extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <footer id="footer">
                <div className="animated-scene">
                    <div className="animated-scene__frame">
                        <img className="animated-scene__frame__img" src={ sunsHorizontalImg } />
                    </div>
                </div>
            </footer>
        )
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(HorizontalSunsWave)