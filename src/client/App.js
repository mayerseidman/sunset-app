import React, { Component } from 'react';
import './app.css';
import CityDevelopments from './CityDevelopments';
import SunsetTracker from './SunsetTracker';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { username: null };
    }

    render() {
        const { username } = this.state;
        return (
            <div>
                <Router>
                    <div>
                        <h2>Welcome to React Router Tutorial</h2>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <Link to={'/'} className="nav-link">Projects</Link> <br/> <br/>
                            <Link to={'/city'} className="nav-link">City</Link> <br/> <br/>
                            <Link to={'/sunset'} className="nav-link">Sunset</Link>
                        </nav>
                        <Switch>
                            <Route path='/city' component={ CityDevelopments } />
                            <Route path='/sunset' component={ SunsetTracker } />
                        </Switch>
                     </div>
                </Router>
            </div>
        );
    }
}

// <Route exact path='/' component={Home} />
