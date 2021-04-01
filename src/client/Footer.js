const _ = require('underscore');
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as sunsetActions from './redux/actions/sunset';
import * as userActions from './redux/actions/user';

import './../assets/css/app.css';
import './../assets/css/footer.css';

export class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <footer id="footer">
                <div className="animation"></div>
            </footer>
        )
    }
}

export default connect((state) => ({
    sunset: state.sunset,
    user: state.user
}), { ...sunsetActions, ...userActions })(Footer)
