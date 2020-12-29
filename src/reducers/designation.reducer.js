import { ADD_DESIGNATION, UPDATE_DESIGNATION, GET_DESIGNATION, GET_ACTIVE_DESIGNATION, GET_FILTER_DESIGNATION } from '../actions/types';

const initialState = {
    response: []
};


export default (state = initialState, action) => {

    if (action.payload) {
        switch (action.type) {

            case ADD_DESIGNATION: {
                return {
                    ...state,
                    response: [...state.response, action.payload.response]
                }
            }

            case GET_DESIGNATION: {
                return {
                    ...state,
                    ...{ response: action.payload.response }
                }
            }

            case UPDATE_DESIGNATION: {
                return {
                    ...state,
                    response: state.response.map(data => {
                        if (data._id === action.payload.response._id) {
                            return action.payload.response
                        }
                        return data
                    })
                }
            }

            case GET_ACTIVE_DESIGNATION: {
                return {
                    ...state,
                    ...{ activeResponse: action.payload.response }
                }
            }

            case GET_FILTER_DESIGNATION: {
                return {
                    ...state,
                    ...{ filterDesignation: action.payload.response }
                }
            }

            default:
                return state
        }
    } else {
        return state
    }
};
