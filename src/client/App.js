import React, { Component } from 'react';
import '../assets/css/app.css';
import SunsetContent from './SunsetContent';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route path='/' component={ SunsetContent } />
                        </Switch>
                    </div>
                </Router> 
            </div>
        );
    }
}
