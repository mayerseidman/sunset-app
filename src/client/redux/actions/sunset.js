import {
    LOCATION_ERROR,
    CLEAR_LOCATION_ERROR,
    CLEAR_SUNSET_RESULTS,
	FETCH_SUNSET,
	FETCH_SUNSET_FAIL,
	FETCH_SUNSET_SUCCESS
} from '../types'

export function fetchSunset(lat, long) {
    return dispatch => {
        dispatch({ type: FETCH_SUNSET })
        return fetch("/api/fetch-sunset", {
            method: 'POST',
            body: JSON.stringify({ lat: lat, long: long }), // stringify JSON
            headers: new Headers({ "Content-Type": "application/json" }) // add headers
        }).then((response) => {
            if (!response.ok) {
                dispatch({ type: FETCH_SUNSET_FAIL, payload: response });
            } else {
                return response.json();
            }
        }).then((data) => {
            const { sunset } = data;
            sunset.lat = lat;
            sunset.long = long;
            dispatch({ type: FETCH_SUNSET_SUCCESS, payload: sunset });
        }).catch((error) => {
            dispatch({ type: FETCH_SUNSET_FAIL, payload: error });
        })
    }
}

export function triggerLocationError() {
    return { type: LOCATION_ERROR }
}

export function clearLocationError() {
    return { type: CLEAR_LOCATION_ERROR }
}

export function clearSunsetResults() {
    return { type: CLEAR_SUNSET_RESULTS }
}