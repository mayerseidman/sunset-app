import {
    CREATE_USER,
    CREATE_USER_FAIL,
    INVALID_PHONE_NUMBER,
    DUPLICATE_PHONE_NUMBER,
    CREATE_USER_SUCCESS,
    CLEAR_ERRORS
} from '../types'

export function invalidPhoneNumber() {
  return { type: INVALID_PHONE_NUMBER, payload: "Make sure your phone number is 10 digits :) ." }
}

export function submitUser (phoneNumber, lat, long) {
    return dispatch => {
        dispatch({ type: CREATE_USER })
        return  fetch('/api/create-user', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json'
           },
           body: JSON.stringify({
               user: {
                   phone_number: phoneNumber,
                   lat: lat,
                   long: long
               }
           })
        }).then((response) => {
            if (!response.ok) {
                dispatch({ type: CREATE_USER_FAIL, payload: response });
            } else {
                return response.json();
            }
        }).then((data) => {
            if (data.error) {
                dispatch({ type: DUPLICATE_PHONE_NUMBER, payload: "This phone number is already in our system :) ." });
            } else {
                dispatch({ type: CREATE_USER_SUCCESS });   
            }
        }).catch((error) => {
            dispatch({ type: CREATE_USER_FAIL, payload: error });
        })
    }
}

export function clearErrors() {
    return { type: CLEAR_ERRORS }
}