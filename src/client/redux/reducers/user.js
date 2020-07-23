import {
	CREATE_USER,
	CREATE_USER_FAIL,
    INVALID_PHONE_NUMBER,
    DUPLICATE_PHONE_NUMBER,
	CREATE_USER_SUCCESS,
	CLEAR_ERRORS
} from '../types'

const initialState = {
	loading: false,
	errors: [],
	error: null,
	invalidPhoneNumber: false,
	duplicatePhoneNumber: false,
	submissionSuccess: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case CREATE_USER:
			return { ...state, loading: true }
		case CREATE_USER_SUCCESS:
			return { 
				...state, 
				errors: [], 
				loading: false,
				invalidPhoneNumber: false,
				duplicatePhoneNumber: false,
				submissionSuccess: true
			}
		case CREATE_USER_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			}
		case INVALID_PHONE_NUMBER:
			return {
				...state,
				invalidPhoneNumber: true,
				errors: [action.payload]
			}
		case DUPLICATE_PHONE_NUMBER:
			return {
				...state,
				loading: false,
				duplicatePhoneNumber: true,
				errors: [action.payload]
			}
		case CLEAR_ERRORS:
			return {
				...state,
				invalidPhoneNumber: false,
				duplicatePhoneNumber: false
			}
		default:
			return state;
	}
}