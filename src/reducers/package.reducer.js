import { ADD_PACKAGE, GET_PACKAGE, UPDATE_PACKAGE, DELETE_PACKAGE, GET_PACKAGE_BY_ID, GET_ACTIVE_PACKAGE } from '../actions/types';

const initialState = {
    response: [],
    active: []
};


export default (state = initialState, action) => {

    if (action.payload) {
        switch (action.type) {

            case ADD_PACKAGE: {
                return {
                    ...state,
                    response: [...state.response, action.payload.response]
                }
            }

            case GET_PACKAGE: {
                return {
                    ...state,
                    ...{ response: action.payload.response }
                }
            }

            case GET_ACTIVE_PACKAGE: {
                return {
                    ...state,
                    ...{ active: action.payload.response }
                }
            }

            case GET_PACKAGE_BY_ID: {
                return {
                    ...state,
                    ...{ packageById: action.payload.response }
                }
            }

            case UPDATE_PACKAGE: {
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

            case DELETE_PACKAGE: {
                return {
                    ...state,
                    response: state.response.filter(data => data._id !== action.payload.response._id)
                }
            }

            default:
                return state
        }
    } else {
        return state
    }
};
