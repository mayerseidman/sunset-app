import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import App from './App';
global.jQuery = require('jquery');
import 'bootstrap/dist/css/bootstrap.css';

import tether from 'tether';
global.Tether = tether;

ReactDOM.render((
	<BrowserRouter>
		<App />
	</BrowserRouter>
), document.getElementById('root'))