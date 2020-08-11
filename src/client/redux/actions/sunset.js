import {
    LOCATION_ERROR,
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
            dispatch({ type: FETCH_SUNSET_SUCCESS, payload: sunset });
        }).catch((error) => {
            dispatch({ type: FETCH_SUNSET_FAIL, payload: error });
        })
    }
}

export function triggerLocationError() {
    console.log("HOOR")
    return { type: LOCATION_ERROR }
}