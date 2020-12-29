import { ADD_PERIOD, GET_PERIOD, UPDATE_PERIOD, GET_ACTIVE_PERIOD } from '../actions/types';

const initialState = {
    response: []
};


export default (state = initialState, action) => {

    if (action.payload) {
        switch (action.type) {

            case ADD_PERIOD: {
                return {
                    ...state,
                    response: [...state.response, action.payload.response]
                }
            }

            case GET_PERIOD: {
                return {
                    ...state,
                    ...{ response: action.payload.response }
                }
            }

            case UPDATE_PERIOD: {
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

            case GET_ACTIVE_PERIOD: {
                return {
                    ...state,
                    ...{ activeResponse: action.payload.response }
                }
            }

            default:
                return state
        }
    } else {
        return state
    }
};
