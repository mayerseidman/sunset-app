import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

const middleware = [thunk]

export const store = createStore(
	reducers,
	composeWithDevTools(applyMiddleware(...middleware))
);