import { combineReducers } from 'redux';
import sunsetReducer from './sunset';
import userReducer from './user';

export default combineReducers({
	sunset: sunsetReducer,
	user: userReducer
})