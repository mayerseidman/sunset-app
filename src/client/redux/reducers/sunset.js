import {
	LOCATION_ERROR,
	CLEAR_LOCATION_ERROR,
	CLEAR_SUNSET_RESULTS,
	FETCH_SUNSET,
	FETCH_SUNSET_FAIL,
	FETCH_SUNSET_SUCCESS
} from '../types'

const initialState = {
	locationError: false,
	loading: false,
	error: null,
	info: null,
	sunsetSuccess: false,
	showSunsetResults: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_SUNSET:
			return { ...state, loading: true }
		case LOCATION_ERROR:
			return { ...state, loading: false, locationError: true }
		case CLEAR_LOCATION_ERROR:
			return { ...state, loading: false, locationError: false }
		case FETCH_SUNSET_FAIL:
			return { ...state, loading: false, error: action.payload }
		case FETCH_SUNSET_SUCCESS:
			return {
				...state,
				loading: false,
				info: action.payload,
				sunsetSuccess: true,
				showSunsetResults: true
			}
		case CLEAR_SUNSET_RESULTS:
			return { ...state, showSunsetResults: false}
		default:
			return state;
	}
}