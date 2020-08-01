import React, { Component } from 'react';
import '../assets/css/app.css';
import SunsetTracker from './SunsetTracker';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const nav = (
            <div>
                <nav  className="nav">
                    <ul>
                        <li  className="nav-primary"><Link to={'/'} className="navLink">Projects</Link></li>
                        <li  className="nav-primary"><Link to={'/sunset'} className="navLink">Sunset</Link></li>
                    </ul>
                </nav>
            </div> 
        )
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route path='/' component={ SunsetTracker } />
                        </Switch>
                    </div>
                </Router> 
            </div>
        );
    }
}
