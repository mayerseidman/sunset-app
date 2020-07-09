import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import React from 'react';
import tether from 'tether';
import 'bootstrap/dist/css/bootstrap.css';

import App from './App';
import { store } from './redux/store'

global.jQuery = require('jquery');
global.Tether = tether;

ReactDOM.render((
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
), document.getElementById('root'))